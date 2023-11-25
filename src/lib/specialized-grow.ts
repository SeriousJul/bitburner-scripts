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
  await ns.grow(host);
}

export function autocomplete(
  data: { servers: string[]; scripts: string[] },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: unknown
) {
  return data.servers;
}
