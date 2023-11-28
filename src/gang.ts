import { GangGenInfo, GangMemberInfo, GangTaskStats, NS } from "@ns";
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

  await manageGang(ns, flags);
}

export async function manageGang(
  ns: NS,
  { b: budgetRatio, ...flags }: typeof flagsTemplate
) {
  // let budget = ns.getPlayer().money * budgetRatio;
  if (ns.gang.canRecruitMember()) {
    ns.gang.recruitMember(`guy-${ns.gang.getMemberNames().length}`);
  }

  const gangInfo = ns.gang.getGangInformation();
  const { wantedPenalty } = gangInfo;

  for (const gangMember of getGangMembers(ns)) {
    if (
      gangMember.agi_exp < 2000 ||
      gangMember.def_exp < 2000 ||
      gangMember.str_exp < 2000 ||
      gangMember.dex_exp < 2000
    ) {
      ns.gang.setMemberTask(gangMember.name, "Train Combat");
    } else if (gangMember.hack_exp < 2000) {
      ns.gang.setMemberTask(gangMember.name, "Train Hacking");
    } else if (gangMember.cha_exp < 2000) {
      ns.gang.setMemberTask(gangMember.name, "Train Charisma");
    } else if (
      gangMember.task === "Vigilante Justice" &&
      wantedPenalty < 0.98 &&
      gangInfo.wantedLevel > 50
    ) {
      continue;
    } else if (wantedPenalty < 0.8 && gangInfo.wantedLevel > 100) {
      ns.gang.setMemberTask(gangMember.name, "Vigilante Justice");
    } else {
      const mostProfitTask = ns.gang
        .getTaskNames()
        .map((taskName) => ns.gang.getTaskStats(taskName))
        .filter((task) => task.isCombat)
        .map((task) => {
          return {
            ...task,
            moneyGain: calculateMoneyGain(gangInfo, gangMember, task),
          };
        })
        .sort(
          ({ moneyGain: baseMoneyA }, { moneyGain: baseMoneyB }) =>
            baseMoneyB - baseMoneyA
        )
        .find(() => true)?.name;
      ns.gang.setMemberTask(gangMember.name, mostProfitTask || "Mug People");
    }

    // ns.gang.getEquipmentNames().forEach((equipmentName) => {
    //   ns.gang.purchaseEquipment(gangMember.name, equipmentName);
    // });
  }
}

function getGangMembers(ns: NS) {
  return ns.gang
    .getMemberNames()
    .map((name) => ns.gang.getMemberInformation(name));
}

function calculateMoneyGain(
  gang: GangGenInfo,
  member: GangMemberInfo,
  task: GangTaskStats
): number {
  if (task.baseMoney === 0) return 0;
  let statWeight =
    (task.hackWeight / 100) * member.hack +
    (task.strWeight / 100) * member.str +
    (task.defWeight / 100) * member.def +
    (task.dexWeight / 100) * member.dex +
    (task.agiWeight / 100) * member.agi +
    (task.chaWeight / 100) * member.cha;

  statWeight -= 3.2 * task.difficulty;
  if (statWeight <= 0) return 0;
  const territoryMult = Math.max(
    0.005,
    Math.pow(gang.territory * 100, task.territory.money) / 100
  );
  if (isNaN(territoryMult) || territoryMult <= 0) return 0;
  const respectMult = calculateWantedPenalty(gang);
  const territoryPenalty = 0.2 * gang.territory + 0.8;
  return Math.pow(
    5 * task.baseMoney * statWeight * territoryMult * respectMult,
    territoryPenalty
  );
}

function calculateWantedPenalty(gang: GangGenInfo): number {
  return gang.respect / (gang.respect + gang.wantedLevel);
}
