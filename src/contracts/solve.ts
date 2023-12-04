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
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, countCompose(data as number));
    },
  },
  "Total Ways to Sum II": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(
        ns,
        script,
        host,
        data,
        countComposeRestricted(
          (data as any)[0] as number,
          (data as any)[1] as number[]
        )
      );
    },
  },
  "Spiralize Matrix": {
    solvable: false,
    solve: () => false,
  },
  "Array Jumping Game": {
    solvable: true,
    solve: (ns, script, host, _data) => {
      const data = _data as number[];
      const n: number = data.length;
      let i = 0;
      for (let reach = 0; i < n && i <= reach; ++i) {
        reach = Math.max(i + data[i], reach);
      }
      const solution: boolean = i === n;
      return attemp(ns, script, host, data, solution ? "1" : "0");
    },
  },
  "Array Jumping Game II": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, countJumps(data as number[]));
    },
  },
  "Merge Overlapping Intervals": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, mergeIntervals(data as number[][]));
    },
  },
  "Generate IP Addresses": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, parseIp(data as string));
    },
  },
  "Algorithmic Stock Trader I": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, maxTxProfit(data as number[]));
    },
  },
  "Algorithmic Stock Trader II": {
    solvable: false,
    solve: () => false,
  },
  "Algorithmic Stock Trader III": {
    solvable: true,
    solve: (ns, script, host, data) => {
      const prices = data as number[];

      let max = maxTxProfit(prices);
      for (let i = 1; i < prices.length - 1; i++) {
        max = Math.max(
          max,
          maxTxProfit(prices.slice(0, i + 1)) +
            maxTxProfit(prices.slice(i + 1, prices.length))
        );
      }

      return attemp(ns, script, host, data, max);
    },
  },
  "Algorithmic Stock Trader IV": {
    solvable: true,
    solve: (ns, script, host, _data) => {
      const data = _data as [number, number[]];
      const k: number = data[0];
      const prices: number[] = data[1];

      function maxProfit(k: number, prices: number[]) {
        const len = prices.length;
        if (k > len / 2) {
          let res = 0;
          for (let i = 1; i < len; ++i) {
            res += Math.max(prices[i] - prices[i - 1], 0);
          }

          return res;
        }

        const hold: number[] = [];
        const rele: number[] = [];
        hold.length = k + 1;
        rele.length = k + 1;
        for (let i = 0; i <= k; ++i) {
          hold[i] = Number.MIN_SAFE_INTEGER;
          rele[i] = 0;
        }

        let cur: number;
        for (let i = 0; i < len; ++i) {
          cur = prices[i];
          for (let j = k; j > 0; --j) {
            rele[j] = Math.max(rele[j], hold[j] + cur);
            hold[j] = Math.max(hold[j], rele[j - 1] - cur);
          }
        }

        return rele[k];
      }

      return attemp(ns, script, host, data, maxProfit(k, prices));
    },
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
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(
        ns,
        script,
        host,
        data,
        walkDownFirst(
          createAndFillTwoDArray(
            (data as number[])[0],
            (data as number[])[1],
            () => 0
          ),
          0,
          0
        )
      );
    },
  },
  "Unique Paths in a Grid II": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(
        ns,
        script,
        host,
        data,
        walkDownFirst(data as number[][], 0, 0)
      );
    },
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
    solvable: true,
    solve: (ns, script, host, _data) => {
      const data = _data as [string, number];
      const num = data[0];
      const target = data[1];

      return attemp(
        ns,
        script,
        host,
        data,
        findMathExpressions("", num, target, 0, 0, 0)
      );
    },
  },
  "HammingCodes: Integer to Encoded Binary": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, HammingEncode(data as number));
    },
  },
  "HammingCodes: Encoded Binary to Integer": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, HammingDecode(data as string));
    },
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
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, comprLZDecode(data as string)!);
    },
  },
  "Compression III: LZ Compression": {
    solvable: true,
    solve: (ns, script, host, data) => {
      return attemp(ns, script, host, data, comprLZEncode(data as string)!);
    },
  },
  "Encryption I: Caesar Cipher": {
    solvable: true,
    solve: (ns, script, host, data) => {
      const [text, rotation] = <[string, number]>data;
      return attemp(ns, script, host, data, CaesarCipher(text, rotation));
    },
  },
  "Encryption II: Vigenère Cipher": {
    solvable: true,
    solve: (ns, script, host, data) => {
      const [text, keyword] = <[string, string]>data;
      return attemp(ns, script, host, data, VigenereCipher(text, keyword));
    },
  },
};

