# clash-link-cli

将 Clash YAML 配置中的代理节点转换为可分享的 URI 链接。基于 [urlclash-converter](https://github.com/siiway/urlclash-converter) 的转换实现，并提供命令行接口。

## 环境要求
- Node.js >= 20
- npm

## 安装
```bash
git clone https://github.com/onewesong/clash-link-cli.git
cd clash-link-cli
npm install
npm run build
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
