# RPG4Marika Documentation



---

## Project Structure

```
index.html
index.js
styles.css
Assets/
	|-Audio/
	|-Battle/
		|--Backgrounds
		|--Sprites
		|--Attacks/
	|-Maps/
	|-Player/
Data/
	|-attacks.js
	|-audio.js
	|-battle.js
	|-characters.js
	|-classes.js
	|-dialog.js
	|-enemies.js
	|-followers.js
	|-globals.js
	|-intro.js
	|-map.js
	|-menu.js
	|-playerSprite.js
	|-saves.js
	|-scriptLoader.js
	|-Attacks_Scripts/
	|-Maps/
	|-NPC_Scripts/
```
---
## Folders

### Assets
Contains the graphics and audio files used in the game.
The sounds are obviously contained in the **Audio** folder.
The **Battle** folder contains the graphics shown during a fight: the scenary in **Background**, the battlers in **Sprites**, and the pictures used for the attacks animation in **Attacks**.
The overworld maps are saved in the **Maps** folder and are spliced in two: each map has a '_base' and a '_upper' png file, to separate what has to be rendered under or over the player.
The **Player** flder contains the spritesheets for the overwolrd character, including the player.

### Data
Contains the core modules of the game. Each subfolder contains the various scripts and definitions for the attack animations and effects (**Attacks_Scripts**), the map (including the map's collisions, **Maps**) and the dialogs/events triggered by the NPCs (**NPC_Scripts**).

---
//TODO: da qui in giù è da rivedere
## Core Modules

### `globals.js`

Defines constants, enums (`G_S` game states), canvas setup, and global variables.  
Handles game state, input keys, audio volume, animation IDs, entities arrays (e.g. `characters`, `enemies`, `atkSpritesToRender`).

### `classes.js`

Implements all main classes:

- [`Sprite`](Data/classes.js) – base renderable object.
- [`Follower`](Data/classes.js) – extends `Sprite`, follows another sprite.
- [`Collision`](Data/classes.js) – tile collision block.
- [`Battler`](Data/classes.js) – battle participant with HP and actions.
- [`Attack`](Data/classes.js) – defines attack metadata and callbacks.
- [`Character`](Data/classes.js) – NPC/PC entity on the map with interaction logic.

### `audio.js`

Initialises Howler audio objects for BGM, SFX, music controls (`setMusicVolume`, `setSFXVolume`), separates arrays for settings.

### `dialog.js`

Dialog system with `showDialog`, `advanceDialog`, typewriter effect and click listeners on `#diagBox`.

### `map.js`

Responsible for overworld logic:

- Map definitions (`maps` constant, each imported from `Data/Maps`)
- `changeMap` to switch zones
- `createCollisions` to generate collisions from numeric arrays
- Movement (`movePos`), main animation loop (`animateMain`)
- Special scenes (`goodEndingScene`)

### `playerSprite.js` & `followers.js`

Defines `playerSprite` and two followers (`Sally` and `Nala`) with sprites, animations, and follow behaviour.

### `attacks.js`

Utility functions (`directDamageMove`, `healMove`) plus dynamic loading of attack scripts and registration (`attacksLoaded`).

### `enemies.js`

Contains enemy definitions used during battles.

### `battle.js`

Complete battle system:

- Player battler (`pgBattler`) and background
- UI helpers (`disableButtons`, `enableButtons`, etc.)
- Queue management (`queueNextAction`)
- `initBattle`, `animateBattle`, `exitBattle` with GSAP timelines and audio control.

### `characters.js`

Loads NPC scripts sequentially, registers characters for the overworld, and inserts them into `drawObjs`/`moveWithMapObjs`.

### `menu.js`

Main menu logic, options info (controls, settings, etc.), save/load implementation using File API or fallback, `resetMenu`.

### `intro.js`

Intro screen, start game, load save state, set initial game state.

### `saves.js`

Save structure and functions to store/load JSON files, `loadSaveData` to restore state.

### `scriptLoader.js`

Utility to dynamically inject `<script>` tags in order; used by `attacks.js` and `characters.js`.

--- 

## Maps

- **Maps** (`Data/Maps/*_map.js`): define tile collisions, background/upper layers, starting positions and BGM.

---
## NPCs
- **NPC Scripts** (`Data/NPC_Scripts/*.js`): each file creates one or more `Character` instances, sets their sprites, positions, and interaction callbacks with dialog and game events (e.g. triggering battles, granting attacks).

---
## Attacks

Attack definitions in `Data/Attacks_Scripts/` all follow the same pattern:

```js
const atkSpriteInfo_<Name> = { /* sprite metadata */ };

const atk<Name> = new Attack({
  name: '<Name>',
  type: 'physical' | 'magic' | 'status',
  damage: <number>,
  effectCbk: <moveFunction>,
  animationCbk: function({ attacker, target, targetBarId, onComplete }) {
      const tl = gsap.timeline({ onComplete });
      // animation + audio + text + effects
  }
});
```
---

## Basic loop

- **Game loop**: `animateMain` for overworld; `animateBattle` for battles.
- **Encounter triggers**: overlaps in grass (`BATTLE_TRIGGER_AREA`) start battles, either random or scripted.
- **Dialog & interaction**: NPCs rotate toward player and call `showDialog` with callback logic.
- **Audio transitions**: map BGM stops and battle music fades when appropriate.
- **Saving/loading**: exported JSON stores essential state (map, HP, direction, map offset).

---

## Saving & Loading

Handled in `menu.js` via `saveStateBtn` and in `intro.js` via file input.  
The structure is defined in `Data/saves.js` (`saveStruct`), and loading populates global variables.

---

## Notes

- All assets referenced using relative paths (e.g. `"./Assets/Player/…"`).
- GSAP is used extensively for animations; Howler for sound.
- No module bundler; scripts are loaded in order via `<script>` tags or `scriptLoader.js`.
- The game is single‑page and runs purely in the browser.

---
