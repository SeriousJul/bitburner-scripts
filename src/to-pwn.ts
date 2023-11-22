import { NS } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { newLine } from "/lib/misc";
import { validateScriptInput } from "/lib/utilities";
import { walkDeepFirst } from "/lib/walkDeepFirst";
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

  await toPwn(ns, args, flags);
}

export async function toPwn(
  ns: NS,
  {}: typeof argsTemplate,
  { d: depth }: typeof flagsTemplate
) {
  await walkDeepFirst(
    ns,
    depth,
    async (host, acc) => {
      if (host == "home") {
        return;
      }

      const server = ns.getServer(host);
      if (!server.requiredHackingSkill) {
        return;
      }

      if (ns.getHackingLevel() < server.requiredHackingSkill) {
        return;
      }

      if (!server.backdoorInstalled || !server.hasAdminRights) {
        ns.tprintf(acc.nodes.concat([host]).join("->"));
        ns.tprintf(
          "root(%s)\tbackdoor(%s)\thackdiff(%s)",
          server.hasAdminRights,
          server.backdoorInstalled,
          server.requiredHackingSkill
        );
        ns.tprintf(newLine);
      }
    },
    ns.getHostname(),
    { excludes: ns.getPurchasedServers() }
  );
}
