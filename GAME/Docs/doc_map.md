# Documentation: maps.js Logic & Map Structure
Responsible for overworld logic:
- Map definitions (`maps` constant, each imported from `Data/Maps`)
- `changeMap` to switch zones
- `createCollisions` to generate collisions from numeric arrays
- Movement (`movePos`), main animation loop (`animateMain`)
- Special scenes (such as the presented `goodEndingScene`). At the moment they're kept here, but will me moved to a simple standalone script

---

## Map Data Configuration
All map data must be stored in `/Data/Maps/`. Each map requires an external JavaScript file named `NAME_map.js` (where `NAME` is the identifier).

### Map Object Structure
A map in the Data/Maps folder must be defined as folows:
```js
The map files should be stored in the /Maps folder.
The data file should be named NAME_map, where NAME is the string put as an entry of the 'maps' const of this file.
The data file should follow this struct:
cons NAME_map = {
	starting_point_x,
	starting_point_y,
	width,
	height,
	base: new Sprite({
		imageSrc: "./Assets/Maps/NAME_base.png",
		position: {x, y} //x and y must equal the position (respectively times -1*TILE_WIDTH -1*TILE_HEIGHT) of the first tile (upper-left) that has to show up on screen, not the desired player position
	}),
	upper: new Sprite({
		imageSrc: "./Assets/Maps/NAME_upper.png",
		position: {x, y}
	}),
	bgm,
	collisions: [...]
} 
```

> **Note on Positioning:** The `position` property in `Sprite` objects should be the negative offset of the starting tile: `(Tile Index * -1) * TILE_DIMENSION`.

---

## Core Functions

### `changeMap(mapId, mapRepositioning)`
Handles switching between game zones.
* **Loading**: Uses `loadScript` to fetch the new map data dynamically.
* **Initialization**: Resets the `moveWithMapObjs` and `drawObjs` arrays to ensure correct rendering order.
* **Audio**: Automatically stops current music and plays the new map's `bgm`.
* **Persistence**: If `mapRepositioning` is true, it applies the stored `mapMovedPos` to keep the player in the same relative world space.

### `createCollisions(map)`
Generates physical boundaries from the map's numeric array.
1. Clears existing `collisionBlocks`.
2. Slices the 1D `collisions` array into a 2D grid based on the map's `width`.
3. Loops through the grid and instantiates a `Collision` object for every non-zero value.

### `movePos()`
The primary movement engine.
* **Collision Prediction**: For every directional input (WASD/Arrows), the function checks if the *next* intended position overlaps with any `collisionBlocks`.
* **Relative Movement**: Instead of moving the player sprite, it moves all world objects (`moveWithMapObjs`) in the opposite direction, creating a camera-follow effect.
* **Follower Logic**: Automatically triggers position updates for `Sally` and `Nala`.

---

## Main Animation Loop (`animateMain`)
The `animateMain` function is called recursively via `requestAnimationFrame`.

1. **Rendering**: Executes the `.draw()` method for every object in `drawObjs`.
2. **State Management**:
    * **BATTLE**: Logic is paused.
    * **DIALOG**: Stops movement and listens for `Space` to advance text.
    * **MAP**: Allows movement (`movePos`) and checks for NPC interactions.
    * **END**: Triggers the `goodEndingScene`.

---

## Special Scenes
### `goodEndingScene()`
A hard-coded cinematic sequence used for the game's finale.
* Faces the player and Prince toward each other.
* Uses **GSAP** (GreenSock) to animate a heart graphic and the final anniversary message.
* Disables the animation loop upon completion.

---

## Global Dependencies
This file assumes the following are defined in the global scope:
* `TILE_WIDTH` / `TILE_HEIGHT`: Constants for grid size.
* `MOVEMENT_PIXELS`: Speed of movement.
* `G_S`: Enum for Game States (MAP, DIALOG, BATTLE, END).
* `playerSprite`: The main player object.

