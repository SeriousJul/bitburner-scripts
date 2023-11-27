import { NS, NodeStats } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { maxServers } from "/lib/maxServers";
const argsTemplate = {};
const flagsTemplate = {
  //budget in percentage of owning money
  b: 0.1,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { flags } = validationReport;

  await upgradeHacknet(ns, flags);
}

export async function upgradeHacknet(
  ns: NS,
  { b: budgetRatio }: typeof flagsTemplate
) {
  let budget = ns.getPlayer().money * budgetRatio;
  const purchaseCost = ns.hacknet.getPurchaseNodeCost();
  if (
    budget >= purchaseCost &&
    ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()
  ) {
    ns.hacknet.purchaseNode();
    budget -= purchaseCost;
  }

  while (budget) {
    const server = getHackNodes(ns).shift();
    if (!server) return;

    const upgradeCost = ns.hacknet.getLevelUpgradeCost(server.index, 10);
    const ramCost = ns.hacknet.getRamUpgradeCost(server.index);
    const cpuCost = ns.hacknet.getCoreUpgradeCost(server.index);
    if (server.level < 100) {
      if (budget < upgradeCost) {
        return;
      }
      budget -= upgradeLevel(ns, server);
      continue;
    }

    if (server.ram < 64) {
      if (budget < ramCost) {
        return;
      }
      budget -= upgradeRam(ns, server);
      continue;
    }

    if (server.level < 140) {
      if (budget < upgradeCost) {
        return;
      }
      budget -= upgradeLevel(ns, server);
      continue;
    }

    if (server.cores < 5) {
      if (budget < cpuCost) {
        return;
      }
      budget -= upgradeCores(ns, server);
      continue;
    }

    if (server.level < 200) {
      if (budget < upgradeCost) {
        return;
      }
      budget -= upgradeLevel(ns, server);
      continue;
    }

    if (server.cores < 16) {
      if (budget < cpuCost) {
        return;
      }
      budget -= upgradeCores(ns, server);
      continue;
    }

    return;
  }
}

function upgradeLevel(ns: NS, server: NodeStats & { index: number }) {
  const upgradeCost = ns.hacknet.getLevelUpgradeCost(server.index, 10);
  if (ns.hacknet.upgradeLevel(server.index, 10)) {
    ns.print(
      ns.sprintf("Upgraded %s to lvl %s", server.index, server.level + 1)
    );
    return upgradeCost;
  }
  return 0;
}

function upgradeRam(ns: NS, server: NodeStats & { index: number }) {
  const upgradeCost = ns.hacknet.getRamUpgradeCost(server.index);
  if (ns.hacknet.upgradeRam(server.index)) {
    ns.print(ns.sprintf("Upgraded %s to ram %s", server.index, server.ram * 2));
    return upgradeCost;
  }
  return 0;
}

function upgradeCores(ns: NS, server: NodeStats & { index: number }) {
  const upgradeCost = ns.hacknet.getCoreUpgradeCost(server.index);
  if (ns.hacknet.upgradeCore(server.index)) {
    ns.print(
      ns.sprintf("Upgraded %s to cores %s", server.index, server.cores + 1)
    );
    return upgradeCost;
  }
  return 0;
}

function getHackNodes(ns: NS): (NodeStats & { index: number })[] {
  return new Array(ns.hacknet.numNodes())
    .fill(0)
    .map((_value, index) => index)
    .map((index) => ({ ...ns.hacknet.getNodeStats(index), index }))
    .sort((a, b) => a.production - b.production);
}
