# Flowbit Learned Memory Agent

This project implements an intelligent invoice-processing agent that learns from
human corrections and vendor-specific patterns instead of treating each document
as a new entry.

## Core Idea: Learned Memory
The agent improves over time by storing structured memories such as:
- Vendor-specific field mappings
- VAT calculation strategies
- Currency recovery patterns
- SKU mappings
- Payment terms (Skonto)
- Duplicate detection safeguards

Memory is persisted across runs using SQLite.

---

## Architecture Overview

### Agent Pipeline
1. **Recall Agent**
   - Fetches previously learned vendor memories
2. **Apply Agent**
   - Applies learned memory (high confidence)
   - Falls back to heuristics if memory is unavailable
3. **Decision Agent**
   - Determines whether human review is required
4. **Human Feedback Loop**
   - Approved corrections are stored as memory
   - Confidence increases over time

---

## Memory Model

Each memory record contains:
- Vendor
- Key (e.g. "Leistungsdatum")
- Target field (e.g. "serviceDate")
- Confidence score
- Type (VENDOR / TAX / SKU / TERMS)

Memory is only created or reinforced after explicit human approval.

---

## Confidence-Based Behavior

| Confidence | Behavior |
|----------|---------|
| < 0.5 | Suggest only |
| 0.5 – 0.75 | Suggest learned mapping |
| ≥ 0.75 | Auto-apply |

---

## Demo Scenarios

### Supplier GmbH
- Learns mapping: `Leistungsdatum → serviceDate`
- Auto-applies on later invoices

### Parts AG
- Learns VAT-included pricing patterns
- Recovers missing currency from raw text

### Freight & Co
- Detects Skonto terms
- Maps shipping descriptions to FREIGHT SKU

### Duplicates
- Prevents learning from duplicate invoices

---

## How to Run Demos

```bash
# Fresh start
del data/memory.db

# First invoice (requires human review)
node -r ts-node/register src/demo/runInvoice1.ts

# Apply human correction (learn memory)
node -r ts-node/register src/demo/applyHumanFeedback.ts

# Second invoice (auto-applies memory)
node -r ts-node/register src/demo/runInvoice2.ts
```

## Agent Flow Architecture

The following diagram illustrates how the Learned Memory Agent processes invoices,
prioritizing learned vendor memory over heuristics and improving accuracy over time.

<img width="2816" height="1374" alt="flow-diagram" src="https://github.com/user-attachments/assets/407305dd-27d2-4353-9837-2463f7cfe91e" />
