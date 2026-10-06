#!/usr/bin/env python3
"""Prepare English Notes release assets and Release Manifest v1 metadata.

This tool never publishes, creates a GitHub Release, or enables updates.
It refuses to run unless Android, Windows and browserExtension all remain disabled=true.
"""
import argparse
import hashlib
import json
import shutil
from pathlib import Path

DEFAULT_REPO = "morrowframe/english-notes-release"


def sha256_and_size(path: Path):
    digest = hashlib.sha256()
    size = 0
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
            size += len(chunk)
    return digest.hexdigest(), size


def package(package_id, delivery, architecture, url, digest, size, **extra):
    item = {
        "packageId": package_id,
        "delivery": delivery,
        "architecture": architecture,
        "downloadUrl": url,
        "sha256": digest,
        "fileSize": size,
    }
    item.update(extra)
    return item


def main():
    parser = argparse.ArgumentParser(description="Prepare a disabled English Notes release bundle")
    parser.add_argument("--manifest", default="release-manifest.json")
    parser.add_argument("--android-apk", required=True)
    parser.add_argument("--windows-setup", required=True)
    parser.add_argument("--windows-portable", required=True)
    parser.add_argument("--extension-zip", required=True)
    parser.add_argument("--output-dir", default="prepared-release")
    parser.add_argument("--repo", default=DEFAULT_REPO)
    parser.add_argument("--tag", help="GitHub Release tag; defaults to v<releaseVersion>")
    parser.add_argument("--windows-arch", choices=["amd64", "arm64", "x86"], default="amd64")
    args = parser.parse_args()

    manifest_path = Path(args.manifest)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("manifestSchemaVersion") != 1:
        raise SystemExit("Only Release Manifest v1 is supported.")

    platforms = manifest.get("platforms", {})
    required = ("android", "windows", "browserExtension")
    if any(name not in platforms for name in required):
        raise SystemExit("Manifest must contain android, windows and browserExtension.")
    for name in required:
        if platforms[name].get("updatePolicy", {}).get("disabled") is not True:
            raise SystemExit(
                f"Refusing to prepare: platforms.{name}.updatePolicy.disabled must stay true."
            )

    release_version = manifest["releaseVersion"]
    tag = args.tag or f"v{release_version}"
    base_url = f"https://github.com/{args.repo}/releases/download/{tag}/"
    manifest["releaseNotesUrl"] = f"https://github.com/{args.repo}/releases/tag/{tag}"

    versions = {
        "android": platforms["android"]["appVersion"],
        "windows": platforms["windows"]["appVersion"],
        "extension": platforms["browserExtension"]["appVersion"],
    }
    inputs = {
        "android": Path(args.android_apk),
        "setup": Path(args.windows_setup),
        "portable": Path(args.windows_portable),
        "extension": Path(args.extension_zip),
    }
    for key, path in inputs.items():
        if not path.is_file():
            raise SystemExit(f"Missing artifact: {key}: {path}")

    names = {
        "android": f"EnglishNotes-Android-{versions['android']}.apk",
        "setup": f"EnglishNotes-Windows-{versions['windows']}-Setup.exe",
        "portable": f"EnglishNotes-Windows-{versions['windows']}-Portable.zip",
        "extension": f"EnglishNotes-Extension-{versions['extension']}.zip",
    }

    output = Path(args.output_dir)
    assets = output / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    metadata = {}
    for key, source in inputs.items():
        destination = assets / names[key]
        shutil.copy2(source, destination)
        digest, size = sha256_and_size(destination)
        metadata[key] = {"sha256": digest, "size": size}

    platforms["android"]["packages"] = [
        package(
            "android-apk-universal", "apk", "universal",
            base_url + names["android"], metadata["android"]["sha256"], metadata["android"]["size"]
        )
    ]
    platforms["windows"]["packages"] = [
        package(
            f"windows-setup-{args.windows_arch}", "setup", args.windows_arch,
            base_url + names["setup"], metadata["setup"]["sha256"], metadata["setup"]["size"]
        ),
        package(
            f"windows-portable-{args.windows_arch}", "portable", args.windows_arch,
            base_url + names["portable"], metadata["portable"]["sha256"], metadata["portable"]["size"]
        ),
    ]
    # Release Manifest v1 already uses extensionStore for the browser-extension
    # advisory delivery slot. Keep that existing protocol instead of inventing a new delivery value.
    platforms["browserExtension"]["packages"] = [
        package(
            "browser-extension-zip", "extensionStore", "universal",
            base_url + names["extension"], metadata["extension"]["sha256"], metadata["extension"]["size"],
            storeStatus="available"
        )
    ]

    # Fail closed: preparation must never activate the update channel.
    for name in required:
        manifest["platforms"][name]["updatePolicy"]["disabled"] = True

    manifest_output = output / "release-manifest.json"
    manifest_output.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (output / "SHA256SUMS").write_text(
        "".join(
            f"{metadata[key]['sha256']}  {names[key]}\n"
            for key in ("android", "setup", "portable", "extension")
        ),
        encoding="utf-8",
    )

    # Verify copied bytes again after all outputs have been written.
    for key, name in names.items():
        digest, size = sha256_and_size(assets / name)
        if digest != metadata[key]["sha256"] or size != metadata[key]["size"]:
            raise SystemExit(f"Verification failed after copy: {name}")
    prepared = json.loads(manifest_output.read_text(encoding="utf-8"))
    if any(prepared["platforms"][name]["updatePolicy"]["disabled"] is not True for name in required):
        raise SystemExit("Safety check failed: disabled changed.")

    print(f"Prepared 4 verified artifacts in {output}")
    print(f"Manifest remains disabled=true. Release tag: {tag}")


if __name__ == "__main__":
    main()
