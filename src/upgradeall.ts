import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { upgrade } from "/lib/upgrade";
const argsTemplate = {};
const flagsTemplate = {};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  const _upgrade = (host: string) => upgrade(ns, { host }, {});

  _upgrade(ns.getHostname());
  ns.getPurchasedServers().forEach(_upgrade);
}
