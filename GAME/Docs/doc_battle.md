# Battle.js Documentation

This module manages the **Battle Engine** for the game. It handles state transitions between the map and combat, sprite rendering, turn-based logic, and UI updates using GSAP and the HTML5 Canvas API.

---

## ## Core Components

### 1. Sprite & Battler Initialization
The file defines the player's visual and functional data for the battle scene.
* **`pgSpriteInfo`**: Configuration object for the player's sprite (frames, speed, and position).
* **`pgBattler`**: An instance of the `Battler` class. It tracks stats like `maxHp`, `currHp`, and available `attackNames`.
* **`battleBackground`**: A static `Sprite` instance that renders the environment behind the combatants.

### 2. The Animation Loop
The battle utilizes a recursive `requestAnimationFrame` loop to render elements to the canvas in a specific layer order.

**Render Order:**
1. `battleBackground`
2. `enemies[0]`
3. `atkSpritesToRender` (Visual effects)
4. `pgBattler` (Player)

---

## ## Function Reference

### State Management
| Function | Description |
| :--- | :--- |
| `initBattle()` | Transitions the game from `MAP` to `BATTLE`. Loads enemies (random or selected by the invoker of the battle), enables battle menu attaching attack callbacks to the menu button, resets health bars, and triggers music/fade-in animations. |
| `exitBattle()` | Cleans up the battle state. Handles logic for **Victory** (returning to map/ending) or **Defeat** (Game Over screen and page reload). |

### UI Control & Flow
* **`disableButtons()` / `enableButtons()`**: Prevents player input during animations to avoid logic race conditions.
* **`queueNextAction()`**: Shifts the next function out of the `actionsQueue` and executes it. If the queue is empty, it closes the dialogue box.
* **`disablediagBoxBattle()`**: Disables pointer events on the dialogue box to prevent accidental skips during critical animations.

### Combat Logic
The system uses a **Callback/Queue system** to handle the flow of a turn:
1. **Player selects attack**: Triggers `animationCbk`.
2. **K.O. Check**: If the enemy $HP \le 0$, it queues the `faint` and `exitBattle` sequences.
3. **Enemy Turn**: If the enemy survives, it selects a random move and triggers its own animation callback.
4. **Health Bars**: Calculated dynamically using the formula: 
   $$\text{Width} = \left( \frac{\text{currHp}}{\text{maxHp}} \right) \times 100\%$$

---

## ## Event Listeners
The file dynamically attaches listeners to DOM elements during initialization:
* **Attack Buttons**: Cloned and replaced during `initBattle` to clear old listeners, then updated with current `pgBattler` attack names.
* **Mouse Enter**: Displays attack descriptions in the `#battleAttackInfo` panel.
* **Dialogue Box Click**: Triggers `queueNextAction()` to progress through battle text.

---

## ## Dependencies
* **GSAP**: Used for all UI transitions (opacity) and health bar depletion animations.
* **Audio Object**: Controls `battleIntro`, `battleBGM`, and `victory` tracks.
* **External Constants**: Relies on `PG_SPRITE_X`, `PG_SPRITE_Y`, and `G_S` (GameState enum).

---