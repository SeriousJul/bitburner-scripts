import { NS } from "@ns";
import { lineHeader } from "/lib/misc";
import { validateScriptInput } from "/lib/utilities";
const argsTemplate = {
  host: "n00dles",
  script: "contract-XX.cct",
};
const flagsTemplate = {};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { args } = validationReport;

  await solve(ns, args);
}

export async function solve(ns: NS, { host, script }: typeof argsTemplate) {
  const contractDefinition =
    types[ns.codingcontract.getContractType(script, host)];
  if (contractDefinition.solvable) {
    if (
      !contractDefinition.solve(
        ns,
        script,
        host,
        ns.codingcontract.getData(script, host)
      )
    ) {
      const errorMessage = ns.sprintf("Failed to solve %s on %s", script, host);
      ns.toast(errorMessage, "error");
      ns.tprint(errorMessage);
    }
  }
}

function attemp<T>(
  ns: NS,
  script: string,
  host: string,
  data: T,
  solution: string | number | unknown[]
) {
  ns.tprintf(lineHeader);
  ns.tprintf(
    "%s: %s (%s)",
    host,
    script,
    ns.codingcontract.getContractType(script, host)
  );
  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  const reward = ns.codingcontract.attempt(solution, script, host);
  if (reward) {
    const message = `Contract solved successfully! Reward: ${reward}`;
    ns.toast(message, "success");
    ns.tprint(message);
    return true;
  } else {
    const message = "Failed to solve contract";
    ns.toast(message, "error");
    ns.tprint(message);
    return false;
  }
}

interface IContractDefinition<T> {
  solvable: boolean;
  solve: (ns: NS, script: string, host: string, data: T) => boolean;
}

const types: Record<string, IContractDefinition<unknown>> = {
  "Find Largest Prime Factor": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, primeFactor(data as number));
    },
  },
  "Subarray with Maximum Sum": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(
        ns,
        script,
        host,
        data,
        findMaxSubArraySum(data as number[])
      );
    },
  },
  "Total Ways to Sum": {
    solvable: false,
    solve: () => false,
  },
  "Total Ways to Sum II": {
    solvable: false,
    solve: () => false,
  },
  "Spiralize Matrix": {
    solvable: false,
    solve: () => false,
  },
  "Array Jumping Game": {
    solvable: false,
    solve: () => false,
  },
  "Array Jumping Game II": {
    solvable: false,
    solve: () => false,
  },
  "Merge Overlapping Intervals": {
    solvable: false,
    solve: () => false,
  },
  "Generate IP Addresses": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, parseIp(data as string));
    },
  },
  "Algorithmic Stock Trader I": {
    solvable: false,
    solve: () => false,
  },
  "Algorithmic Stock Trader II": {
    solvable: false,
    solve: () => false,
  },
  "Algorithmic Stock Trader III": {
    solvable: true,
    solve: (ns, script, host, data) => {
      const prices = data as number[];
      function calc(prices: number[]): number {
        let max = 0;
        for (let i = 0; i < prices.length - 1; i++) {
          for (let j = i; j < prices.length; j++) {
            max = Math.max(max, prices[j] - prices[i]);
          }
        }
        return max;
      }

      let max = calc(prices);
      for (let i = 1; i < prices.length - 1; i++) {
        max = Math.max(
          max,
          calc(prices.slice(0, i + 1)) +
            calc(prices.slice(i + 1, prices.length))
        );
      }

      return attemp(ns, script, host, data, max);
    },
  },
  "Algorithmic Stock Trader IV": {
    solvable: false,
    solve: () => false,
  },
  "Minimum Path Sum in a Triangle": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(
        ns,
        script,
        host,
        data,
        TriangleMinSum(data as number[][], 0, 0)
      );
    },
  },
  "Unique Paths in a Grid I": {
    solvable: false,
    solve: () => false,
  },
  "Unique Paths in a Grid II": {
    solvable: false,
    solve: () => false,
  },
  "Shortest Path in a Grid": {
    solvable: false,
    solve: () => false,
  },
  "Sanitize Parentheses in Expression": {
    solvable: true,
    solve: (ns, script, host, data) => {
      let solutions: string[] = [];
      let depth = 1;
      do {
        solutions = parenthesisSolutions(data as string, new Set(), depth++);
      } while (!solutions.length);
      solutions = [...new Set(solutions)];
      return attemp(ns, script, host, data, solutions);
    },
  },
  "Find All Valid Math Expressions": {
    solvable: false,
    solve: () => false,
  },
  "HammingCodes: Integer to Encoded Binary": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, HammingEncode(data as number));
    },
  },
  "HammingCodes: Encoded Binary to Integer": {
    solvable: false,
    solve: () => false,
  },
  "Proper 2-Coloring of a Graph": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(
        ns,
        script,
        host,
        data,
        // tryColorGraph(toMapOfVertice((data as any)[1] as number[][]), [])
        tryColorGraphV2(
          (data as any)[0] as number,
          toMapOfVertice((data as any)[1] as number[][])
        )
      );
    },
  },
  "Compression I: RLE Compression": {
    solvable: false,
    solve: () => false,
  },
  "Compression II: LZ Decompression": {
    solvable: false,
    solve: () => false,
  },
  "Compression III: LZ Compression": {
    solvable: false,
    solve: () => false,
  },
  "Encryption I: Caesar Cipher": {
    solvable: true,
    solve: (ns, script, host, data) => {
      const [text, rotation] = <[string, number]>data;
      return attemp(ns, script, host, data, CaesarCipher(text, rotation));
    },
  },
  "Encryption II: Vigenère Cipher": {
    solvable: false,
    solve: () => false,
  },
};

