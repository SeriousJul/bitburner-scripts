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

  await walkDeepFirst(ns, depth, async (host) => {
    ns.ps(host)
      .filter((process) => process.filename === script)
      .forEach((process) => ns.kill(process.pid));
  });
}

export function autocomplete(
  data: { servers: string[]; scripts: string[] },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: unknown
) {
  return data.scripts;
}
