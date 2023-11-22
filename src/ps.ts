import { NS, ProcessInfo } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { validateScriptInput } from "/lib/utilities";
import {
  IAccumulatorData,
  defaultIAccumulatorData,
  walkDeepFirst,
} from "/lib/walkDeepFirst";
import { lineHeader } from "/lib/misc";
const argsTemplate = {};
const flagsTemplate = {
  //depth
  d: defaultDepth,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  await ps(ns, args, flags);
}

export async function ps(
  ns: NS,
  {}: typeof argsTemplate,
  { d: depth }: typeof flagsTemplate
) {
  let processes: (ProcessInfo & { host: string })[] = [];
  await walkDeepFirst(ns, depth, async (host) => {
    processes.push(...ns.ps(host).map((process) => ({ ...process, host })));
  });

  const linePattern = "%s %s %s %s";
  const fileNamePadding = 20;
  const threadPadding = 4;
  const argsPadding = 30;
  const hostsPadding = 30;
  ns.tprintf(
    linePattern,
    "Filename".padEnd(fileNamePadding),
    "T".padEnd(threadPadding),
    "...Args".padEnd(argsPadding),
    "...hosts".padEnd(hostsPadding)
  );
  ns.tprintf(
    "-".padStart(
      fileNamePadding + threadPadding + argsPadding + hostsPadding,
      "-"
    )
  );

  const consolidated = processes.reduce((acc, { host, ...process }) => {
    const accProcess = acc.find(
      (accProcess) =>
        process.filename === accProcess.filename &&
        process.args.join() === accProcess.args.join()
    );
    if (!accProcess) acc.push({ ...process, hosts: [host] });
    else {
      accProcess.hosts.push(host);
      accProcess.threads += process.threads;
    }
    return acc;
  }, [] as (ProcessInfo & { hosts: string[] })[]);

  consolidated.forEach((process) => {
    ns.tprintf(
      linePattern,
      process.filename.padEnd(fileNamePadding),
      process.threads.toString().padEnd(threadPadding),
      `[${process.args.join("] [")}]`.padEnd(argsPadding),
      `[${process.hosts.join("] [")}]`.padEnd(hostsPadding)
    );
  });
  return consolidated;
}
