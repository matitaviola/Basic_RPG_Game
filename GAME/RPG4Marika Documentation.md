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

## Core Modules

### `globals.js`
Defines enums, constants, and global variables.
- Enums: currently the only one is the 'G_S' containing the possible gamestates
- Constants: canvas infos, map sizes/positions/movements, player and follower sprites in overworld, battle position/speed, text speed
- Variables: gamestate, keys, audioevnt, scene animation ids, map objects and curent movement, audio, battle objects and flags, attack queue, dialog queue and flags, characters list.
Among the variables there are those that handles the entities (e.g. `characters`, `enemies`, `atkSpritesToRender`).

### `classes.js`
Implements all main classes:
- [`Sprite`] base renderable object.
- [`Follower`] extends `Sprite`, to follows another sprite.
- [`Collision`] collidable object.
- [`Battler`] battle participant with HP and attack list.
- [`Attack`] defines attack metadata and callbacks (for the animation).
- [`Character`] NPC/PC entity on the map with interaction logic.

### `audio.js`
Initialises Howler audio objects (defined in 'audio') for background music and sound effects. The two arrays are kept separated for settings.

### `dialog.js`
Refer to [dialog.js docs](./Docs/doc_attacks.md)

### `map.js`
Refer to [map.js docs](./Docs/doc_map.md)

### `playerSprite.js` & `followers.js`
Defines `playerSprite` and two followers (`Sally` and `Nala`) with sprites, animations, and follow behaviour.

### `attacks.js`
Refer to [attacks.js docs](./Docs/doc_attacks.md)

### `enemies.js`
Refer to [enemies.js docs](./Docs/doc_enemies.md)

### `battle.js`
Refer to [battle.js docs](./Docs/doc_battle.md)

### `characters.js`
Loads overworld NPC scripts sequentially, registers characters for the overworld, and inserts them into `drawObjs`/`moveWithMapObjs`.
Any new character's script path must be inserted in the sourcesNPC object.
```js
const sourcesNPC = [
	...,
	"./Data/NPC_Scripts/NPCName.js"
];
```

### `menu.js`
Refer to [menu.js docs](./Docs/doc_menu.md)

### `intro.js`
Intro screen with options start game/load save state to set the initial game state.

### `saves.js`
Refer to [saves.js docs](./Docs/doc_saves.md)

### `scriptLoader.js`
Refer to [scriptLoader.js docs](./Docs/doc_scriptLoader.md).

--- 
//TODO: da qua in giù da rivedere
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
