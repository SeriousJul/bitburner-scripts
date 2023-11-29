import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
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

  await upgradeGang(ns, flags);
}

export async function upgradeGang(
  ns: NS,
  { b: budgetRatio }: typeof flagsTemplate
) {
  let budget = ns.getPlayer().money * budgetRatio;

  getEquipments(ns).forEach((equipment) => {
    if (budget >= equipment.cost) {
      for (const gangMember of getGangMembers(ns)) {
        if (ns.gang.purchaseEquipment(gangMember.name, equipment.name)) {
          budget -= equipment.cost;
        }
      }
    }
  });
}

export function getEquipments(ns: NS) {
  return ns.gang
    .getEquipmentNames()
    .map((equipmentName) => ({
      name: equipmentName,
      cost: ns.gang.getEquipmentCost(equipmentName),
      stats: ns.gang.getEquipmentStats(equipmentName),
      type: ns.gang.getEquipmentType(equipmentName),
    }))
    .sort(({ cost: a }, { cost: b }) => a - b);
}


export function getGangMembers(ns: NS) {
  return ns.gang
    .getMemberNames()
    .map((name) => ns.gang.getMemberInformation(name));
}