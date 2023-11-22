import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {};
const flagsTemplate = {
  //depth
  pool: 25,
  "min-ram": 8,
  ram: 128,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await buy(ns, args, flags);
}

export async function buy(
  ns: NS,
  {}: typeof argsTemplate,
  { pool, "min-ram": minRam, ram: initialRam }: typeof flagsTemplate
) {
  const purchase = (
    ram: number = initialRam,
    index = ns.getPurchasedServers().length
  ) => {
    if (ram <= minRam) {
      return;
    }
    if (ns.getPurchasedServers().length >= pool) {
      return;
    }

    const newHost = ns.purchaseServer("node-" + index, ram);
    if (newHost) {
      ns.tprintf("Purchased %s with %sGB", newHost, ram);
      purchase(ram, index + 1);
    } else {
      purchase(ram / 2, index);
    }
  };
  purchase();
}
