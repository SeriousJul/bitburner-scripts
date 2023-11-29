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

const contractType = "Unique Paths in a Grid I";
export async function template(ns: NS) {
  if (
    !ns
      .ls("home")
      .filter((file) => file.endsWith(".cct"))
      .map((script) => ns.codingcontract.getContractType(script))
      .find((type) => type === contractType)
  )
    ns.codingcontract.createDummyContract(contractType);


  ns.ls("home")
    .filter((file) => file.endsWith(".cct"))
    .forEach((contract) => {
      solve(ns, { host: "home", script: contract });
    });
}
