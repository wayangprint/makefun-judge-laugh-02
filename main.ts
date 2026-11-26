// Make the Judge Laugh in One Line — entry runner (revised).
//
// The line itself is a fixed string: the same bytes go to stdout and to
// every copy of entry.txt on each run. Nothing here reads the clock, the
// network, or any random source, so repeated runs cannot drift apart.
//
// A final guard keeps the entry one clean line: any stray whitespace inside
// the segments is collapsed to single spaces, and no trailing newline is
// ever written, so the gate sees exactly one line of 1-200 characters.
//
// Where the file lands:
//   - always next to this script (entry.txt in the repo folder), and
//   - MAKEFUN_OUTPUT_DIR when that variable is set (per-run scratch dirs
//     used while verifying determinism), otherwise /output when that
//     directory already exists (the grading sandbox case).

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETUP = "My bank called my spending 'suspicious',";
const PUNCHLINE = "so I told them my salary is the real suspect.";

function singleLine(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+/g, " ").trim();
}

function outputFolders(): string[] {
  const scriptDir = new URL(".", import.meta.url).pathname;
  const folders: string[] = [scriptDir];
  const override = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  if (override.length > 0) {
    folders.push(override);
  } else if (existsSync("/output")) {
    folders.push("/output");
  }
  return folders;
}

function emit(line: string): void {
  for (const folder of outputFolders()) {
    mkdirSync(folder, { recursive: true });
    writeFileSync(join(folder, "entry.txt"), line, "utf8");
  }
}

const line = singleLine([SETUP, PUNCHLINE]);
emit(line);
console.log(line);
