# Attack Management Documentation (`attacks.js`)

This module provides the core utility functions for combat actions and handles the dynamic, sequential loading of individual attack scripts.

---

## ## Core Utility Functions
The following functions are globally available for reuse within individual attack scripts to handle common RPG mechanics.

### `directDamageMove(target)`
Subtracts the calling attack's damage from the target's current health.
* **Logic**: $target.currHp = \max(0, target.currHp - damage)$
* **Safety**: Automatically ensures HP does not drop below 0.

### `healMove(target, amount)`
Increases the target's current health by a specific value.
* **Logic**: $target.currHp = \min(target.maxHp, target.currHp + amount)$
* **Safety**: Automatically caps health at the target's `maxHp`.

---

## ## Dynamic Loading System
To keep the engine modular, attacks are stored in individual files within `./Data/Attacks_Scripts/`. These are loaded using `loadSequentially`.

### 1. `sourcesAtk` Registry
This array contains the file paths for every attack script that needs to be imported.
> **Note**: Any new attack script **must** be added here to be recognized by the game.

### 2. `attacksLoaded()` Callback
This function is executed once all scripts in `sourcesAtk` have been successfully loaded. It maps the script-defined variables (e.g., `atkTackle`) to the global `attacks` object used by the battle engine.

---

## ## How to Add a New Attack
To add a new attack (e.g., **"ThunderBolt"**), follow these steps:

1. **Create the Script**: Create `./Data/Attacks_Scripts/ThunderBolt.js`. Inside, define an object named `atkThunderBolt`.
2. **Register the Path**: Add the path to the `sourcesAtk` array:
   ```javascript
   function attacksLoaded(){
    ...
    attacks.ThunderBolt = atkThunderBolt;
	}
	
   const sourcesAtk = [
       ...,
       "./Data/Attacks_Scripts/ThunderBolt.js"
   ];
	```