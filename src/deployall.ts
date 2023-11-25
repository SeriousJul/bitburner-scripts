import { NS, ScriptArg } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { defaultMaxThreads } from "/lib/defaultMaxThreads";
import { deploy as _deploy } from "/lib/deploy";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
import { ThreadCounts } from "/lib/misc";
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
  // max home threads
  xh: defaultMaxThreads,
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
  {
    d: depth,
    x: maxThreads,
    xh: maxHomeThreads,
    ...flags
  }: typeof flagsTemplate,
  ...scriptArgs: ScriptArg[]
): Promise<boolean> {
  const threadRemaining = new ThreadCounts(maxHomeThreads, maxThreads);
  if (!threadRemaining.isEmpty())
    await walkDeepFirst(ns, depth, async (host) => {
      if (threadRemaining.isEmpty()) {
        return;
      }

      const startedThreads = await _deploy(
        ns,
        { ...args, host, script },
        { ...flags, x: threadRemaining.getThreadCount(host) },
        ...scriptArgs
      );
      threadRemaining.removeThreads(startedThreads, host);
    });
  return threadRemaining.isEmpty();
}

export function autocomplete(
  data: { servers: string[]; scripts: string[] },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: unknown
) {
  return [...data.servers, ...data.scripts];
}
