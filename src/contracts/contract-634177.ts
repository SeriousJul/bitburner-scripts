/**
Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to adjacent numbers in the row below. The triangle is represented as a 2D array of numbers:

[
     [6],
    [6,4],
   [2,4,3],
  [4,2,3,3]
]

Example: If you are given the following triangle:

[
     [2],
    [3,4],
   [6,5,7],
  [4,1,8,3]
]

The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-634177.cct";
const host = "home";

const data = [
  [6], //
  [6, 4], //
  [2, 4, 3], //
  [4, 2, 3, 3], //
];

const argsTemplate = {};
const flagsTemplate = {
  //dry-run
  d: false,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { flags } = validationReport;

  await solve(ns, flags);
}

function minBranch(triangle: number[][], i: number, j: number): number {
  if (i >= triangle.length || j >= triangle[i].length) {
    return 0;
  }
  const value = triangle[i][j];
  const left = value + minBranch(triangle, i + 1, j);
  const right = value + minBranch(triangle, i + 1, j + 1);
  return Math.min(left, right);
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const solution = minBranch(data, 0, 0);
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
