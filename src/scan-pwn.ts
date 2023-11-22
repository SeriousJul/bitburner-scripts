import { NS } from "@ns";
import { analyze } from "/lib/analyze";
import { defaultDepth } from "/lib/defaultDepth";
import { getAvailableExes } from "/lib/getAvailableExes";
import { scpExtensions } from "/lib/misc";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  // depth
  d: defaultDepth,
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
    { excludes: ns.getPurchasedServers() }
  );
}
