# clash-link

把 Clash YAML 配置中的代理节点转换为可分享的 URI 链接。转换在本地完成，可按协议筛选、输出 JSON，或将结果保存到文件。

## 快速开始

需要 **Node.js 20 或更高版本**，以及随 Node.js 安装的 npm / npx。

```bash
npx clash-link config.yaml
```

将 `config.yaml` 替换为你的 Clash 配置文件路径。每个转换结果占一行，默认输出到终端。

第一次运行时，npx 会提示下载工具；需要跳过确认时，使用 `npx --yes clash-link config.yaml`。

## 使用示例

### 按协议筛选

```bash
# 只输出 VLESS 节点
npx clash-link config.yaml --type vless

# 同时输出 VLESS 和 VMess 节点
npx clash-link config.yaml --type vless,vmess
```

### 保存结果

```bash
npx clash-link config.yaml --output links.txt
```

### 输出 JSON

```bash
npx clash-link config.yaml --format json
```

JSON 是对象数组，每项包含 `type`（协议）和 `uri`（节点链接）。

### 从标准输入读取

不传文件路径时，工具读取标准输入：

```bash
cat config.yaml | npx clash-link --type vless
```

### 全局安装

经常使用时可以全局安装：

```bash
npm install -g clash-link
clash-link config.yaml
```

## 参数

```text
clash-link [file] [options]
```

| 参数 | 作用 |
| --- | --- |
| `file` | Clash YAML 文件路径；省略时读取标准输入 |
| `-t, --type <types>` | 筛选协议，多个协议用逗号分隔 |
| `-o, --output <file>` | 保存到指定文件；默认输出到终端 |
| `-f, --format <format>` | 输出格式：`text`（默认）或 `json` |
| `-V, --version` | 查看版本 |
| `-h, --help` | 查看帮助 |

## 输入与输出示例

输入文件 `config.yaml`：

```yaml
proxies:
  - name: example-node
    type: vless
    server: example.com
    port: 443
    uuid: 00000000-0000-4000-8000-000000000000
```

运行：

```bash
npx clash-link config.yaml --format json
```

结果包含一条 `type` 为 `vless` 的记录，`uri` 以 `vless://` 开头。示例地址和 UUID 仅用于演示，请替换为自己的配置。

## 隐私与安全

节点转换在本机完成，不会上传配置。首次使用 npx 时需要联网下载程序和依赖。

配置文件及生成的链接可能包含密码、UUID 和密钥，请勿提交到公开仓库或公开分享。

## 反馈问题

如遇转换问题，请到 [GitHub Issues](https://github.com/onewesong/clash-link-cli/issues) 反馈，并附上 Node.js 版本、执行命令和脱敏后的最小配置示例。

## 许可证与致谢

采用 [GPL-3.0-only](LICENSE) 许可证。转换逻辑基于 [siiway/urlclash-converter](https://github.com/siiway/urlclash-converter)，其中包含来自 [clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev) 的代码，保留上游版权声明。
