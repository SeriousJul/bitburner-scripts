import { NS, Server } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
import { newLine } from "/lib/misc";
import { validateScriptInput } from "/lib/utilities";
import { IAccumulatorData, walkDeepFirst } from "/lib/walkDeepFirst";
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

  const { flags } = validationReport;

  await toPwn(ns, flags);
}

export async function toPwn(ns: NS, { d: depth }: typeof flagsTemplate) {
  const serversToPwn: { server: Server; nodes: string[] }[] = [];
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

      if (!server.backdoorInstalled && server.hasAdminRights) {
        serversToPwn.push({ server, nodes: acc.nodes });
      }
    },
    { excludes: ns.getPurchasedServers() }
  );
  serversToPwn
    .sort(({ server: serverA }, { server: serverB }) => {
      return (
        (serverB.requiredHackingSkill || 0) -
        (serverA.requiredHackingSkill || 0)
      );
    })
    .forEach((server) => {
      ns.tprintf(generateConnect(server.nodes, server.server.hostname));

    });
}
export function generateConnect(nodes: string[], host: string): string {
  return (
    " home;" +
    nodes
      .slice(1)
      .concat([host])
      .map((node) => `connect ${node};`)
      .join("") +
    "backdoor; "
  );
}
