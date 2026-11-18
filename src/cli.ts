import { Command } from "commander";
import { createRequire } from "node:module";
const { version } = createRequire(import.meta.url)("../package.json") as { version: string };
import { readFile, writeFile } from "node:fs/promises";
import { stdin, stdout, stderr } from "node:process";
import { resolve } from "node:path";
import { clashToLink } from "./converter.js";

type OutputFormat = "text" | "json";
async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}
export async function convert(input: string, types?: string): Promise<string[]> {
  const result = await clashToLink(input);
  if (!result.success) throw new Error(result.data || "转换失败");
  const lines = result.data.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^[a-z][a-z0-9+.-]*:\/\//i.test(line));
  const filters = types?.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
  return filters?.length ? lines.filter((line) => filters.includes(line.slice(0, line.indexOf("://")).toLowerCase())) : lines;
}
export async function main(args: string[]): Promise<void> {
  const program = new Command();
  program.name("clash-link").description("Convert Clash YAML proxy nodes into shareable URI links.")
    .argument("[file]", "Clash YAML file (reads stdin when omitted)")
    .option("-t, --type <types>", "Filter protocols, comma-separated (e.g. vless,vmess)")
    .option("-o, --output <file>", "Write output to a file instead of stdout")
    .option("-f, --format <format>", "Output format: text or json", "text")
    .version(version).parse(args, { from: "user" });
  const options = program.opts<{type?: string; output?: string; format: OutputFormat}>();
  if (options.format !== "text" && options.format !== "json") throw new Error("格式必须是 text 或 json");
  const file = program.args[0];
  const input = file ? await readFile(resolve(file), "utf8") : await readStdin();
  const links = await convert(input, options.type);
  const output = options.format === "json" ? JSON.stringify(links.map(uri => ({type: uri.slice(0, uri.indexOf("://")), uri})), null, 2) + "\n" : links.join("\n") + (links.length ? "\n" : "");
  if (options.output) await writeFile(resolve(options.output), output, "utf8"); else stdout.write(output);
}
export async function run(args: string[]): Promise<void> {
  try { await main(args); } catch (error) { stderr.write(`clash-link: ${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 1; }
}
