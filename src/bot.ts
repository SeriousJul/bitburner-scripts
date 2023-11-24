import { NS } from "@ns";
import { buy } from "/buy";
import { deployall } from "/deployall";
import { defaultDepth } from "/lib/defaultDepth";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
import { ps } from "/ps";
import { upgradeall } from "/upgradeall";
import { maxServers } from "/lib/maxServers";
import { pwn } from "/pwn";
import { killall } from "/killall";
const argsTemplate = {};
const flagsTemplate = {
  //use home in worker pool
  w: false,
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

  const { args, flags } = validationReport;

  await bot(ns, args, flags);
}

const library = {
  specializedHack: "lib/specialized-hack.js",
  specializedGrow: "lib/specialized-grow.js",
  specializedWeaken: "lib/specialized-weaken.js",
};

export async function bot(
  ns: NS,
  {}: typeof argsTemplate,
  { w, ...flags }: typeof flagsTemplate
) {
  while (true) {
    /**
     * Early game getting the 25 servers
     */
    await buy(ns, {}, { pool: maxServers, "min-ram": 2, ram: 2 });

    /**
     * Upgrade
     */
    // await upgradeall(ns, {}, { ...flags });

    await pwn(ns, {}, { d: defaultDepth, p: false });

    const servers = await allServers(ns);
    let threadsNotDeployed = 0;
    while (servers.length) {
      const server = servers.pop();
      if (!server) break;
      if (!!threadsNotDeployed) break;

      const { hostname } = server;
      const processes = (
        await ps(ns, {}, { d: defaultDepth, p: false })
      ).filter((process) => process.args?.[0] === hostname);

      const weakenInProgress = processes.find(
        (process) => process.filename === library.specializedWeaken
      );
      const serverSecurity = ns.getServerSecurityLevel(hostname);
      const serverMinSecurity = ns.getServerMinSecurityLevel(hostname);
      if (!weakenInProgress && serverSecurity > serverMinSecurity) {
        threadsNotDeployed = await deployall(
          ns,
          { script: library.specializedWeaken, target: hostname },
          {
            d: defaultDepth,
            w,
            x: getOptimalThreadsToWeaken(ns, serverSecurity, serverMinSecurity),
          }
        );
      }

      const growInProgress = processes.find(
        (process) => process.filename === library.specializedGrow
      );
      const money = ns.getServerMoneyAvailable(hostname);
      const maxMoney = ns.getServerMaxMoney(hostname);
      if (!growInProgress && money < maxMoney) {
        await ns.sleep(1);
        threadsNotDeployed = await deployall(
          ns,
          { script: library.specializedGrow, target: hostname },
          {
            d: defaultDepth,
            w,
            x: !!money
              ? Math.ceil(ns.growthAnalyze(hostname, maxMoney / money))
              : 100,
          }
        );
      }

      const hackInProgress = processes.find(
        (process) => process.filename === library.specializedHack
      );
      if (!hackInProgress && money && ns.hackAnalyzeChance(hostname) > 0) {
        const hackThreads = ns.hackAnalyzeThreads(hostname, money / 2);
        //For some reason, it return -1 in some case, I need to understand those
        if (hackThreads >= 0) {
          await ns.sleep(1);
          threadsNotDeployed = await deployall(
            ns,
            { script: library.specializedHack, target: hostname },
            {
              d: defaultDepth,
              w,
              x: Math.ceil(hackThreads),
            }
          );
        } else {
          //Print all kill all workers
          ns.tprint(
            ns.sprintf(
              "Could not hackAnalyse %s: %s %s",
              hostname,
              hackThreads,
              JSON.stringify(server)
            )
          );
          killall(ns, {}, { d: defaultDepth });
          ns.exit();
        }
      }
    }

    if (flags.p && !(await ns.prompt("Continue?", { type: "boolean" }))) {
      ns.exit();
    }
    await ns.sleep(1e3);
  }
}

async function allServers(ns: NS) {
  const hosts: string[] = [];
  await walkDeepFirst(ns, defaultDepth, async (host) => {
    hosts.push(host);
  });

  return hosts
    .map(ns.getServer)
    .filter((server) => server.hasAdminRights)
    .filter(
      (server) => (server.requiredHackingSkill || 0) <= ns.getHackingLevel()
    )
    .filter((server) => !!server.moneyMax)
    .sort(
      ({ moneyMax: moneyMaxA }, { moneyMax: moneyMaxB }) =>
        moneyMaxB! - moneyMaxA!
    );
}

function getOptimalThreadsToWeaken(
  ns: NS,
  serverSecurity: number,
  serverMinSecurity: number
): number {
  const target = serverSecurity - serverMinSecurity;
  let lowerBound = 0,
    upperBound = 100e3;
  let threadCount = 0;
  while (lowerBound !== upperBound) {
    threadCount = Math.floor((upperBound - lowerBound) / 2 + lowerBound);
    const actual = ns.weakenAnalyze(threadCount);
    if (actual >= target && actual <= target + 1) {
      break;
    }

    if (actual > target) {
      upperBound = threadCount;
      continue;
    }

    if (actual < target) {
      lowerBound = threadCount;
      continue;
    }
  }
  return threadCount;
}
