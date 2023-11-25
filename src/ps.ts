import { NS, ProcessInfo } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { validateScriptInput } from "/lib/utilities";
import {
  walkDeepFirst
} from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  //depth
  d: defaultDepth,
  //print
  p: true,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { flags } = validationReport;

  await ps(ns, flags);
}

export type PSData = ProcessInfo & { hosts: string[] };

export async function ps(ns: NS, { d: depth, p: print }: typeof flagsTemplate) {
  const processes: (ProcessInfo & { host: string })[] = [];
  await walkDeepFirst(ns, depth, async (host) => {
    processes.push(...ns.ps(host).map((process) => ({ ...process, host })));
  });

  const linePattern = "%s %s %s %s";
  const fileNamePadding = 20;
  const threadPadding = 4;
  const argsPadding = 30;
  const hostsPadding = 30;
  if (print) {
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
  }

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
  }, [] as PSData[]);

  if (print)
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
