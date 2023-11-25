/**
Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

You are given an array with two elements:
  ["ARRAY QUEUE MACRO VIRUS CACHE", 8]
The first element is the plaintext, the second element is the left shift value.

Return the ciphertext as uppercase string. Spaces remains the same.
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-40081.cct";
const host = "joesguns";

const data = ["ARRAY QUEUE MACRO VIRUS CACHE", 8];

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
  const solution = cipher(data[0] as string, data[1] as number);
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}

function cipher(text: string, rotation: number): string {
  // A: 65 .... Z: 90
  const AcharCode = "A".charCodeAt(0);
  const spaceCode = " ".charCodeAt(0);
  return [...text]
    .map((char) => (char === " " ? spaceCode : char.charCodeAt(0) - rotation))
    .map((charCode) =>
      charCode === spaceCode
        ? spaceCode
        : charCode < AcharCode
        ? charCode + 26
        : charCode
    )
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
}


