/**
It is possible write four as a sum in exactly four different ways:

    3 + 1
    2 + 2
    2 + 1 + 1
    1 + 1 + 1 + 1

How many different distinct ways can the number 20 be written as a sum of at least two positive integers?
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-916421.cct";
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

function countCompose(integer: number) {
  const composition = new Array(integer + 1).fill(0);
  composition[0] = 1;
  for (let i = 1; i < integer; i++) {
    for (let j = i; j <= integer; j++) {
      composition[j] = composition[j] + composition[j - i];
    }
  }
  return composition[integer];
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const data = ns.codingcontract.getData(name, host);
  const solution = countCompose(data);
  ns.tprintf("data: %s", data);
  ns.tprintf("2: %s", countCompose(2));
  ns.tprintf("3: %s", countCompose(3));
  ns.tprintf("4: %s", countCompose(4));
  ns.tprintf("5: %s", countCompose(5));
  ns.tprintf("6: %s", countCompose(6));
  ns.tprintf("7: %s", countCompose(7));
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
