# AutoPlayUr

AutoPlayUr is a Chrome Extension designed to automate and enhance your experience on [royalur.net](https://royalur.net/), the home of the Royal Game of Ur.

## Features

- **Auto Roll Dice**: Automatically rolls the dice as soon as it's your turn.
- **Auto Play (Single Move)**: Automatically makes a move when only one valid move is available, speeding up gameplay.
- **Settings Persistence**: Remembers your preferred rules and bot difficulty across sessions using Chrome storage.
- **Quick Game Launcher**: A persistent UI panel that allows you to quickly switch between different rules and bot difficulties.
  - **Rules**: Finkel, Masters, Blitz, Custom.
  - **Bots**: Easy, Medium, Hard, Panda.

## Installation

Since this extension is in development, you can install it manually:

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```
5. Open Chrome and navigate to `chrome://extensions/`.
5. Enable **Developer mode** (toggle in the top right).
6. Click **Load unpacked** and select the **`dist`** directory within the project folder.

## Usage

1. Navigate to [royalur.net](https://royalur.net/).
2. You will see a small panel at the bottom-left corner of the screen.
3. Select your desired rules and bot level, then click **Start Game**.
4. The extension will automatically handle dice rolling and single-choice moves during the game.

## Tech Stack

- **TypeScript**: Typed JavaScript for better development experience.
- **Manifest V3**: Using the latest Chrome Extension standards.
- **Vanilla DOM API**: Lightweight and efficient content scripts.
- **CSS-in-JS**: Dynamic UI injection for the control panel.

## Development

The extension works by polling the DOM for specific game states (like rollable dice or single playable pieces) every 200ms. It includes a small cooldown between actions to ensure stability and compatibility with the site's animations.

---

*Note: This tool is intended for use against bots and for personal gameplay enhancement. Please use responsibly.*
