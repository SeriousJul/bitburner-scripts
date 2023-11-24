import { NS, ScriptArg } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { defaultMaxThreads } from "/lib/defaultMaxThreads";
import { deploy as _deploy } from "/lib/deploy";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {
  target: "n00dles",
  script: "lib/specialized-hack.js",
};
const flagsTemplate = {
  // depth
  d: defaultDepth,
  // with home
  w: false,
  // max threads
  x: defaultMaxThreads,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await deployall(ns, args, flags);
}

export async function deployall(
  ns: NS,
  { script, ...args }: typeof argsTemplate,
  { d: depth, x: maxThreads, ...flags }: typeof flagsTemplate,
  ...scriptArgs: ScriptArg[]
) {
  let threadRemaining = maxThreads;
  if (!!threadRemaining)
    await walkDeepFirst(ns, depth, async (host) => {
      if (threadRemaining === 0) {
        return;
      }

      if (threadRemaining < 0) {
        throw new Error("Should not have negative remaining");
      }

      const startedThreads = await _deploy(
        ns,
        { ...args, host, script },
        { ...flags, x: threadRemaining },
        ...scriptArgs
      );
      threadRemaining = threadRemaining - startedThreads;
    });
  return threadRemaining;
}

export function autocomplete(data: any, args: any) {
  return [...data.servers, ...data.scripts];
}
