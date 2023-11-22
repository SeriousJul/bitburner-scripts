import { NS } from "@ns";
import { scpExtensions } from "/lib/misc";

export function uploadLib(ns: NS, file: string, host: string) {
  const filesToUpload = ns
    .ls("home", "lib/")
    .filter(
      (file) => !!scpExtensions.filter((extension) => file.endsWith(extension)).length
    )
    .concat([file]);
  ns.scp(filesToUpload, host, "home");
}
