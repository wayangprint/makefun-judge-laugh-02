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
//   - MAKEFUN_OUTPUT_DIR when that variable is set (the grading sandbox
//     sets it to /output, and per-run scratch dirs are used while
//     verifying determinism), otherwise /output when that directory
//     already exists (the grading sandbox case), otherwise next to this
//     script (entry.txt in the repo folder, local runs only). The script
//     folder is never written when an output folder is available: the
//     grading sandbox mounts the repository read-only, so a write there
//     would throw and fail the run.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETUP = "My bank called my spending 'suspicious',";
const PUNCHLINE = "so I told them my salary is the real suspect.";

function singleLine(segments: readonly string[]): string {
  return segments.join(" ").replace(/\s+/g, " ").trim();
}

function outputFolders(): string[] {
  const override = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  if (override.length > 0) {
    return [override];
  }
  if (existsSync("/output")) {
    return ["/output"];
  }
  return [new URL(".", import.meta.url).pathname];
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
