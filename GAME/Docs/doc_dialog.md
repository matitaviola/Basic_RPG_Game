# Dialog System Documentation (`dialog.js`)

This module manages the in-game dialogue system, including a "typewriter" text effect, input handling for advancing text, and state management between the world map and dialogue scenes.

---

## ## Core Functionality

The system operates on a queue-based logic. When dialogue is triggered, an array of strings is processed sequentially until the queue is empty.

### 1. Initializing Dialogue
* **`showDialog(textBlocks, endCbk)`**: 
    * Changes the global `gamestate` to `G_S.DIALOG`.
    * Copies the provided array of strings into `dialogQueue`.
    * Makes the `#diagBox` element visible.
    * Stores a callback function (`endCbk`) to execute once the dialogue concludes.

### 2. The Typewriter Effect
The system renders text character-by-character to create an immersive reading experience.
* **`nextDialogBlock()`**: Prepares the container and resets the character index for the next string in the queue.
* **`typeNextChar()`**: The recursive function that appends one character at a time to the DOM.
    * **Speed**: Controlled by the global `TYPING_SPEED` constant.
    * **Visual Cue**: Shows the `diagArrow` only when the full string is rendered and more blocks remain in the queue.

### 3. Interaction & Navigation
* **`advanceDialog()`**: Triggered by clicking the `#diagBox`. It handles two scenarios:
    1.  **Skip**: If the text is currently typing, it completes the current block instantly.
    2.  **Next**: If the text is finished, it moves to the next block or closes the box if finished.

### 4. Cleanup
* **`closeDialog()`**:
    * Hides the UI elements.
    * Resets the queue and the callback.
    * Reverts the `gamestate` to `G_S.MAP`, returning control to the player.

---

## ## DOM Elements & Constants

The module interacts with the following specific HTML/CSS structures:

| Element ID | Purpose |
| :--- | :--- |
| `#diagBox` | The main dialogue container. Controlled via the `.visible` class. |
| `#diagArrow` | A visual indicator (usually a blinking arrow) indicating more text is available. Controlled via the `.hidden` class. |

### Event Listeners
* **Click Event**: The `#diagBox` listens for clicks to trigger `advanceDialog()`, allowing players to progress through the story at their own pace.

---

## ## Implementation Example

To trigger a dialogue sequence from another script:

```javascript
const storyContent = [
    "Hello there, traveler!",
    "It is dangerous to go alone.",
    "Take this... if you dare."
];

showDialog(storyContent, () => {
    console.log("Dialogue finished! Spawning item...");
    // Logic to give item to player here
});