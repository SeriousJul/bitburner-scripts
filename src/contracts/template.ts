/**
 *
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-XX.cct";
const host = "zer0";

const data = [
  109, 134, 48, 16, 63, 186, 178, 81, 140, 156, 177, 91, 61, 13, 46, 102, 51,
  149, 111, 160, 57, 78, 142, 188, 195, 178, 173, 133, 49, 129, 117, 44, 61,
  104, 58, 97, 88, 24, 104,
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

async function solve(
  ns: NS,
  { d: dryRun }: typeof flagsTemplate
) {
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
