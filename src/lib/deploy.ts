import { NS, ScriptArg } from "@ns";
import { defaultMaxThreads } from "/lib/defaultMaxThreads";
import { uploadLib } from "/lib/uploadLib";
import { validateScriptInput } from "/lib/utilities";

const argsTemplate = {
  host: "n00dles",
  target: "n00dles",
  script: "lib/hack.js",
};
const flagsTemplate = {
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

  await deploy(ns, args, flags);
}

export async function deploy(
  ns: NS,
  { host, target, script: file }: typeof argsTemplate,
  { w: withHome, x: maxThreads }: typeof flagsTemplate,
  ...args: ScriptArg[]
): Promise<number> {
  if (!ns.hasRootAccess(host)) return 0;

  uploadLib(ns, file, host);

  const margin = host === "home" && !withHome ? 8 : 0;
  const threads = Math.floor(
    (ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - margin) /
      ns.getScriptRam(file)
  );
  if (threads) {
    const limitedThreads = Math.min(threads, maxThreads);
    ns.exec(file, host, limitedThreads, target, ...args);
    return limitedThreads;
  }
  return 0;
}
