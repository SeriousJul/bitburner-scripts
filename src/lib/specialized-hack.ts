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

  const { args } = validationReport;

  await template(ns, args);
}

export async function template(ns: NS, { host }: typeof argsTemplate) {
  await ns.hack(host);
}

export function autocomplete(data: any, args: any) {
  return data.servers;
}
