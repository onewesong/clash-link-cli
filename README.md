# clash-link

将 Clash YAML 配置中的代理节点转换为可分享的 URI 链接。基于 [urlclash-converter](https://github.com/siiway/urlclash-converter) 的转换实现，并提供命令行接口。

## 环境要求
- Node.js >= 20
- npm

## 无需安装，直接运行
```bash
npx clash-link config.yaml
npx clash-link config.yaml --type vless
cat config.yaml | npx clash-link --format json
```

首次运行时 npm 会询问是否下载；如需省略确认，可用 `npx --yes clash-link config.yaml`。
也可以全局安装：

```bash
npm install -g clash-link
clash-link config.yaml
```

## 本地开发
```bash
git clone https://github.com/onewesong/clash-link-cli.git
cd clash-link-cli
npm ci
npm test
npm run package:check
npm link
```

## 使用
```bash
# 转换整个配置
clash-link config.yaml
# 只输出 VLESS
clash-link config.yaml --type vless
# 过滤多种协议
clash-link config.yaml --type vless,vmess
# 输出到文件
clash-link config.yaml --type vless --output vless.txt
# JSON 输出
clash-link config.yaml --format json
# 从标准输入读取
cat config.yaml | clash-link --type vless
```

## 参数
| 参数 | 说明 |
| --- | --- |
| -t, --type <types> | 协议过滤，逗号分隔 |
| -o, --output <file> | 输出文件，默认 stdout |
| -f, --format <format> | text（默认）或 json |
| -V, --version | 显示版本 |
| -h, --help | 帮助 |

## 安全说明
转换在本地完成，不会上传配置。配置文件通常包含 UUID、密码、密钥等敏感信息，请勿将真实配置提交到 Git 仓库或公开分享转换结果。

## License / Attribution
本项目采用 GPL-3.0-only。核心转换逻辑源自 [siiway/urlclash-converter](https://github.com/siiway/urlclash-converter)，其实现包含来自 [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev) 的代码。本仓库保留上游版权声明及 GPL-3.0 许可证文本。

## 发布到 npm

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
