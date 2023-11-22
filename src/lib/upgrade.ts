import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {
  host: "n00dles",
};
const flagsTemplate = {
  //budget in percentage of owning money
  b: 100,
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
  { b: budgetRatio }: typeof flagsTemplate
) {
  const budget = ns.getPlayer().money * budgetRatio;
  const ram = ns.getServerMaxRam(host);
  const newRam = ram * 2;
  if (budget >= ns.getPurchasedServerUpgradeCost(host, newRam)) {
    const message = ns.sprintf("Upgrade %s with %sGB", host, newRam);
    if (ns.upgradePurchasedServer(host, newRam)) {
      ns.toast(message, "success");
      return true;
    } else {
      ns.toast(`Failed to ${message}`, "error");
    }
  }
  return false;
}
