#!/usr/bin/env node
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { run } = require("../dist/cli.js");
run(process.argv.slice(2));
