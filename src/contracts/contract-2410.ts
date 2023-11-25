/**
You are given the following decimal Value:
14806590036
Convert it to a binary representation and encode it as an 'extended Hamming code'. Eg:
Value 8 is expressed in binary as '1000', which will be encoded with the pattern 'pppdpddd', where p is a parity bit and d a data bit. The encoding of
8 is 11110000. As another example, '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.
The answer should be given as a string containing only 1s and 0s.
NOTE: the endianness of the data bits is reversed in relation to the endianness of the parity bits.
NOTE: The bit at index zero is the overall parity bit, this should be set last.
NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which explains the 'rule' of encoding, including the first index parity bit mentioned in the previous note.

Extra rule for encoding:
There should be no leading zeros in the 'data bit' section
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-2410.cct";
const host = "foodnstuff";

const data = 14806590036;
const data2 = "pppdpdddpd";

const argsTemplate = {};
const flagsTemplate = {
  //dry-run
  d: false,
};

export async function main(ns: NS): Promise<void> {
  const validationReport = validateScriptInput(ns, flagsTemplate, argsTemplate);
  if (validationReport === false) {
    return;
  }

  const { flags } = validationReport;

  await solve(ns, flags);
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  ns.tprintf("data: %s", data);

  const controlBitIndexes = [...data2]
    .map((value, index) => (value === "p" ? index + 1 : -1))
    .filter((value) => value > 0);
  const solution = HammingEncode(data);
  // setConfig({pow:4}).encode()

  ns.tprintf("debug: %s", controlBitIndexes);
  ns.tprintf("debug: %s", "8 -> 1000 -> 11110000");
  ns.tprintf("debug: %s", HammingEncode(8));
  ns.tprintf("debug: %s", "21 -> 10101 -> 1001101011");
  ns.tprintf("debug: %s", HammingEncode(21));
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
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
