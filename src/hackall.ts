import { NS } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { defaultMaxThreads } from "/lib/defaultMaxThreads";
import { deploy } from "/lib/deploy";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {
  target: "n00dles",
};
const flagsTemplate = {
  // depth
  d: defaultDepth,
  // with home
  w: false,
  // max threads
  x: defaultMaxThreads,
  //hack chance threshold
  c: 0.9,
};

const file = "lib/hack.js";
export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  const { d: depth, x: maxThreads, c } = flags;
  let threadRemaining = maxThreads;
  await walkDeepFirst(ns, depth, async (host) => {
    if (threadRemaining === 0) {
      return;
    }

    if (threadRemaining < 0) {
      throw new Error();
    }

    const startedThreads = await deploy(
      ns,
      { ...args, host, script: file },
      { ...flags, x: threadRemaining },
      "-c",
      c
    );
    threadRemaining = threadRemaining - startedThreads;
  });
}

export function autocomplete(data: any, args: any) {
  return data.servers;
}
