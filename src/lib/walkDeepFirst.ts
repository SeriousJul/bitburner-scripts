import { NS } from "@ns";

export interface IAccumulatorData {
  depth: number;
  nodes: string[];
}

export const defaultIAccumulatorData: IAccumulatorData = {
  depth: 0,
  nodes: [],
};

export async function walkDeepFirst<
  T extends IAccumulatorData = IAccumulatorData
>(
  ns: NS,
  depth: number = 1,
  callback: (host: string, acc: T) => Promise<void>,
  rootHost: string = ns.getHostname(),
  accOptions?: {
    initValue?: T;
    reduce?: (host: string, acc: T) => T;
    excludes: string[];
  }
) {
  const excludes = accOptions?.excludes || [];
  const walk = async (host: string, acc: T) => {
    if (acc.depth > depth) {
      return;
    }

    await callback(host, acc);

    const scannedHosts = ns
      .scan(host)
      .filter(
        (scannedHost) =>
          acc.nodes.indexOf(scannedHost) < 0 &&
          excludes.indexOf(scannedHost) < 0
      );

    for (const scannedHost of scannedHosts) {
      await walk(scannedHost, {
        ...acc,
        ...accOptions?.reduce?.(scannedHost, acc),
        depth: acc.depth + 1,
        nodes: [...acc.nodes, host],
      });
    }
  };

  const initialValue: T = {
    ...defaultIAccumulatorData,
    ...accOptions?.initValue,
  } as T;

  await walk(rootHost, initialValue);
}
