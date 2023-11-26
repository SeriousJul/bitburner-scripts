/**
Given the following string:

((()(((aa()))()

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> ["()()()", "(())()"]
"(a)())()" -> ["(a)()()", "(a())()"]
")(" -> [""]
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-276203.cct";
const host = "home";

const data = "((()(((aa()))()";

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

function isValid(text: string) {
  let opened = 0;
  for (const char of [...text]) {
    if (char === "(") opened++;
    if (char === ")") opened--;
    if (opened < 0) return false;
  }
  return opened === 0;
}

function parenthesisSolutions(text: string, depth: number): string[] {
  if (depth === 0) return [];
  if (isValid(text) || !text) {
    return [text || ""];
  }
  if (text.length < 2) {
    return [""];
  }
  return [...text]
    .map((value, index) =>
      parenthesisSolutions(
        [...text]
          .slice(0, index)
          .concat([...text].slice(index + 1, text.length))
          .join(""),
        depth - 1
      )
    )
    .reduce((acc, value) => {
      return acc.concat(value);
    }, [] as string[]);
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  let solutions: string[] = [];
  let depth = 1;
  do {
    solutions = parenthesisSolutions(data, depth++);
  } while (!solutions.length);
  solutions = [...new Set(solutions)];
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solutions);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solutions, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
