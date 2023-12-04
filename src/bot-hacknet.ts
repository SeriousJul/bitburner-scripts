import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { upgradeHacknet } from "/upgrade-hacknet";
const argsTemplate = {};
const flagsTemplate = {
  //budget in percentage of owning money
  b: 0.1,
  //prompt
  p: false,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { flags } = validationReport;

  await bot(ns, flags);
}

export async function bot(ns: NS, { ...flags }: typeof flagsTemplate) {
  for (;;) {
    await upgradeHacknet(ns, { ...flags });

    if (flags.p && !(await ns.prompt("Continue?", { type: "boolean" }))) {
      ns.exit();
    }
    await ns.sleep(1e3);
  }
}
