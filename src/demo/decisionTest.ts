import { decisionAgent } from "../agent/decisionAgent";

const decision = decisionAgent(
  ["Suggest mapping Leistungsdatum → serviceDate"],
  []
);

console.log("DECISION RESULT:");
console.log(decision);
