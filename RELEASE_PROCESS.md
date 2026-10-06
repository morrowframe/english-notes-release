# 英语摘记正式发布流程

本文件描述当前 **Release Manifest v1** 的正式发布流程。它只使用现有更新协议，不引入第二套 Manifest 或版本比较规则。

## 1. 固定地址

正式 Release Manifest：

`https://morrowframe.github.io/english-notes-release/release-manifest.json`

客户端只需要预置这个稳定地址。正式安装包发布后，通过更新此 Manifest 即可改变版本、下载地址、SHA256、文件大小和更新策略，不需要因此重新构建客户端。

## 2. 统一文件名

| 平台 | 文件名 |
| --- | --- |
| Android | `EnglishNotes-Android-<appVersion>.apk` |
| Windows Setup | `EnglishNotes-Windows-<appVersion>-Setup.exe` |
| Windows Portable | `EnglishNotes-Windows-<appVersion>-Portable.zip` |
| Extension | `EnglishNotes-Extension-<appVersion>.zip` |

其中 `<appVersion>` 必须来自同一份 `release-manifest.json` 对应平台的 `appVersion`。

顶层 `releaseVersion` 是一次多端发布集合的版本，用作 GitHub Release tag：`v<releaseVersion>`。Android、Windows、Extension 的 `appVersion` 可以彼此不同。

## 3. Manifest 映射

- Android APK → `platforms.android.packages[]`
  - `delivery: "apk"`
  - `architecture: "universal"`
- Windows Setup EXE → `platforms.windows.packages[]`
  - `delivery: "setup"`
  - 默认 `architecture: "amd64"`
- Windows Portable ZIP → `platforms.windows.packages[]`
  - `delivery: "portable"`
  - 默认 `architecture: "amd64"`
- Extension ZIP → `platforms.browserExtension.packages[]`
  - 沿用现有 Release Manifest v1 已定义的 `delivery: "extensionStore"` 提示槽位，不新增协议值
  - 同样记录实际文件的 `sha256` 与 `fileSize`

正式下载地址使用：

`https://github.com/morrowframe/english-notes-release/releases/download/<tag>/<filename>`

发布说明地址使用：

`https://github.com/morrowframe/english-notes-release/releases/tag/<tag>`

## 4. 自动准备工具

脚本：`tools/prepare_release_manifest.py`

它接收最终构建出来的四个文件，自动完成：

1. 按统一命名规则复制到 `prepared-release/assets/`；
2. 读取真实文件字节并计算 SHA256；
3. 读取真实文件字节数；
4. 回填现有 Release Manifest v1 的 `packages`；
5. 生成 `prepared-release/SHA256SUMS`；
6. 写出 `prepared-release/release-manifest.json`；
7. 再次读取复制后的文件，复核 SHA256 与 size；
8. 再次读取生成的 Manifest，确认三端仍然全部 `disabled=true`。

脚本会拒绝处理任何已经把 Android、Windows 或 Extension 的 `updatePolicy.disabled` 改成 `false` 的输入，因此“准备发布包”本身不能提前启用更新。

示例：

```text
python tools/prepare_release_manifest.py \
  --android-apk <最终APK> \
  --windows-setup <最终Setup.exe> \
  --windows-portable <最终Portable.zip> \
  --extension-zip <最终Extension.zip>
```

Windows ARM64 构建时额外使用 `--windows-arch arm64`。默认是 `amd64`。

成功时应看到：

```text
Prepared 4 verified artifacts in prepared-release
Manifest remains disabled=true.
```

## 5. 同步修复完成后的“一次构建”发布顺序

1. 先完成 Sync / WebDAV / LAN 真机修复与最终验收。
2. 将已经审查完成的 update / release 小范围 commit 合入最终候选；不要在构建后再修改客户端更新代码。
3. 一次性确定 Android、Windows、Extension 的最终版本号。
4. 只构建一次最终产物：Android Release APK、Windows Setup、Windows Portable、Extension ZIP。
5. 对这四个**同一批最终产物**运行 `prepare_release_manifest.py`，得到重命名文件、SHA256、size 和仍处于 disabled 状态的 Manifest。
6. 人工核对生成结果，确认版本号、文件名、包类型、SHA256、size 与目标文件一致。
7. 到这一步为止仍然不启用更新。正式发布时才创建 GitHub Release `v<releaseVersion>`，上传四个产物和 `SHA256SUMS`。
8. 将准备好的 `release-manifest.json` 部署到 Pages 根目录，仍保持 `disabled=true`，先实际访问所有下载 URL 并核对文件。
9. 所有下载与校验均通过后，再单独做一个很小的“activation”提交，把需要正式开放的平台 `disabled` 明确改为 `false` 并部署。这个动作只改远程 Manifest，不需要重新构建客户端。

这样，同步问题修好以后，客户端只需要最后构建一次；发布信息、下载地址、哈希、文件大小和启用开关都在构建之后通过现有 Release Manifest v1 管理。

## 6. 当前安全边界

Android 和 Windows 当前更新交付仍采用“客户端验证 Manifest → 显示版本 / SHA256 / size → 打开外部 HTTPS 下载地址”的人工安装模式。Release Runtime 会校验 Manifest 中 SHA256 / fileSize 字段格式，发布工具会从最终产物真实字节自动计算并二次复核这些值。

但由于文件实际由系统浏览器下载，当前客户端**不能自动读取浏览器最终保存的文件并再次计算 SHA256**。因此目前完成的是发布端真实字节校验 + 客户端可信元数据展示，不应表述为“客户端下载后自动哈希校验”。

如果未来要做客户端下载、下载后 SHA256/size 自动核验、签名连续性检查和一键安装，那属于原生 Update Delivery 的下一阶段能力；不应为了本轮发布收口临时另造第二套协议，也不应在最后一次真机修复构建后再临时加入。

## 7. 本阶段明确不做

- 不创建正式 GitHub Release；
- 不上传最终 APK / EXE / ZIP；
- 不生成本轮最终客户端安装包；
- 不把任何平台 `disabled` 改成 `false`；
- 不修改 Sync Core、WebDAV、LAN、Search 或数据格式；
- 不实现自动安装或静默更新。
