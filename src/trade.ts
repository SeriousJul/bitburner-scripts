import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {
  host: "n00dles",
};
const flagsTemplate = {
  //depth
  d: 10,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await trade(ns, args, flags);
}

export async function trade(
  ns: NS,
  { host }: typeof argsTemplate,
  { d: depth }: typeof flagsTemplate
) {
  const stock = ns.stock;
  const fee = stock.getConstants().StockMarketCommission;
  while (true) {
    stock.get

    ns.sleep(stock.getConstants().msPerStockUpdate);
  }
}