// compress plaintest string
export function comprLZEncode(plain: string): string {
  // for state[i][j]:
  //      if i is 0, we're adding a literal of length j
  //      else, we're adding a backreference of offset i and length j
  let cur_state: (string | null)[][] = Array.from(Array(10), () =>
    Array(10).fill(null)
  );
  let new_state: (string | null)[][] = Array.from(Array(10), () => Array(10));

  function set(
    state: (string | null)[][],
    i: number,
    j: number,
    str: string
  ): void {
    const current = state[i][j];
    if (current == null || str.length < current.length) {
      state[i][j] = str;
    } else if (str.length === current.length && Math.random() < 0.5) {
      // if two strings are the same length, pick randomly so that
      // we generate more possible inputs to Compression II
      state[i][j] = str;
    }
  }

  // initial state is a literal of length 1
  cur_state[0][1] = "";

  for (let i = 1; i < plain.length; ++i) {
    for (const row of new_state) {
      row.fill(null);
    }
    const c = plain[i];

    // handle literals
    for (let length = 1; length <= 9; ++length) {
      const string = cur_state[0][length];
      if (string == null) {
        continue;
      }

      if (length < 9) {
        // extend current literal
        set(new_state, 0, length + 1, string);
      } else {
        // start new literal
        set(new_state, 0, 1, string + "9" + plain.substring(i - 9, i) + "0");
      }

      for (let offset = 1; offset <= Math.min(9, i); ++offset) {
        if (plain[i - offset] === c) {
          // start new backreference
          set(
            new_state,
            offset,
            1,
            string + String(length) + plain.substring(i - length, i)
          );
        }
      }
    }

    // handle backreferences
    for (let offset = 1; offset <= 9; ++offset) {
      for (let length = 1; length <= 9; ++length) {
        const string = cur_state[offset][length];
        if (string == null) {
          continue;
        }

        if (plain[i - offset] === c) {
          if (length < 9) {
            // extend current backreference
            set(new_state, offset, length + 1, string);
          } else {
            // start new backreference
            set(new_state, offset, 1, string + "9" + String(offset) + "0");
          }
        }

        // start new literal
        set(new_state, 0, 1, string + String(length) + String(offset));

        // end current backreference and start new backreference
        for (let new_offset = 1; new_offset <= Math.min(9, i); ++new_offset) {
          if (plain[i - new_offset] === c) {
            set(
              new_state,
              new_offset,
              1,
              string + String(length) + String(offset) + "0"
            );
          }
        }
      }
    }

    const tmp_state = new_state;
    new_state = cur_state;
    cur_state = tmp_state;
  }

  let result = null;

  for (let len = 1; len <= 9; ++len) {
    let string = cur_state[0][len];
    if (string == null) {
      continue;
    }

    string += String(len) + plain.substring(plain.length - len, plain.length);
    if (result == null || string.length < result.length) {
      result = string;
    } else if (string.length == result.length && Math.random() < 0.5) {
      result = string;
    }
  }

  for (let offset = 1; offset <= 9; ++offset) {
    for (let len = 1; len <= 9; ++len) {
      let string = cur_state[offset][len];
      if (string == null) {
        continue;
      }

      string += String(len) + "" + String(offset);
      if (result == null || string.length < result.length) {
        result = string;
      } else if (string.length == result.length && Math.random() < 0.5) {
        result = string;
      }
    }
  }

  return result ?? "";
}

// decompress LZ-compressed string, or return null if input is invalid
export function comprLZDecode(compr: string): string | null {
  let plain = "";

  for (let i = 0; i < compr.length; ) {
    const literal_length = compr.charCodeAt(i) - 0x30;

    if (
      literal_length < 0 ||
      literal_length > 9 ||
      i + 1 + literal_length > compr.length
    ) {
      return null;
    }

    plain += compr.substring(i + 1, i + 1 + literal_length);
    i += 1 + literal_length;

    if (i >= compr.length) {
      break;
    }
    const backref_length = compr.charCodeAt(i) - 0x30;

    if (backref_length < 0 || backref_length > 9) {
      return null;
    } else if (backref_length === 0) {
      ++i;
    } else {
      if (i + 1 >= compr.length) {
        return null;
      }

      const backref_offset = compr.charCodeAt(i + 1) - 0x30;
      if (
        (backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) ||
        backref_offset > plain.length
      ) {
        return null;
      }

      for (let j = 0; j < backref_length; ++j) {
        plain += plain[plain.length - backref_offset];
      }

      i += 2;
    }
  }

  return plain;
}

