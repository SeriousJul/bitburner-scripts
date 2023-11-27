import { NS } from "@ns";
import { solve } from "/contracts/solve";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {};
const flagsTemplate = {};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  await template(ns);
}

export async function template(ns: NS) {
  ns.codingcontract.createDummyContract("Algorithmic Stock Trader I");
  ns.ls("home")
    .filter((file) => file.endsWith(".cct"))
    .forEach((contract) => {
      solve(ns, { host: "home", script: contract });
    });
}
