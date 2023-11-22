import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { upgrade } from "/lib/upgrade";
const argsTemplate = {};
const flagsTemplate = {
  // default timer in seconds
  s: 60,
  //budget in percentage of owning money
  b: 10,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  while (true) {
    const server = ns
      .getPurchasedServers()
      .map((host) => ({ host, ram: ns.getServerMaxRam(host) }))
      .sort(({ ram: ramA }, { ram: ramB }) => {
        return ramA - ramB;
      })
      .shift();
    if (server)
      if (await upgrade(ns, { host: server.host }, { ...flags })) continue;

    await ns.sleep(flags.s * 1000);
  }
}
