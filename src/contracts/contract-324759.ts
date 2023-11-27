/**
Given the following string containing only digits, return an array with all possible valid IP address combinations that can be created from the string:

9716412766

Note that an octet cannot begin with a '0' unless the number itself is actually 0. For example, '192.168.010.1' is not a valid IP.

Examples:

25525511135 -> ["255.255.11.135", "255.255.111.35"]
1938718066 -> ["193.87.180.66"]
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-324759.cct";
const host = "home";

const data = "9716412766";

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

function isValidIp(ip: string) {
  const splitted = ip.split(".").filter((value) => !!value);
  if (splitted.length != 4) return false;

  return !splitted.find(
    (value) =>
      ((Number.parseInt(value) != 0 || value.length > 1) &&
        value.startsWith("0")) ||
      Number.parseInt(value) > 255
  );
}

function parseIp(ip: string): string[] {
  const validIps = [];
  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      for (let k = 1; k < 4; k++) {
        const a1 = ip.substring(0, i);
        const a2 = ip.substring(i, i + j);
        const a3 = ip.substring(i + j, i + j + k);
        const a4 = ip.substring(i + j + k, ip.length);
        const candidate = `${a1}.${a2}.${a3}.${a4}`;
        if (isValidIp(candidate)) validIps.push(candidate);
      }
    }
  }
  return validIps;
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const solution = parseIp(data);
  ns.tprintf("data: %s", data);
  ns.tprintf("127001: %s", parseIp("127001"));
  ns.tprintf("255255255255: %s", parseIp("255255255255"));
  ns.tprintf("1000: %s", parseIp("1000"));
  ns.tprintf("1001: %s", parseIp("1001"));
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
