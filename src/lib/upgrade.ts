import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {
  host: "n00dles",
};
const flagsTemplate = {
  //budget
  b: Number.MAX_SAFE_INTEGER,
  //Prompt
  p: false,
};

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
  { b: budget, p: prompt }: typeof flagsTemplate
) {
  const ram = ns.getServerMaxRam(host);
  const newRam = ram * 2;
  const price = ns.getPurchasedServerUpgradeCost(host, newRam);
  if (budget >= price) {
    const message = ns.sprintf("Upgrade %s with %sGB", host, newRam);
    const doIt =
      !prompt || (await ns.prompt(message + "?", { type: "boolean" }));
    if (doIt && ns.upgradePurchasedServer(host, newRam)) {
      ns.toast(message, "success");
      return price;
    } else {
      ns.toast(`Failed to ${message}`, "error");
    }
  }
  return 0;
}
