import { NS, Server } from "@ns";
import { defaultDepth } from "/lib/defaultDepth";
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
  serversToPwn.sort(({ server: serverA }, { server: serverB }) => {
    return (
      (serverB.requiredHackingSkill || 0) - (serverA.requiredHackingSkill || 0)
    );
  });

  for (const { nodes, server } of serversToPwn.reverse()) {
    ns.tprintf(generateConnect(nodes, server.hostname));
    if (
      server.hasAdminRights &&
      !server.backdoorInstalled &&
      server.requiredHackingSkill &&
      ns.getHackingLevel() > server.requiredHackingSkill
    ) {
      for (const node of nodes) {
        ns.singularity.connect(node);
      }
      ns.singularity.connect(server.hostname);
      ns.tprintf("Installing backdoor... " + ns.singularity.getCurrentServer());
      await ns.singularity.installBackdoor();
      ns.tprintf("Installed backdoor... " + ns.singularity.getCurrentServer());
      for (const node of nodes.reverse()) {
        ns.singularity.connect(node);
      }
      ns.singularity.connect("home");
      ns.tprintf("Back home... " + ns.singularity.getCurrentServer());
    }
  }
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
