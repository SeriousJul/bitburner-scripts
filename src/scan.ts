import { NS } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  //depth
  d: defaultDepth,
  m: true,
  s: true,
};

const indent = 1;

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await scan(ns, args, flags);
}

export async function scan(
  ns: NS,
  {}: typeof argsTemplate,
  { d: depth, m: moneyEnabled, s: securityEnabled }: typeof flagsTemplate
) {
  await walkDeepFirst(
    ns,
    depth,
    async (host, acc) => {
      const padding = "".padEnd(acc.depth * indent);
      const paddingInverted = "".padEnd((30 - acc.depth) * indent);
      const server = ns.getServer(host);
      ns.tprintf("%s┣ %s", padding, host);
      const money = server.moneyAvailable || 0;
      const maxMoney = server.moneyMax || 0;
      if (moneyEnabled && maxMoney) {
        const line = "%s┃%sm_avail=%-10s\tm_max=%-10s\tm_ratio=%-10s";
        ns.tprintf(
          line,
          padding,
          paddingInverted,
          ns.formatNumber(money, 3),
          ns.formatNumber(maxMoney, 3),
          ns.formatPercent(money / maxMoney)
        );
      }
      if (securityEnabled) {
        const line = "%s┃%sminSec=%-10s\tsecurity=%-.10s\tmin_hack=%-10s";
        ns.tprintf(
          line,
          padding,
          paddingInverted,
          server.minDifficulty,
          server.hackDifficulty?.toFixed(2).padEnd(10),
          server.requiredHackingSkill
        );
      }
    },
    {
      excludes: ns.getPurchasedServers(),
    }
  );
}
// ┗
// ┣
