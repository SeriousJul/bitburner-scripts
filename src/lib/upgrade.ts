import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {
  host: "n00dles",
};
const flagsTemplate = {};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await upgrade(ns, args, flags);
}

export async function upgrade(
  ns: NS,
  { host }: typeof argsTemplate,
  {}: typeof flagsTemplate
) {
  const ram = ns.getServerMaxRam(host);
  const newRam = ram * 2;
  if (ns.upgradePurchasedServer(host, newRam)) {
    ns.tprintf("Upgrading %s with %sGB", host, newRam);
  }
}
