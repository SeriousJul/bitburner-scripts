import { NS, ScriptArg } from "@ns";

export type TFlag = ScriptArg | string[];

const space = " ";
export function validateScriptInput<
  F extends Record<string, TFlag>,
  A extends Record<string, ScriptArg>
>(ns: NS, flagsTemplate: F, argsTemplate: A) {
  const { flags, args } = getArgs(ns, flagsTemplate, argsTemplate);
  if (
    flags.help ||
    !validateFlags(flags, { ...flagsTemplate, help: false }) ||
    !validateArgs(args, argsTemplate)
  ) {
    ns.tprintf(
      "USAGE: run %s %s %s",
      ns.getScriptName(),
      Object.entries(flagsTemplate)
        .map(
          ([name, value]) =>
            `-${name.length > 1 ? "-" : ""}${name} ${typeof value}`
        )
        .join(space),
      Object.keys(argsTemplate)
        .map((key) => `<${key}>`)
        .join(space)
    );
    ns.tprint("Example:");
    ns.tprintf(
      "> run %s %s %s",
      ns.getScriptName(),
      Object.entries(flagsTemplate)
        .map(
          ([name, value]) => `-${name.length > 1 ? "-" : ""}${name} ${value}`
        )
        .join(space),
      Object.values(argsTemplate).join(space)
    );
    return false;
  }
  return { flags, args };
}

function validateArgs<A extends Record<string, ScriptArg>>(
  args: A,
  argsTemplate: A
): boolean {
  const argsValues = Object.values(args);
  const argsTemplateValues = Object.values(argsTemplate);

  if (argsValues.length !== argsTemplateValues.length) return false;

  for (let i = 0; i < argsValues.length; i++) {
    if (typeof argsValues[i] !== typeof argsTemplateValues[i]) return false;
  }
  return true;
}

function validateFlags<F extends Record<string, TFlag>>(
  flags: F,
  flagsTemplate: F
): boolean {
  const flagsValues = Object.values(flags);
  const flagsTemplateValues = Object.values(flagsTemplate);

  if (flagsValues.length !== flagsTemplateValues.length) return false;

  for (let i = 0; i < flagsValues.length; i++) {
    if (typeof flagsValues[i] !== typeof flagsTemplateValues[i]) return false;
  }
  return true;
}

export function getArgs<
  F extends Record<string, TFlag>,
  A extends Record<string, ScriptArg>
>(ns: NS, flagsTemplate: F, argsTemplate: A): { args: A; flags: F } {
  const tmp: [string, TFlag][] = Object.entries(flagsTemplate);
  tmp.push(["help", false]);
  let nsFlags = {} as ReturnType<typeof ns.flags>;
  try {
    nsFlags = ns.flags(tmp);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  const { _, ...flags } = nsFlags;
  return {
    flags: flags as F,
    args: Object.keys(argsTemplate).reduce((acc, _value, index) => {
      const value = _value as keyof A;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acc[value] = (_ as any)[index];
      return acc;
    }, {} as A),
  };
}
