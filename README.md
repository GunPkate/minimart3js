Below is the requirement converted into `README.md` format.

# Minimart Simulation NPC System

## Overview

This project is a minimart simulation game built with Three.js.

The map already exists. Development will focus on NPC behavior simulation for customers and employees.

---

# 1. Waypoint Movement System

Create waypoint movement for NPC and make it editable in game.

### Requirements

* Waypoint must not overlap obstacle or wall.
* Waypoints can be overlapped.
* Waypoint is deleted when NPC is removed.
* One game day is 12 minutes.
* First morning shift: 5 minutes, pre-open: 1 minute.
* Second night shift: 5 minutes, pre-close: 1 minute.
* Use waypoint graph and A* pathfinding between waypoints.
* Map is static and no runtime obstacle recalculation.

### Time Speed

* 1x
* 1.2x
* 1.5x
* 2x
* 2.5x
* 3x

---

# 2. Human Class

## Customer

### 2.1 Capital

```json
{
  "npcId": "UUID",
  "cash": 1000,
  "bankAccount": [
    {
      "bank": "KBB",
      "amount": 1000
    }
  ]
}
```

Display cash in square above NPC avatar with opacity `0.5`.

---

### 2.2 Wanted Item

```json
{
  "npcId": "UUID",
  "item": [
    {
      "name": "itemName1",
      "qty": 8
    },
    {
      "name": "itemName2",
      "qty": 10
    }
  ]
}
```

---

### 2.3 Decision

```json
{
  "npcId": "UUID",
  "state": "statename"
}
```

#### States

1. `"buying"`

   * NPC walks toward item in `wantedItem`.

2. `"thinking"`

   * NPC is idle after picking item.
   * Change state to `"buying"` for next item.
   * Change state to `"checkingout"` when all items are picked.

3. `"checkingout"`

   * NPC has picked all wanted items and moves to POS.

4. `"done"`

   * NPC leaves minimart.

5. `"withdrawing"`

   * NPC moves to ATM and withdraws cash.
   * Minimum withdrawal = next item price × quantity.
   * Maximum withdrawal = all money in bank accounts.
   * If amount is insufficient, continue withdrawing from next account.

---

### 2.4 POS Queuing Area

* Customer queue by order.
* Queuing area size changes depending on number of POS machines.

---

## Employee

### 2.5 Task

```json
{
  "npcId": "UUID",
  "task": ""
}
```

#### Tasks

1. `cleaningFloor`

   * Employee moves around minimart and cleans floor.

2. `cashier`

   * Employee performs checkout process for customer in POS area.

3. `restock`

   * Employee moves item from stock and refills shelf.

4. `idle`

   * Employee stays in waiting area until new task is assigned.

5. `patrol`

   * Employee walks predefined route and monitors shelf and customer.

6. `assistCustomer`

   * Employee guides customer to item location and answers stock request.

---

### 2.6 Role

```json
{
  "npcId": "UUID",
  "role": ""
}
```

#### Roles

1. `cashier`

   * Main responsibility is handling POS area and checkout process.

2. `floorStaff`

   * Main responsibility is assisting customer and maintaining minimart area.

3. `stocker`

   * Main responsibility is managing stock and refilling shelf.

---

### 2.7 Decision

```json
{
  "npcId": "UUID",
  "state": "statename"
}
```

#### States

1. `working`

   * Employee performs task.

2. `break`

   * Employee moves into breaking area.
   * Employee can be interacted with customer if not in waiting area.

3. `occupied`

   * Lock interaction with only one customer.

---

### 2.8 Previous Task

```json
{
  "npcId": "UUID",
  "task": ""
}
```

---

# 3. Create NPC (All) Behaviour Function

### 3.1 createNPC(type, spawnPosition)

Called when customer or employee walks in.

### 3.2 Customer Spawn

* Use fixed interval spawn.
* Input `spawnPosition` as parameter.

### 3.3 removeNPC

Called when customer or employee walks out.

### 3.4 moveToWaypoint

NPC moves according to decision state.

### 3.5 wandering

NPC wanders around when state is `"thinking"`.

---

# 4. Customer Behaviour Function

### 4.1 calculateMoney

After finishing item picking:

* If item possession exceeds cash:

  * Move to ATM and withdraw cash.
* Otherwise:

  * Continue buying.

---

### 4.2 pickItems

Customer can pick multiple quantity.

---

### 4.3 validatePickItems

Check quantity before picking.

---

### 4.4 checkShelf

If item is not on shelf:

1. Generate random number.
2. If higher than `0.5`:

   * Customer moves to nearest employee.
3. Otherwise:

   * Remove item from `wantedItem`.
   * Move to next item.

---

### 4.5 Employee Occupied

If employee state is `"occupied"`:

* Customer moves to next employee whose state is not `"occupied"`.

---

# 5. Employee Behaviour Function

### 5.1 cleanFloor

Employee cleans floor.

---

### 5.2 checkStockByCustomer

Employee changes state to `"thinking"`.

1. If item is available:

   * Change task to `restock`.
   * Move to pick item.
   * Default quantity = maximum shelf amount or remaining stock quantity.

2. Employee changes task back to `previousTask`.

---

### 5.3 performCashier

If customer exists in POS area:

1. Employee nearest to POS suspends on-hand task and performs cashier task if POS has no employee.
2. Employee changes state to `"occupied"`.
3. If no customer exists in POS area for 5 seconds:

   * Employee changes task back to `previousTask`.

---

### 5.4 Employee Task Priority

| Task           | Priority |
| -------------- | -------- |
| cashier        | 100      |
| assistCustomer | 80       |
| restock        | 60       |
| cleaningFloor  | 40       |
| patrol         | 20       |
| idle           | 0        |

---

### 5.5 assignTask

1. When shift starts, assign employee role and task.
2. Prioritize POS task first.
3. Number of employees with `cashier` task depends on number of POS machines.
4. Remaining employees are assigned to other tasks by priority.

---

# 6. System UI (Top Right)

* `showCustomer`

  * Number of customers in minimart.

* `showCustomerPOS`

  * Number of customers in POS area.

---

# 7. System UI (Top Left)

* `showOverallMoney`

  * Overall money amount.

* `empList`

  * Show employee role and task.
