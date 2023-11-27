/**
You are located in the top-left corner of the following grid:

0,0,1,
0,0,0,
0,0,1,
1,0,0,
0,0,0,
0,1,0,
0,0,0,
1,0,0,
0,0,0,

You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-507056.cct";
const host = "home";

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

function isFinished(data: number[][], i: number, j: number) {
  return data.length === i + 1 && data[i].length === j + 1;
}

function canMoveRight(data: number[][], i: number, j: number) {
  return data[i].length > j + 1 && data[i][j + 1] !== 1;
}

function canMoveDown(data: number[][], i: number, j: number) {
  return data.length > i + 1 && data[i + 1][j] !== 1;
}

function walkDownFirst(data: number[][], i: number, j: number): number {
  if (isFinished(data, i, j)) {
    return 1;
  }

  let count = 0;
  if (canMoveDown(data, i, j)) {
    count += walkDownFirst(data, i + 1, j);
  }

  if (canMoveRight(data, i, j)) {
    count += walkDownFirst(data, i, j + 1);
  }

  return count;
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const data: number[][] = ns.codingcontract.getData(name, host);
  const solution = walkDownFirst(data, 0, 0);
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
