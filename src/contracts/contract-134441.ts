/**
You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

109,134,48,16,63,186,178,81,140,156,177,91,61,13,46,102,51,149,111,160,57,78,142,188,195,178,173,133,49,129,117,44,61,104,58,97,88,24,104

Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

If no profit can be made, then the answer should be 0
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-134441.cct";
const host = "zer0";

const prices = [
  109, 134, 48, 16, 63, 186, 178, 81, 140, 156, 177, 91, 61, 13, 46, 102, 51,
  149, 111, 160, 57, 78, 142, 188, 195, 178, 173, 133, 49, 129, 117, 44, 61,
  104, 58, 97, 88, 24, 104,
];

const argsTemplate = {
};
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
  const calc = (prices: number[]): number => {
    let max = 0;
    for (let i = 0; i < prices.length - 1; i++) {
      for (let j = i; j < prices.length; j++) {
        max = Math.max(max, prices[j] - prices[i]);
      }
    }
    return max;
  };

  let max = calc(prices);
  for (let i = 1; i < prices.length - 1; i++) {
    max = Math.max(
      max,
      calc(prices.slice(0, i + 1)) + calc(prices.slice(i + 1, prices.length))
    );
  }

  ns.tprintf("solution: %s", max);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(max, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
