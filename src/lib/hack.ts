import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {
  host: "n00dles",
};
const flagsTemplate = {
  //hack chance threshold
  c: 0.9,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  const host: string = args.host;

  await hack(ns, args, flags);
}

export async function hack(
  ns: NS,
  { host }: typeof argsTemplate,
  { c: hackChanceThreshold }: typeof flagsTemplate
) {
  while (true) {
    const hackChance = ns.hackAnalyzeChance(host);
    ns.printf("hack chance: %s", ns.hackAnalyzeChance(host));
    if (ns.getServerMoneyAvailable(host) < ns.getServerMaxMoney(host)) {
      await ns.grow(host);
    } else if (hackChance < hackChanceThreshold) {
      if (
        ns.getServerSecurityLevel(host) > ns.getServerMinSecurityLevel(host)
      ) {
        await ns.weaken(host);
      } else {
        ns.toast("hack done " + host, "info");
        ns.exit();
      }
    } else {
      await ns.hack(host);
    }
  }
}
