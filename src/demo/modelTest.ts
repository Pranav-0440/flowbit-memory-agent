import { createMemory, recallMemory } from "../memory/memoryRepository";

createMemory(
  "VENDOR",
  "Supplier GmbH",
  "Leistungsdatum",
  "serviceDate",
  0.6
);

const memories = recallMemory("Supplier GmbH");
console.log(memories);
