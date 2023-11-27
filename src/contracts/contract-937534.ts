/**
Given the following integer array, find the contiguous subarray (containing at least one number) which has the largest sum and return that sum. 'Sum' refers to the sum of all the numbers in the subarray.
-4,-9,0,5,5,5,6,5,7,-2,-2,-4,-6,3,5,-3,-1,5,10,-5,0
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-937534.cct";
const host = "home";

const data = [
  -4, -9, 0, 5, 5, 5, 6, 5, 7, -2, -2, -4, -6, 3, 5, -3, -1, 5, 10, -5, 0,
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

function sumArray(array: number[]) {
  return array.reduce((acc, value) => acc + value, 0);
}

function findMaxSubArraySum(array: number[]) {
  let currentMax = sumArray(array);
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = array.length - 1; j > i; j--) {
      currentMax = Math.max(sumArray(array.slice(i, j)), currentMax);
    }
  }
  return currentMax;
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const solution = findMaxSubArraySum(data);
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
