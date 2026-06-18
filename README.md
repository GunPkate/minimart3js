# 🏪 Minimart Simulation (Three.js)

A simulation game built with **Three.js** where NPC humans act as customers and employees inside a minimart.  
The project focuses on **NPC behavior**, waypoint navigation, and role-based tasks.

---

## 📌 Features

### 1. Waypoint System
- Editable waypoint movement for NPCs.
- Rules:
  - Waypoints must not overlap obstacles or walls.
  - Waypoints can overlap each other.
  - Waypoints are deleted when NPC is removed.
- Time system:
  - One in-game day = **12 minutes**.
  - Morning shift: **5 minutes pre-open + 1 minute open**.
  - Night shift: **5 minutes pre-close + 1 minute close**.
- Pathfinding:
  - Uses **Waypoint Graph** + **A\*** algorithm.
  - Map is static (no runtime obstacle recalculation).
- Time acceleration: `1x, 1.2x, 1.5x, 2x, 2.5x, 3x`.

---

### 2. Human Class

#### 👤 Customer
- **Capital JSON**:
  ```json
  { "npcId": "UUID", "cash": 1000, "bankAccount": [{ "bank": "KBB", "amount": 1000 }] }
