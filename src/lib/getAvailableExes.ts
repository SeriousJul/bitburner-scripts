import { NS } from "@ns";

export const getAvailableExes = (ns: NS) =>
  [
    {
      name: "brutessh",
      fn: ns.brutessh,
      available: ns.fileExists("BruteSSH.exe"),
    },
    {
      name: "ftpcrack",
      fn: ns.ftpcrack,
      available: ns.fileExists("FTPCrack.exe"),
    },
    {
      name: "relaysmtp",
      fn: ns.relaysmtp,
      available: ns.fileExists("relaySMTP.exe"),
    },
    {
      name: "httpworm",
      fn: ns.httpworm,
      available: ns.fileExists("HTTPWorm.exe"),
    },
    {
      name: "sqlinject",
      fn: ns.sqlinject,
      available: ns.fileExists("SQLInject.exe"),
    },
    { name: "nuke", fn: ns.nuke, available: true },
  ].filter((exe) => exe.available);
