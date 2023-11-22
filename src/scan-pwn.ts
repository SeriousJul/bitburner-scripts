import { NS } from "@ns";
import {
  validateScriptInput,
} from "/lib/utilities";
import { scpExtensions } from "./lib/misc";
import { walkDeepFirst } from "./lib/walkDeepFirst";
import { getAvailableExes } from "./lib/getAvailableExes";
import { analyze } from "/lib/analyze";
const argsTemplate = {};
const flagsTemplate = {
  // depth
  d: 10,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args, flags } = validationReport;

  const depth: number = flags.d;

  const availablesPwn = getAvailableExes(ns);

  const run = (name: string, cmd: typeof ns.nuke, host: string) =>
    ns.tprintf("%s:\t\t\t%s", name, cmd(host));

  await walkDeepFirst(
    ns,
    depth,
    async (host, acc) => {
      ns.printf("%s", host);
      /**Gain root access */
      if (
        !ns.hasRootAccess(host) &&
        ns.getServerNumPortsRequired(host) < availablesPwn.length
      ) {
        availablesPwn.forEach((availablePwn) =>
          run(availablePwn.name, availablePwn.fn, host)
        );
      }

      /** download all files located on server that does not already exist */
      ns.ls(host)
        .filter((file) => !ns.fileExists(file))
        .filter(
          (file) =>
            !!scpExtensions.filter((extension) => file.endsWith(extension))
              .length
        )
        .forEach((file) => ns.scp(file, "home", host));

      /** upload pwn lib */
      ns.ls("home", "lib/")
        .filter(
          (file) =>
            !!scpExtensions.filter((extension) => file.endsWith(extension))
              .length
        )
        .forEach((file) => ns.scp(file, host, "home"));

      // const pid = ns.run(
      //   "lib/analyze.js",
      //   {},
      //   host,
      //   "-h",
      //   acc.nodes.concat([host]).join(" -> ")
      // );
      // while (ns.isRunning(pid)) {
      //   await ns.sleep(100);
      // }
      analyze(ns, acc.nodes.concat([host]).join(" -> "), host);
    },
    ns.getHostname(),
    { excludes: ns.getPurchasedServers() }
  );
}