function isValidIp(ip: string) {
  const splitted = ip.split(".").filter((value) => !!value);
  if (splitted.length != 4) return false;

  return !splitted.find(
    (value) =>
      ((Number.parseInt(value) != 0 || value.length > 1) &&
        value.startsWith("0")) ||
      Number.parseInt(value) > 255
  );
}

function parseIp(ip: string): string[] {
  const validIps = [];
  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      for (let k = 1; k < 4; k++) {
        const a1 = ip.substring(0, i);
        const a2 = ip.substring(i, i + j);
        const a3 = ip.substring(i + j, i + j + k);
        const a4 = ip.substring(i + j + k, ip.length);
        const candidate = `${a1}.${a2}.${a3}.${a4}`;
        if (isValidIp(candidate)) validIps.push(candidate);
      }
    }
  }
  return validIps;
}

function primeFactor(integer: number) {
  for (let i = 2; i < Math.sqrt(integer) + 1; i++) {
    const factor = integer / i;
    if (Number.isInteger(factor)) {
      return primeFactor(factor);
    }
  }
  return integer;
}

function sumArray(array: number[]) {
  return array.reduce((acc, value) => acc + value, 0);
}

function findMaxSubArraySum(array: number[]) {
  let currentMax = sumArray(array);
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = array.length; j > i; j--) {
      currentMax = Math.max(sumArray(array.slice(i, j)), currentMax);
    }
  }
  return currentMax;
}

function tryColorGraphV2(
  count: number,
  data: Record<number, number[]>
): number[] {
  const defaultColor = -1;
  const tryColorIn = 1;
  const solution = new Array(count).fill(defaultColor);
  const checklist: { vertix: number; color: number }[] = [];
  checklist.push({ vertix: 0, color: tryColorIn });
  while (checklist.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { vertix, color } = checklist.pop()!;
    solution[vertix] = color;
    for (const neighbor of data[vertix] || []) {
      if (solution[neighbor] === color) return [];
      if (solution[neighbor] === defaultColor)
        checklist.push({ vertix: neighbor, color: (color + 1) % 2 });
    }

    if (!checklist.length) {
      const vertixToPush = solution
        .map((value, index) => ({ value, index }))
        .find(({ value }) => value === defaultColor)?.index;
      if (vertixToPush != undefined)
        checklist.push({ vertix: vertixToPush, color: tryColorIn });
    }
  }
  return solution;
}

function tryColorGraph(
  data: Record<number, number[]>,
  acc: number[],
  vertix = 0,
  color = 0
): number[] {
  //Bugged, need to figure it out. Cleaning of acc does not bubble up
  if (acc[vertix] !== undefined && acc[vertix] !== color) {
    return [];
  }
  acc[vertix] = color;
  if (data[vertix] === undefined) {
    return acc;
  }
  for (const neighbor of data[vertix]) {
    const result = tryColorGraph(data, acc, neighbor, (color + 1) % 2);
    if (!result.length) {
      delete acc[vertix];
      return [];
    }
  }
  return acc;
}

function toMapOfVertice(data: number[][]) {
  return data.reduce((acc, [n1, n2]) => {
    acc[n1] = acc[n1] || [];
    acc[n2] = acc[n2] || [];
    acc[n1] = acc[n1].concat([n2]);
    acc[n2] = acc[n2].concat([n1]);
    return acc;
  }, {} as Record<number, number[]>);
}

function isValidParenthesis(text: string) {
  let opened = 0;
  for (const char of [...text]) {
    if (char === "(") opened++;
    if (char === ")") opened--;
    if (opened < 0) return false;
  }
  return opened === 0;
}

function parenthesisSolutions(
  text: string,
  acc: Set<string>,
  depth: number
): string[] {
  if (depth === 0) return [];
  if (acc.has(text)) {
    return [];
  }
  acc.add(text);
  if (isValidParenthesis(text) || !text) {
    return [text || ""];
  }
  if (text.startsWith(")")) {
    return parenthesisSolutions(text.substring(1), acc, depth - 1);
  }
  return [...text]
    .map((value, index) => {
      return parenthesisSolutions(
        [...text]
          .slice(0, index)
          .concat([...text].slice(index + 1, text.length))
          .join(""),
        acc,
        depth - 1
      );
    })
    .reduce((acc, value) => {
      return acc.concat(value);
    }, [] as string[]);
}

