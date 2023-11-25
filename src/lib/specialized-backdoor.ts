import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
import { defaultDepth } from "/lib/defaultDepth";
const argsTemplate = {
  target: "n00dles",
};
const flagsTemplate = {
  d: defaultDepth,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await backdoor(ns, args, flags);
}

export async function backdoor(
  ns: NS,
  { target }: typeof argsTemplate,
  { d: depth }: typeof flagsTemplate
) {
  await walkDeepFirst(ns, depth, async (host, acc) => {
    if (host === target) {
      acc.nodes.forEach(ns.singularity.connect);
      ns.singularity.connect(host);
      await ns.singularity.installBackdoor();
    }
  });
}

export function autocomplete(
  data: { servers: string[]; scripts: string[] },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: unknown
) {
  return data.servers;
}
