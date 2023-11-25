import { NS } from "@ns";
import { analyze } from "/lib/analyze";
import { defaultDepth } from "/lib/defaultDepth";
import { getAvailableExes } from "/lib/getAvailableExes";
import { scpExtensions } from "/lib/misc";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
const argsTemplate = {};
const flagsTemplate = {
  dl: false,
  // depth
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

  await pwn(ns, flags);
}

export async function pwn(
  ns: NS,
  { d: depth, p: print, dl }: typeof flagsTemplate
) {
  const availablesPwn = getAvailableExes(ns);

  const run = (name: string, cmd: typeof ns.nuke, host: string) =>
    print ? ns.tprintf("%s:\t\t\t%s", name, cmd(host)) : cmd(host);

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
      if (dl)
        ns.ls(host)
          .filter((file) => !ns.fileExists(file))
          .filter(
            (file) =>
              !!scpExtensions.filter((extension) => file.endsWith(extension))
                .length
          )
          .filter((file) => !file.endsWith(".js"))
          .forEach((file) => ns.scp(file, "home", host));

      if (print) analyze(ns, acc.nodes.concat([host]).join(" -> "), host);
    },
    { excludes: ns.getPurchasedServers() }
  );
}
