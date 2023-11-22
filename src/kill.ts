import { NS } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {
  script: "lib/weaken.js",
};
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

  const depth: number = flags.d;
  const { script } = args;

  const run = (name: string, cmd: typeof ns.nuke, host: string) =>
    ns.tprintf("%s:\t\t\t%s", name, cmd(host));

  await walkDeepFirst(ns, depth, async (host, acc) => {
    ns.ps(host)
      .filter((process) => process.filename === script)
      .forEach((process) => ns.kill(process.pid));
  });
}

export function autocomplete(data: any, args: any) {
  return data.scripts;
}
