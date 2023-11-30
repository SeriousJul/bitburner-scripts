/**
How many different distinct ways can the number 24 be written as a sum of integers contained in the set:

[4,5,7,9,11,13,15,16]?

You may use each integer in the set zero or more times.
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-936260.cct";
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

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const data = ns.codingcontract.getData(name, host);
  const solution = 0;
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
