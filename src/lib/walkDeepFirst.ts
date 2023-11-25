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
  depth = 1,
  callback: (
    host: string,
    acc: T
  ) => Promise<Exclude<T, IAccumulatorData> | void>,
  options?: {
    initValue?: Exclude<T, IAccumulatorData>;
    rootHost?: string;
    excludes?: string[];
  }
) {
  const excludes = options?.excludes || [];
  const rootHost = options?.rootHost || ns.getHostname();
  const walk = async (host: string, acc: T) => {
    if (acc.depth > depth) {
      return;
    }

    const customAcc = await callback(host, acc);

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
        ...customAcc,
        depth: acc.depth + 1,
        nodes: [...acc.nodes, host],
      });
    }
  };

  const initialValue: T = {
    ...defaultIAccumulatorData,
    ...options?.initValue,
  } as T;

  await walk(rootHost, initialValue);
}
