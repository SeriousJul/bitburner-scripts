import { NS, ScriptArg } from "@ns";
import { defaultMaxThreads } from "/lib/defaultMaxThreads";
import { TFlag, validateScriptInput } from "/lib/utilities";
import { scpExtensions } from "/lib/misc";

const argsTemplate = {
  host: "n00dles",
  target: "n00dles",
  file: "lib/hack.js",
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
  { host, target, file }: typeof argsTemplate,
  { w: withHome, x: maxThreads }: typeof flagsTemplate,
  ...args: ScriptArg[]
): Promise<number> {
  if (!ns.hasRootAccess(host)) return 0;

  /** upload pwn lib */
  const filesToUpload = ns
    .ls("home", "lib/")
    .filter(
      (file) =>
        !!scpExtensions.filter((extension) => file.endsWith(extension)).length
    )
    .concat([file]);
  ns.scp(filesToUpload, host, "home");

  const threads = Math.floor(
    (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) /
      ns.getScriptRam(file)
  );
  if (!!threads && (withHome || host !== "home")) {
    const limitedThreads = Math.min(threads, maxThreads);
    ns.exec(file, host, limitedThreads, target, ...args);
    return limitedThreads;
  }
  return 0;
}
