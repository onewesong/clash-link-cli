# 维护与发布


包名和命令名均为 `clash-link`。发布包仅包含 `bin/`、编译后的 `dist/`、README、LICENSE 和包元数据，不需要使用者安装 TypeScript 或手动构建。

### 首次启用（一次性）

1. 用有权注册 `clash-link` 的 npm 账号在本机执行 `npm login`，然后执行 `npm ci && npm test && npm run package:check`。
2. 执行 `npm publish --access public` 完成首次发布；npm 的登录及双因素验证由账号持有人完成。
3. 打开 <https://www.npmjs.com/package/clash-link/access>，在 Trusted publishing 中添加 GitHub Actions：
   - Organization or user：`onewesong`
   - Repository：`clash-link-cli`
   - Workflow filename：`publish.yml`
   - Environment：留空
   - 允许 `npm publish`。
4. 此后 GitHub Actions 使用 OIDC 发布，不需要 `NPM_TOKEN`。新建立的信任配置需要在 npm 规定的有效期内完成第一次成功发布。

### 一键发布

先将 `package.json` 和锁文件中的版本更新并提交到 `main`（例如 `npm version patch --no-git-tag-version`，然后提交、推送）。每个版本只能发布一次。

- 手动：进入 GitHub **Actions → Publish to npm → Run workflow**，选择 `main`，点击运行。
- Release：发布与包版本一致的 GitHub Release，例如包版本 `0.1.1` 对应 `v0.1.1`；草稿和预发布不会触发正式发布。

工作流会先测试、构建并在隔离目录中通过 npm exec（npx）安装真实打包产物，检查版本、帮助和标准输入转换，然后执行 `npm publish`。

发布后验证：

```bash
npm view clash-link version
npx --yes clash-link@latest --help
```
