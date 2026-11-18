import { describe, expect, it } from "vitest";
import { convert } from "../src/cli.js";
const fixture = `proxies:\n  - name: test-vless\n    type: vless\n    server: example.com\n    port: 443\n    uuid: 00000000-0000-4000-8000-000000000000\n    tls: true\n    network: tcp\n    udp: true\n    reality-opts:\n      public-key: test-public-key\n      short-id: 0123456789abcdef\n`;
describe("convert", () => {
  it("converts a Clash VLESS node", async () => {
    const links = await convert(fixture);
    expect(links).toHaveLength(1);
    expect(links[0]).toContain("vless://00000000-0000-4000-8000-000000000000@example.com:443");
    expect(links[0]).toContain("security=reality");
    expect(links[0]).toContain("pbk=test-public-key");
  });
  it("filters by protocol", async () => { expect(await convert(fixture, "vmess")).toEqual([]); });
});
