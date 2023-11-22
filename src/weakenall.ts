import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
import { deploy } from "/lib/deploy";
import { defaultMaxThreads } from "/lib/defaultMaxThreads";
const argsTemplate = {
  target: "n00dles",
};
const flagsTemplate = {
  // depth
  d: 10,
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
  await walkDeepFirst(ns, depth, async (host, acc) => {
    await deploy(ns, { ...args, host, file }, { ...flags });
  });
}

export function autocomplete(data: any, args: any) {
  return data.servers;
}
