# Contributing to AutoPlayUr

Thank you for your interest in contributing to AutoPlayUr! We want to make it as easy as possible to add new features or improvements.

## Development Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/MatissesProjects/AutoPlayUr.git
    cd AutoPlayUr
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start development mode**:
    This will watch for changes and rebuild the extension automatically:
    ```bash
    npm run watch
    ```

4.  **Load the extension**:
    - Open Chrome and go to `chrome://extensions/`.
    - Enable **Developer mode**.
    - Click **Load unpacked** and select the `dist` folder.

## Project Structure

- `src/content.ts`: The entry point that initializes UI and automation.
- `src/actions.ts`: Contains the game automation logic. **Add new heuristics here!**
- `src/ui.ts`: Handles the floating control panel.
- `src/storage.ts`: Wrapper for `chrome.storage.local`.
- `src/constants.ts`: Shared enums and settings.

## Adding New Heuristics

To add a new automation (e.g., "Always prioritize Rosettes"), open `src/actions.ts` and:
1.  Create a new method like `tryPrioritizeRosette(): boolean`.
2.  Call it within `tryAutoActions()` before or after the existing checks.

## Code Style

We use Prettier for consistent formatting. Please run it before submitting a PR:
```bash
npm run format
```

---

Happy coding! ♟️
