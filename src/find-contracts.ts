import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { newLine } from "/lib/misc";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  //depth
  d: 10,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await findContract(ns, args, flags);
}

export async function findContract(
  ns: NS,
  {}: typeof argsTemplate,
  { d: depth }: typeof flagsTemplate
) {
  await walkDeepFirst(ns, depth, async (host, acc) => {
    const contracts = ns.ls(host).filter((file) => file.endsWith(".cct"));
    if (contracts.length) {
      ns.tprintf(acc.nodes.concat([host]).join("->"));
      ns.tprintf(contracts.join(", "));
      ns.tprintf(newLine);
    }
  });
}
