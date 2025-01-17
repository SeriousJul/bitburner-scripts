import { NS, Server } from "@ns";
import { deployall } from "/deployall";
import { killall } from "/killall";
import { defaultDepth } from "/lib/defaultDepth";
import { ThreadCounts } from "/lib/misc";
import { hasFormulas, validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
import { PSData, ps } from "/ps";
import { pwn } from "/pwn";
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

  const { flags } = validationReport;

  await bot(ns, flags);
}

const library = {
  specializedHack: "lib/specialized-hack.js",
  specializedGrow: "lib/specialized-grow.js",
  specializedWeaken: "lib/specialized-weaken.js",
};

export async function bot(ns: NS, { w, ...flags }: typeof flagsTemplate) {
  for (;;) {
    await pwn(ns, { d: defaultDepth, p: false, dl: false });

    await walkAllHackableServer(
      ns,
      async (data) => {
        if (!data.weaken.inProgress && data.weaken.shouldPerform(data)) {
          const weakenThreadsCounts = weakenThreads(ns, data);
          return await deployall(
            ns,
            { script: library.specializedWeaken, target: data.server.hostname },
            {
              d: defaultDepth,
              w,
              x: weakenThreadsCounts.threads,
              xh: weakenThreadsCounts.homeThreads,
            }
          );
        }
        return true;
      },
      async (data) => {
        if (!data.grow.inProgress && data.grow.shouldPerform(data)) {
          const growThreadsCounts = growThreads(ns, data);
          return await deployall(
            ns,
            { script: library.specializedGrow, target: data.server.hostname },
            {
              d: defaultDepth,
              w,
              x: growThreadsCounts.threads,
              xh: growThreadsCounts.homeThreads,
            }
          );
        }
        return true;
      },
      async (data) => {
        if (!data.hack.inProgress && data.hack.shouldPerform(data)) {
          const hackThreadsCounts = hackThreads(ns, data);
          //For some reason, it return -1 in some case, I need to understand those
          if (hackThreadsCounts.threads >= 0) {
            // await ns.sleep(1);
            return await deployall(
              ns,
              { script: library.specializedHack, target: data.server.hostname },
              {
                d: defaultDepth,
                w,
                x: hackThreadsCounts.threads,
                xh: hackThreadsCounts.homeThreads,
              }
            );
          } else {
            //Print all kill all workers
            ns.tprint(
              ns.sprintf(
                "Could not hackAnalyse %s: %s %s",
                data.server.hostname,
                hackThreads,
                JSON.stringify(data.server)
              )
            );
            killall(ns, { d: defaultDepth });
            ns.exit();
          }
        }
        return true;
      }
    );

    if (flags.p && !(await ns.prompt("Continue?", { type: "boolean" }))) {
      ns.exit();
    }
    await ns.sleep(1e3);
  }
}

interface WalkCallbackData {
  server: Server;
  processes: PSData[];
  weaken: {
    inProgress: boolean;
    serverSecurity: number;
    serverMinSecurity: number;
    shouldPerform: (data: WalkCallbackData) => boolean;
  };
  grow: {
    inProgress: boolean;
    money: number;
    maxMoney: number;
    shouldPerform: (data: WalkCallbackData) => boolean;
  };
  hack: {
    inProgress: boolean;
    hackChance: number;
    shouldPerform: (data: WalkCallbackData) => boolean;
  };
}

async function walkAllHackableServer(
  ns: NS,
  ...callbacks: ((data: WalkCallbackData) => Promise<boolean>)[]
) {
  const servers = await allHackableServersSorted(ns, "money-desc");
  let shouldContinue = true;
  while (servers.length) {
    const server = servers.pop();
    if (!server) break;
    if (!shouldContinue) break;

    const { hostname } = server;
    const processes = (await ps(ns, { d: defaultDepth, p: false })).filter(
      (process) => process.args?.[0] === hostname
    );

    for (const callback of callbacks) {
      shouldContinue = await callback({
        server,
        processes,
        weaken: {
          inProgress: !!processes.find(
            (process) => process.filename === library.specializedWeaken
          ),
          serverMinSecurity: ns.getServerMinSecurityLevel(hostname),
          serverSecurity: ns.getServerSecurityLevel(hostname),
          shouldPerform: (data) =>
            data.weaken.serverSecurity > data.weaken.serverMinSecurity,
        },
        grow: {
          inProgress: !!processes.find(
            (process) => process.filename === library.specializedGrow
          ),
          maxMoney: ns.getServerMaxMoney(hostname),
          money: ns.getServerMoneyAvailable(hostname),
          shouldPerform: (data) => data.grow.money < data.grow.maxMoney,
        },
        hack: {
          inProgress: !!processes.find(
            (process) => process.filename === library.specializedHack
          ),
          hackChance: ns.hackAnalyzeChance(hostname),
          shouldPerform: (data) =>
            !!data.grow.money && data.hack.hackChance > 0,
        },
      });

      if (!shouldContinue) break;
    }
  }
}

async function allHackableServersSorted(
  ns: NS,
  order: "money-asc" | "money-desc"
) {
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
    .sort(({ moneyMax: moneyMaxA }, { moneyMax: moneyMaxB }) =>
      order === "money-asc"
        ? (moneyMaxB || 0) - (moneyMaxA || 0)
        : (moneyMaxA || 0) - (moneyMaxB || 0)
    );
}

function hackThreads(ns: NS, data: WalkCallbackData): ThreadCounts {
  return new ThreadCounts(
    Math.ceil(
      ns.hackAnalyzeThreads(data.server.hostname, data.grow.money * 0.6)
    ),
    Math.ceil(
      ns.hackAnalyzeThreads(data.server.hostname, data.grow.money * 0.6)
    )
  );
}

function weakenThreads(ns: NS, data: WalkCallbackData): ThreadCounts {
  return new ThreadCounts(
    getOptimalThreadsToWeaken(ns, data, getHomeCpuCores(ns)),
    getOptimalThreadsToWeaken(ns, data)
  );
}

function getOptimalThreadsToWeaken(
  ns: NS,
  data: WalkCallbackData,
  cpuCores?: number
): number {
  const { serverSecurity, serverMinSecurity } = data.weaken;
  const target = serverSecurity - serverMinSecurity;
  let lowerBound = 0,
    upperBound = 100e3;
  let threadCount = 0;
  while (lowerBound !== upperBound) {
    threadCount = Math.floor((upperBound - lowerBound) / 2 + lowerBound);
    const actual = ns.weakenAnalyze(threadCount, cpuCores);
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

function growThreads(ns: NS, data: WalkCallbackData): ThreadCounts {
  const formulasEnabled = hasFormulas(ns);
  const cpuCores = getHomeCpuCores(ns);
  if (formulasEnabled) {
    return new ThreadCounts(
      ns.formulas.hacking.growThreads(
        data.server,
        ns.getPlayer(),
        data.grow.maxMoney,
        cpuCores
      ),
      ns.formulas.hacking.growThreads(
        data.server,
        ns.getPlayer(),
        data.grow.maxMoney
      )
    );
  }
  return new ThreadCounts(
    data.grow.money
      ? Math.ceil(
          ns.growthAnalyze(
            data.server.hostname,
            data.grow.maxMoney / data.grow.money,
            cpuCores
          )
        )
      : 100,
    data.grow.money
      ? Math.ceil(
          ns.growthAnalyze(
            data.server.hostname,
            data.grow.maxMoney / data.grow.money
          )
        )
      : 100
  );
}
function getHomeCpuCores(ns: NS) {
  return ns.getServer("home").cpuCores;
}
