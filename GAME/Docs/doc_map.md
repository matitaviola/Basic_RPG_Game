# Map System Documentation (`map.js`)

This documentation covers the logic and structure of the map management system, which handles dynamic map loading, coordinate repositioning, collision detection, and scene transitions.

---

## Core Logic: "The Moving World"
The engine utilizes a **relative movement** system. Instead of moving the player sprite across the screen, the player remains centered while the **map and all its associated objects** move in the opposite direction of the player's input.

* **`moveWithMapObjs`**: An array containing every object that must shift (Base layer, Upper layer, Collision blocks, and Warps) to maintain the illusion of movement.
* **`drawObjs`**: An array defining the render order to handle Z-indexing (Base $\rightarrow$ Player $\rightarrow$ Upper).

---

## Map Data Structure
Every map file (located in `./Data/Maps/NAME_map.js`) must define a constant named `NAME_map` with the following structure:

```js
The map files should be stored in the /Maps folder.
The data file should be named NAME_map, where NAME is the string put as an entry of the 'maps' const of this file.
The pre-warp function must return a gsap timeline.
The warp's dest-rep are the (col, row) coordinates of TILED's "landing" tile, multiplied by -TILE_WIDTH/HEIGHT
The data file should follow this struct:
cons NAME_map = {
	starting_point_x, //default starting point x
	starting_point_y, //default starting point y
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
	collisions: [...],
	warps:[
			//{position:, width:, height:, destMapid:, destRepos:, preWarpCbk:function(){...}, postWarpCbk:function(){...}}
			...
		]
} 
```
---

## Function Reference

### Map Loading & Initialization
* **`changeMap(mapId, mapRepositioning, loadedCbk)`**: Checks the `maps` cache for the requested ID. If missing, it dynamically loads the script via `loadScript`, evaluates the map object, and triggers `freshMap`.
* **`freshMap(mapId, mapRepositioning)`**: Resets coordinates to `starting_point` values, clears and repopulates the object arrays (`moveWithMapObjs`, `drawObjs`), and handles the delta shift if the player is arriving from a specific warp.
* **`mapFromSave(mapId, deltaPos)`**: Specifically for loading game states. It calculates the `recompPos` by adding the saved delta to the map's default starting points.

### Physics & Geometry
* **`createCollisions(map)`**: Parses the 1D collision array into a 2D grid based on map width and instantiates `Collision` objects at specific `(x, y)` coordinates.
* **`loadWarps(map)`**: Iterates through the map's warp data and creates `Warp` instances, scaling tile coordinates by `TILE_WIDTH` and `TILE_HEIGHT`.

### Movement & Input
* **`movePos()`**: The primary movement logic. It performs three checks in order:
    1.  **Warp Check**: If a warp collision is detected, movement stops and the warp function triggers.
    2.  **Collision Check**: If a solid block is hit, `moveEn` (move enable) is set to false.
    3.  **Transformation**: If clear, it increments/decrements the `position` of all objects in `moveWithMapObjs` by `MOVEMENT_PIXELS`.

---

## The Global State (`globals.js`)
The following variables track the live state of the map system:

* **`currentMap`**: The currently active map object.
* **`maps`**: A `Map()` object used to cache previously loaded map data.
* **`mapMovedPos`**: An `{x, y}` object tracking the total distance shifted from the map's origin.
* **`playerDirection`**: A string (`'up'`, `'down'`, etc.) used to determine sprite animations.

---

## Game Loop Integration
The `animateMain` function manages the state-based logic:
* **`G_S.MAP`**: Standard gameplay; allows `movePos()` and NPC interaction.
* **`G_S.DIALOG`**: Suspends movement; allows `advanceDialog()` via the Space key.
* **`G_S.BATTLE`**: Suspends map logic entirely.
* **`G_S.END`**: Triggers the `goodEndingScene` GSAP sequence.

---

## Implementation Notes
> [!IMPORTANT]
> When defining coordinates in Tiled for the `warps` array, use the **Tile Column/Row** index. The engine automatically handles the pixel conversion:
> `position: {x: col * TILE_WIDTH, y: row * TILE_HEIGHT}`