import { NS } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { newLine } from "/lib/misc";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  //depth
  d: defaultDepth,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { flags } = validationReport;

  await findContract(ns, flags);
}

export async function findContract(ns: NS, { d: depth }: typeof flagsTemplate) {
  await walkDeepFirst(ns, depth, async (host, acc) => {
    const contracts = ns.ls(host).filter((file) => file.endsWith(".cct"));
    if (contracts.length) {
      ns.tprintf(acc.nodes.concat([host]).join("->"));
      ns.tprintf(contracts.join(", "));
      ns.tprintf(newLine);
    }
  });
}
