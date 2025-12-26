import "../memory/memoryStore";
import { recallMemory } from "../memory/memoryRepository";
import { learnAgent } from "../agent/learnAgent";

const memories = recallMemory("Supplier GmbH");

const result = learnAgent(memories, "APPROVED");

console.log("LEARNING RESULT:");
console.log(result);
