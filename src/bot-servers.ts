import { NS } from "@ns";
import { upgradeServers } from "./upgrade-servers";
import { buy } from "/buy";
import { maxServers } from "/lib/maxServers";
import { validateScriptInput } from "/lib/utilities";
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
    /**
     * Early game getting the 25 servers
     */
    await buy(ns, { pool: maxServers, "min-ram": 2, ram: 2 });

    /**
     * Upgrade
     */
    await upgradeServers(ns, { ...flags });
    if (flags.p && !(await ns.prompt("Continue?", { type: "boolean" }))) {
      ns.exit();
    }
    await ns.sleep(1e3);
  }
}
