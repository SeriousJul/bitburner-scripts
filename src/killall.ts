import { NS } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  // depth
  d: defaultDepth,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await killall(ns, args, flags);
}

export async function killall(
  ns: NS,
  {}: typeof argsTemplate,
  { d: depth }: typeof flagsTemplate
) {
  await walkDeepFirst(ns, depth, async (host, acc) => {
    ns.killall(host);
  });
}
