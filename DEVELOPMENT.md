# Seedream 图片 · 开发说明

## 构建

在本目录使用 Node.js 22 或更高版本和 pnpm 11.9.0 执行：

```sh
pnpm install --frozen-lockfile
pnpm build
```

桌面最低版本为 0.68.0，Android 和 iOS 最低版本为 0.6.0。

## 本地与开发版安装

从 [GitHub Releases](https://github.com/LastKnightCoder/tau-plugin-images-seedream/releases) 下载插件 ZIP，或使用本地构建产物：

- 在 Tau 桌面开发版打开「插件 → ⋯ → 从 ZIP 安装…」，导入 ZIP 后在「已安装」中启用「Seedream 图片」。
- 移动开发版可通过受控开发安装加载同一 ZIP。

## 发布

发布时同步更新 `package.json`、`manifest.json` 和 `CHANGELOG.md`。推送对应的 `v<版本>` 标签后，GitHub Actions 会构建 ZIP 并上传到该标签的 GitHub Release。
