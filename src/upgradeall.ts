import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { upgrade } from "/lib/upgrade";
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

  await upgradeall(ns, flags);
}

export async function upgradeall(
  ns: NS,
  { b: budgetRatio, ...flags }: typeof flagsTemplate
) {
  let budget = ns.getPlayer().money * budgetRatio;
  while (budget) {
    const server = ns
      .getPurchasedServers()
      .map((host) => ({ host, ram: ns.getServerMaxRam(host) }))
      .sort(({ ram: ramA }, { ram: ramB }) => {
        return ramA - ramB;
      })
      .shift();
    if (!server) return;

    const price = await upgrade(
      ns,
      { host: server.host },
      { ...flags, b: budget }
    );
    budget -= price;
    if (!price) {
      return;
    }
  }
}
