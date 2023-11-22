import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
import { lineHeader, newLine } from "./misc";
const argsTemplate = {
  host: "n00dles",
};
const flagsTemplate = {
  h: "",
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  const host: string = args.host;
  const header: string = flags.h;

  analyze(ns, header, host);
}

export function analyze(ns: NS, header: string, host: string) {
  ns.tprintf(lineHeader);
  ns.tprintf(header || host);
  ns.tprintf(lineHeader);

  const server = ns.getServer(host);
  const money = server.moneyAvailable;
  const maxMoney = server.moneyMax;

  ns.tprintf("root:\t\t\t%s", server.hasAdminRights);
  ns.tprintf("backdoor:\t\t%s", server.backdoorInstalled);
  ns.tprintf("cpu_cores:\t\t%s", server.cpuCores);
  ns.tprintf("max_ram:\t\t%s", server.maxRam);
  ns.tprintf("org:\t\t\t%s", server.organizationName);
  // ns.tprintf("backdoor:\t\t%s", server.);
  if (!!money && !!maxMoney) {
    if (!server.hasAdminRights) {
      ns.tprintf("ports_required:\t%s", server.numOpenPortsRequired);
    } else {
      ns.tprintf(newLine);
      ns.tprintf(
        "money:\t\t\t%s / %s (%s)",
        ns.formatNumber(money, 3),
        ns.formatNumber(maxMoney, 3),
        ns.formatPercent(money / maxMoney)
      );
      ns.tprintf(newLine);

      ns.tprintf("min_security:\t\t%s", server.minDifficulty);
      ns.tprintf("current_security:\t%s", server.hackDifficulty);
      ns.tprintf("min_hacking:\t\t%s", server.requiredHackingSkill);
      ns.tprintf("weaken_time:\t\t%s", ns.tFormat(ns.getWeakenTime(host)));
      ns.tprintf(newLine);

      ns.tprintf("hack_time:\t\t%s", ns.tFormat(ns.getHackTime(host)));
      ns.tprintf(
        "hack_chance:\t\t%s",
        ns.formatPercent(ns.hackAnalyzeChance(host))
      );
      ns.tprintf(
        "hack_security:\t\t%s / thread",
        ns.formatPercent(ns.hackAnalyzeSecurity(1, host))
      );
      ns.tprintf(
        "hack_threads:\t\t%s for %s$",
        Math.ceil(ns.hackAnalyzeThreads(host, money)),
        ns.formatNumber(money, 3)
      );
      ns.tprintf(newLine);

      ns.tprintf("growth:\t\t\t%s", server.serverGrowth);
      ns.tprintf("grow_time:\t\t%s", ns.tFormat(ns.getGrowTime(host)));
      ns.tprintf(
        "grow_analyze:\t\t%s to %s$",
        Math.ceil(ns.growthAnalyze(host, maxMoney / money)),
        ns.formatNumber(maxMoney, 3)
      );
      ns.tprintf(
        "grow_security:\t\t%s / thread",
        ns.growthAnalyzeSecurity(1, host)
      );
      ns.tprintf(newLine);
      // can't give host parameter
      // ns.tprintf("weaken_analyze:\t\t%s / thread", ns.weakenAnalyze(1));
    }
  }
  ns.tprintf("files:\t\t\t%s", ns.ls(host).join(", "));

  ns.tprintf(newLine);
  ns.tprintf(newLine);
}

export function autocomplete(data: any, args: any) {
  return data.servers;
}