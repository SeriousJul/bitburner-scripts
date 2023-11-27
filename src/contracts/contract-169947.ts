/**
 A prime factor is a factor that is a prime number. What is the largest prime factor of 172413088?
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-169947.cct";
const host = "home";

const data = 172413088;

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

function primeFactor(integer: number) {
  for (let i = 2; i < Math.sqrt(integer) + 1; i++) {
    const factor = integer / i;
    if (Number.isInteger(factor)) {
      return primeFactor(factor);
    }
  }
  return integer;
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const solution = primeFactor(data);
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
