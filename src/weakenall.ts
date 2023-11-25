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
};

const file = "lib/weaken.js";
export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  const { d: depth } = flags;
  await walkDeepFirst(ns, depth, async (host) => {
    await deploy(ns, { ...args, host, script: file }, { ...flags });
  });
}

export function autocomplete(data: any, args: any) {
  return data.servers;
}
