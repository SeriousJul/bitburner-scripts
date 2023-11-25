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
    solvable: false,
    solve: () => false,
  },
  "Subarray with Maximum Sum": {
    solvable: false,
    solve: () => false,
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
    solvable: false,
    solve: () => false,
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
    solvable: false,
    solve: () => false,
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
    solvable: false,
    solve: () => false,
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
    solvable: false,
    solve: () => false,
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