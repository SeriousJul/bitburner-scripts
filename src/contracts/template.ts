/**
 *
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-XX.cct";
const host = "zer0";

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
