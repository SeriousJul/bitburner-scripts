/**
You are given the following data, representing a graph:

[12,[[1,8],[3,10],[3,6],[3,9],[0,1],[9,11],[7,10],[0,5],[6,7],[2,8],[7,8],[0,3],[2,6],[1,11],[4,9],[1,9],[4,10],[7,11],[0,7],[3,11],[2,11],[7,9]]]

Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting.
The first element of the data represents the number of vertices in the graph.
Each vertex is a unique number between 0 and 11.
The next element of the data represents the edges of the graph.
Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v].
Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.
You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color.

Submit your answer in the form of an array, where element i represents the color of vertex i.
If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.

Examples:

Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
Output: [0, 0, 1, 1]

Input: [3, [[0, 1], [0, 2], [1, 2]]]
Output: []
 */
import { NS } from "@ns";
import { validateScriptInput } from "/lib/utilities";

const name = "contract-57834.cct";
const host = "home";

const data = [
  12,
  [
    [1, 8],
    [3, 10],
    [3, 6],
    [3, 9],
    [0, 1],
    [9, 11],
    [7, 10],
    [0, 5],
    [6, 7],
    [2, 8],
    [7, 8],
    [0, 3],
    [2, 6],
    [1, 11],
    [4, 9],
    [1, 9],
    [4, 10],
    [7, 11],
    [0, 7],
    [3, 11],
    [2, 11],
    [7, 9],
  ],
];

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

function tryColor(
  data: Record<number, number[]>,
  acc: number[],
  vertix = 0,
  color = 0
): number[] {
  if (acc[vertix] !== undefined && acc[vertix] !== color) {
    return [];
  }
  acc[vertix] = color;
  if (data[vertix] === undefined) {
    return acc;
  }
  for (const neighbor of data[vertix]) {
    const result = tryColor(data, acc, neighbor, (color + 1) % 2);
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
    acc[n2] = acc[n1].concat([n1]);
    return acc;
  }, {} as Record<number, number[]>);
}

async function solve(ns: NS, { d: dryRun }: typeof flagsTemplate) {
  const solution = tryColor(toMapOfVertice(data[1] as number[][]), []);

  ns.tprintf("data: %s", data);
  ns.tprintf("solution: %s", solution);
  if (!dryRun) {
    const reward = ns.codingcontract.attempt(solution, name, host);
    if (reward) {
      ns.tprint(`Contract solved successfully! Reward: ${reward}`);
    } else ns.tprint("Failed to solve contract.");
  }
}
