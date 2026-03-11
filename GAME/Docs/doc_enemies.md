# Enemies Configuration (enemies.js)

This module serves as the "Bestiary" for the game. It defines the visual properties, statistics, and available move-sets for all enemy NPCs encountered in battle.

---

## ## Data Structure

To add a new enemy to the game, you must follow a four-step definition process. This ensures the `battle.js` engine can correctly instantiate the enemy and its associated sprite.

### 1. Sprite Information (`enemyNameSpriteInfo`)
Defines the visual assets and animation properties.
* **`imageSrc`**: Path to the PNG sprite sheet.
* **`frames`**: An object containing `max` (total frames) and `frameSpeed`.
* **`position`**: The $x$ and $y$ coordinates where the enemy appears on the battle canvas.
* **`animate`**: Boolean to toggle idle animations.

### 2. Attack List (`enemyNameAttacks`)
A simple array of strings. These strings must match the keys defined in your global `attacks` object.
> **Note:** The AI in `battle.js` will randomly select from this list during the enemy's turn.

### 3. Bestiary Entry (`enemiesBestiary`)
A central registry object where the enemy is stored by a unique key.
* **`name`**: The display name shown on the health bar.
* **`spriteInfo`**: Reference to the object created in Step 1.
* **`maxHp`**: The total health points of the enemy.
* **`attackNames`**: Reference to the list created in Step 2.

### 4. Enemy List (`enemiesList`)
An array used by the random encounter logic. Only enemies added to this array will appear when `initBattle({ random: true })` is called.

---

## Constants Used
NORMAL_BATTLER_FRAME_SPEED: A global constant defining the standard animation playback rate.

---
## ## Adding a New Enemy

To add a new enemy (e.g., "Pippo"), use the following template:

```javascript
/* 1. Define Sprite */
const pippoSpriteInfo = {
    imageSrc: "Assets/Battle/Sprites/pippo.png",
    frames: {max: 4, frameSpeed: NORMAL_BATTLER_FRAME_SPEED},
    position: {x: 800, y: 100},
    animate: true
};

/* 2. Define Attacks */
const pippoAttacks = ['Tackle', 'Bite'];

/* 3. Register in Bestiary */
const enemiesBestiary = {
    // ... existing enemies ...
    Pippo: {
        name: 'Pippo', 
        spriteInfo: pippoSpriteInfo, 
        maxHp: 40, 
        attackNames: pippoAttacks
    }
};

/* 4. Add to Encounter Pool */
const enemiesList = [
   // ... existing enemies ...,
    enemiesBestiary.Pippo // New enemy is now spawnable
];
```
