/**
You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

122,188,140,50,103,126,104,136,24,58,32,30,96,147,129,134,84,100,52,24,133,158,59,25,162,48,38,190,101,12,106,190,88,125,123,142,109

Determine the maximum possible profit you can earn using at most one transaction (i.e. you can only buy and sell the stock once). If no profit can be made then the answer should be 0. Note that you have to buy the stock before you can sell it
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-145349.cct";
const host = "home";

const data = [
  122,188,140,50,103,126,104,136,24,58,32,30,96,147,129,134,84,100,52,24,133,158,59,25,162,48,38,190,101,12,106,190,88,125,123,142,109
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

function maxTxProfit(prices: number[]): number {
  let max = 0;
  for (let i = 0; i < prices.length - 1; i++) {
    for (let j = i; j < prices.length; j++) {
      max = Math.max(max, prices[j] - prices[i]);
    }
  }
  return max;
}

async function solve(
  ns: NS,
  { d: dryRun }: typeof flagsTemplate
) {
  const solution = maxTxProfit(data);
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