function TriangleMinSum(triangle: number[][], i: number, j: number): number {
  if (i >= triangle.length || j >= triangle[i].length) {
    return 0;
  }
  const value = triangle[i][j];
  const left = value + TriangleMinSum(triangle, i + 1, j);
  const right = value + TriangleMinSum(triangle, i + 1, j + 1);
  return Math.min(left, right);
}

function CaesarCipher(text: string, rotation: number): string {
  // A: 65 .... Z: 90
  const AcharCode = "A".charCodeAt(0);
  const spaceCode = " ".charCodeAt(0);
  return [...text]
    .map((char) => (char === " " ? spaceCode : char.charCodeAt(0) - rotation))
    .map((charCode) =>
      charCode === spaceCode
        ? spaceCode
        : charCode < AcharCode
        ? charCode + 26
        : charCode
    )
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
}

//Shamefully stolen from https://github.com/bitburner-official/bitburner-src/blob/6a76e1a9ab58d9b6f103c90793307c61a668334f/src/utils/HammingCodeTools.ts could not figure it out myself
function HammingEncode(data: number): string {
  const enc: number[] = [0];
  const data_bits: any[] = data.toString(2).split("").reverse();

  data_bits.forEach((e, i, a) => {
    a[i] = parseInt(e);
  });

  let k = data_bits.length;

  /* NOTE: writing the data like this flips the endianness, this is what the
   * original implementation by Hedrauta did so I'm keeping it like it was. */
  for (let i = 1; k > 0; i++) {
    if ((i & (i - 1)) != 0) {
      enc[i] = data_bits[--k];
    } else {
      enc[i] = 0;
    }
  }

  let parity: any = 0;

  /* Figure out the subsection parities */
  for (let i = 0; i < enc.length; i++) {
    if (enc[i]) {
      parity ^= i;
    }
  }

  parity = parity.toString(2).split("").reverse();
  parity.forEach((e: any, i: any, a: any) => {
    a[i] = parseInt(e);
  });

  /* Set the parity bits accordingly */
  for (let i = 0; i < parity.length; i++) {
    enc[2 ** i] = parity[i] ? 1 : 0;
  }

  parity = 0;
  /* Figure out the overall parity for the entire block */
  for (let i = 0; i < enc.length; i++) {
    if (enc[i]) {
      parity++;
    }
  }

  /* Finally set the overall parity bit */
  enc[0] = parity % 2 == 0 ? 0 : 1;

  return enc.join("");
}

function HammingEncodeProperly(data: number): string {
  /* How many bits do we need?
   * n = 2^m
   * k = 2^m - m - 1
   * where k is the number of data bits, m the number
   * of parity bits and n the number of total bits. */

  let m = 1;

  while (2 ** (2 ** m - m - 1) - 1 < data) {
    m++;
  }

  const n: number = 2 ** m;
  const k: number = 2 ** m - m - 1;

  const enc: number[] = [0];
  const data_bits: any[] = data.toString(2).split("").reverse();

  data_bits.forEach((e, i, a) => {
    a[i] = parseInt(e);
  });

  /* Flip endianness as in the original implementation by Hedrauta
   * and write the data back to front
   * XXX why do we do this? */
  for (let i = 1, j = k; i < n; i++) {
    if ((i & (i - 1)) != 0) {
      enc[i] = data_bits[--j] ? data_bits[j] : 0;
    }
  }

  let parity: any = 0;

  /* Figure out the subsection parities */
  for (let i = 0; i < n; i++) {
    if (enc[i]) {
      parity ^= i;
    }
  }

  parity = parity.toString(2).split("").reverse();
  parity.forEach((e: any, i: any, a: any) => {
    a[i] = parseInt(e);
  });

  /* Set the parity bits accordingly */
  for (let i = 0; i < m; i++) {
    enc[2 ** i] = parity[i] ? 1 : 0;
  }

  parity = 0;
  /* Figure out the overall parity for the entire block */
  for (let i = 0; i < n; i++) {
    if (enc[i]) {
      parity++;
    }
  }

  /* Finally set the overall parity bit */
  enc[0] = parity % 2 == 0 ? 0 : 1;

  return enc.join("");
}

function HammingDecode(data: string): number {
  let err = 0;
  const bits: number[] = [];

  /* TODO why not just work with an array of digits from the start? */
  for (const i in data.split("")) {
    const bit = parseInt(data[i]);
    bits[i] = bit;

    if (bit) {
      err ^= +i;
    }
  }

  /* If err != 0 then it spells out the index of the bit that was flipped */
  if (err) {
    /* Flip to correct */
    bits[err] = bits[err] ? 0 : 1;
  }

  /* Now we have to read the message, bit 0 is unused (it's the overall parity bit
   * which we don't care about). Each bit at an index that is a power of 2 is
   * a parity bit and not part of the actual message. */

  let ans = "";

  for (let i = 1; i < bits.length; i++) {
    /* i is not a power of two so it's not a parity bit */
    if ((i & (i - 1)) != 0) {
      ans += bits[i];
    }
  }

  /* TODO to avoid ambiguity about endianness why not let the player return the extracted (and corrected)
   * data bits, rather than guessing at how to convert it to a decimal string? */
  return parseInt(ans, 2);
}
