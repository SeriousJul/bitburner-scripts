import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {};
const flagsTemplate = {};

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
  {}: typeof argsTemplate,
  {}: typeof flagsTemplate
) {
  const stock = ns.stock;
  const fee = stock.getConstants().StockMarketCommission;
  while (true) {
    //TODO
    ns.sleep(stock.getConstants().msPerStockUpdate);
  }
}
