import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {
  script: "bot.js",
};
const flagsTemplate = {};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args } = validationReport;

  await restart(ns, args);
}

export async function restart(ns: NS, { script }: typeof argsTemplate) {
  const processes = ns.ps();
  const process = processes.find((process) => process.filename === script);
  if (!process) {
    ns.toast("Process not found!", "error");
    return;
  }

  ns.kill(process.pid);
  ns.spawn(
    script,
    {
      spawnDelay: 1,
    },
    ...process.args
  );
}

export function autocomplete(
  data: { servers: string[]; scripts: string[] },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _args: unknown
) {
  return data.scripts;
}