function findMathExpressions(
  path: string,
  num: string,
  target: number,
  pos: number,
  evaluated: number,
  multed: number
): string[] {
  const result: string[] = [];
  if (pos === num.length) {
    if (target === evaluated) {
      result.push(path);
    }
    return result;
  }

  for (let i = pos; i < num.length; ++i) {
    if (i != pos && num[pos] == "0") {
      break;
    }
    const cur = parseInt(num.substring(pos, i + 1));

    if (pos === 0) {
      result.push(
        ...findMathExpressions(path + cur, num, target, i + 1, cur, cur)
      );
    } else {
      result.push(
        ...findMathExpressions(
          path + "+" + cur,
          num,
          target,
          i + 1,
          evaluated + cur,
          cur
        )
      );
      result.push(
        ...findMathExpressions(
          path + "-" + cur,
          num,
          target,
          i + 1,
          evaluated - cur,
          -cur
        )
      );
      result.push(
        ...findMathExpressions(
          path + "*" + cur,
          num,
          target,
          i + 1,
          evaluated - multed + multed * cur,
          multed * cur
        )
      );
    }
  }
  return result;
}

function VigenereCipher(text: string, keyword: string) {
  const cipher = [...text]
    .map((a, i) => {
      return a === " "
        ? a
        : String.fromCharCode(
            ((a.charCodeAt(0) -
              2 * 65 +
              keyword.charCodeAt(i % keyword.length)) %
              26) +
              65
          );
    })
    .join("");
  return cipher;
}

function mergeIntervals(data: number[][]) {
  const intervals: number[][] = [...data];
  intervals.sort((a: number[], b: number[]) => {
    return a[0] - b[0];
  });

  const result: number[][] = [];
  let start: number = intervals[0][0];
  let end: number = intervals[0][1];
  for (const interval of intervals) {
    if (interval[0] <= end) {
      end = Math.max(end, interval[1]);
    } else {
      result.push([start, end]);
      start = interval[0];
      end = interval[1];
    }
  }
  result.push([start, end]);
  return result;
}

function createAndFillTwoDArray<T>(
  rows: number,
  cols: number,
  valueProvider: () => T
) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, valueProvider)
  );
}

function countJumps(data: number[]) {
  const n: number = data.length;
  let reach = 0;
  let jumps = 0;
  let lastJump = -1;
  while (reach < n - 1) {
    let jumpedFrom = -1;
    for (let i = reach; i > lastJump; i--) {
      if (i + data[i] > reach) {
        reach = i + data[i];
        jumpedFrom = i;
      }
    }
    if (jumpedFrom === -1) {
      jumps = 0;
      break;
    }
    lastJump = jumpedFrom;
    jumps++;
  }
  return jumps;
}

function countComposeRestricted(integer: number, dataset: number[]) {
  const composition = new Array(integer + 1).fill(0);
  composition[0] = 1;
  for (let i = 0; i < dataset.length; i++) {
    for (let j = dataset[i]; j <= integer; j++) {
      composition[j] += composition[j - dataset[i]];
    }
  }
  return composition[integer];
}

function countCompose(integer: number) {
  const composition = new Array(integer + 1).fill(0);
  composition[0] = 1;
  for (let i = 1; i < integer; i++) {
    for (let j = i; j <= integer; j++) {
      composition[j] = composition[j] + composition[j - i];
    }
  }
  return composition[integer];
}

function isFinished(data: number[][], i: number, j: number) {
  return data.length === i + 1 && data[i].length === j + 1;
}

function canMoveRight(data: number[][], i: number, j: number) {
  return data[i].length > j + 1 && data[i][j + 1] !== 1;
}

function canMoveDown(data: number[][], i: number, j: number) {
  return data.length > i + 1 && data[i + 1][j] !== 1;
}

function walkDownFirst(data: number[][], i: number, j: number): number {
  if (isFinished(data, i, j)) {
    return 1;
  }

  let count = 0;
  if (canMoveDown(data, i, j)) {
    count += walkDownFirst(data, i + 1, j);
  }

  if (canMoveRight(data, i, j)) {
    count += walkDownFirst(data, i, j + 1);
  }

  return count;
}

function maxTxProfit(prices: number[]): number {
  let max = 0;
  for (let i = 0; i < prices.length - 1; i++) {
    for (let j = i; j < prices.length; j++) {
      max = Math.max(max, prices[j] - prices[i]);
    }
  }
  return max;
}

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
