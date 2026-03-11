# scriptLoader.js

This utility script manages the dynamic injection of JavaScript files into the DOM. It enables a modular architecture without the use of ES modules or build tools (like Node.js/Webpack), keeping the HTML `index.html` file clean.
Utility to dynamically inject `<script>` tags in order.

---

## 1. Core Philosophy
The script is designed to bypass the need for a long list of `<script>` tags in the HTML head. Instead, it programmatically appends scripts to the `document.head` and uses callbacks to ensure code executes only after its dependencies have finished loading.

---

## 2. Functions

### `loadScript(src, callback)`
Loads a single JavaScript file asynchronously.
* **`src`**: The relative or absolute path to the `.js` file.
* **`callback`**: A function that executes immediately after the script has been successfully loaded and parsed.
* **Usage**: Ideal for loading situational scripts, such as map data files (`NAME_map.js`) only when the player enters a specific zone.

### `loadSequentially(sources, finalCallback)`
Loads an array of scripts in a strict, specific order.
* **`sources`**: An array of strings containing the paths to the scripts.
* **`finalCallback`**: A function that executes only after the *entire* list has been loaded.
* **Mechanism**: Uses a recursive internal `next()` function. It waits for the `onload` event of the current script before moving to the next index in the array.
* **Usage**: Essential for the initial game boot sequence, where certain classes (like `Sprite`) must exist before the main logic scripts attempt to instantiate them.

---

## 3. Implementation Example

### Loading Map Data
```js
// Example of how maps.js uses this utility
loadScript("./Data/Maps/forest_map.js", () => {
    console.log("Map data loaded, now initializing collisions...");
    createCollisions(forest_map);
});

const coreScripts = [
    "./js/classes.js",
    "./js/maps.js",
    "./js/battle.js",
    "./js/main.js"
];

loadSequentially(coreScripts, () => {
    console.log("All core systems online. Starting game loop.");
    animateMain();
});
```
---

## Pro & Con
- Pro: Modularity without a complex build environment; reduces initial page load overhead.
- Con: Scripts are appended to the document.head but not removed; repeated map changes will result in many <script> tags remaining in the DOM (though they are cached by the browser).