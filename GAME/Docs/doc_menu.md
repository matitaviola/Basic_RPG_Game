# Documentation: menu.js
Main menu logic, options info (controls, settings, etc.), save/load implementation using File API or fallback, `resetMenu`.

---

## Menu Content (`optionsInfo`)

The `optionsInfo` constant is an array of HTML strings. Each entry corresponds to a specific menu section, mapped via the `data-index` attribute of the menu buttons.

| Index | Section | Content Description |
| :--- | :--- | :--- |
| `0` | **Controls** | Instructions for movement (WASD/Arrows), interaction (Space), and battle (Mouse). |
| `1` | **Settings** | UI sliders for adjusting `musicVolume` and `sfxVolume`. |
| `2` | **Info** | A brief dedication message for the project. |
| `3` | **Credits** | Attribution for concept, story, implementation, and third-party assets (Tilesets/Sprites). |
| `4` | **Saves** | Interface containing the "Save State" button to trigger the download of game data. |

---

## Navigation Logic

### `resetMenu()`
Restores the menu to its initial state.
* Resets the header text to "Select an option".
* Shows the main navigation buttons and the main Exit button.
* Hides specific option details and the "Back" button.

### Button Event Listeners
* **Category Buttons**: When a menu button is clicked, it hides the main grid and displays the `optionInfo` div. It populates the content dynamically using `optionsInfo[btn.dataset.index]`.
* **Menu Exit**: Changes the `gamestate` back to `G_S.MAP` and hides the entire menu overlay.
* **Menu Back**: Calls `resetMenu()` to return to the primary list of categories.

---

## Settings & Volume Control
The settings menu utilizes inline `oninput` attributes to call global functions:
* **`setMusicVolume(value)`**: Updates the volume of background music.
* **`setSFXVolume(value)`**: Updates the volume of sound effects.

The sliders are initialized using `${musicVolume}` and `${sfxVolume}` template literals to reflect current levels when the menu is opened.

---

## Save System

The script implements a robust saving mechanism via a click listener on the `#saveStateBtn` (handled through event delegation on the `#optionInfo` container).

### `storeSaveData()`
This function (defined externally, in the 'save.js' fiòle) is called to collect the current game variables (player position, inventory, flags) into a JSON-serializable object.

### File Generation & Download
The system attempts to use the modern **File System Access API** for a native "Save As" experience:
1. **`showSaveFilePicker`**: Opens a native OS dialog allowing the user to name the file (defaults to `MarikaSaveFile_YYYY-MM-DD.json`).
2. **Fallback Logic**: If the browser (like Firefox) does not support the File System Access API, it creates a temporary `Blob` and a hidden `<a>` element to force a browser download.

---

## Required HTML Structure
For this script to function, the DOM must contain:
* A container with class `.main-menu` and an `h2` for titles.
* A container `.menu-buttons` holding buttons with `data-index="0"` through `4`.
* An element with ID `optionInfo` to inject the content.
* Elements with IDs `menuExit`, `menuBack`, and (dynamically) `saveStateBtn`.