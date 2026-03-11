# save.js

This file handles the serialization and deserialization of game data. It defines the structure of a save file and manages the logic for capturing the current game state and restoring it from an external JSON file.

---

## 1. Save Structure (`saveStruct`)

The `saveStruct` object defines the template for the game's save data. This ensures consistency across different versions of the game.

| Property | Type | Description |
| :--- | :--- | :--- |
| `gameName` | `String` | Identifier for the project ("RPG4Marika"). |
| `version` | `Number` | The version of the save format to handle future updates. |
| `mapId` | `Number` | The index of the current map in the global `maps` array. |
| `mapMovedPos` | `Object` | `{x, y}` coordinates representing the world offset. |
| `playerHp` | `Number` | The current health points of the player character. |
| `playerDirection` | `String` | The last direction the player was facing ('up', 'down', 'left', 'right'). |

---

## 2. Saving Logic

### `storeSaveData()`
This function captures the live game variables and packages them into the `saveStruct`.
1. **Syncing**: Updates `saveStruct` with current values for `currMapId`, `pgBattler.currHp`, `playerDirection`, and `mapMovedPos`.
2. **Return**: Returns the populated object, which is then converted to JSON by the menu system.

---

## 3. Loading Logic

### `loadSaveFile(saveFile)`
Handles the initial reading of a physical file (usually triggered by an `<input type="file">` change event).
* **FileReader**: Uses the Web API `FileReader` to read the file as text.
* **Validation**: Attempts to `JSON.parse` the result. If successful, it passes the resulting object to `loadSaveData()`.
* **Error Handling**: Catches and logs invalid JSON errors to prevent engine crashes.

### `loadSaveData(saveData)`
The "inverse" of the saving process. It applies the values from the save file back into the running game engine.
* **Health Recovery**: Restores `pgBattler.currHp`.
* **Sprite Alignment**: Updates the `playerDirection` and immediately sets the `playerSprite.image` to the correct directional frame (Up, Down, Left, or Right).
* **Map Transition**: Calls `changeMap()` using the saved `mapId`.
* **Coordinate Restoration**: Re-applies the `mapMovedPos` to align the world precisely where the player left off.

---

## 4. Integration Details
* **Dependency**: This file relies on the `changeMap()` function and `playerSprite` object defined in `maps.js`.
* **Extensibility**: To add new progress tracking (e.g., items found, bosses defeated), new flags must be added to both the `saveStruct` and the `store/load` functions.