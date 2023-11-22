import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  // depth
  d: 10,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  const depth: number = flags.d;

  const run = (name: string, cmd: typeof ns.nuke, host: string) =>
    ns.tprintf("%s:\t\t\t%s", name, cmd(host));

  await walkDeepFirst(ns, depth, async (host, acc) => {
    ns.killall(host);
  });
}
