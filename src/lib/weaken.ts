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

  const host: string = args.host;

  await weaken(ns, host);
}

export async function weaken(ns: NS, host: string) {
  while (true) {
    if (ns.getServerSecurityLevel(host) > ns.getServerMinSecurityLevel(host)) {
      await ns.weaken(host);
    } else {
      ns.toast("weaken done " + host, "info");
      ns.exit();
    }
  }
}
