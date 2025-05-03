# Car Price UA - Browser Extension

A browser extension that helps users analyze car prices on Ukrainian automotive marketplaces, built on top of the Auto RIA API. This extension provides valuable insights and price comparisons for car listings.

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in your browser:
   - For Chrome: Load unpacked extension from the `.output` directory
   - For Firefox: Use the Firefox-specific build with `npm run build:firefox`

## Development

- Run development server:
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  ```
- Build for Firefox:
  ```bash
  npm run build:firefox
  ```

## Extensibility

This project is designed to be easily extended to support additional automotive marketplaces. The architecture is built on top of the Auto RIA API, but can be adapted to work with other platforms by:

1. Adding new content scripts for different marketplaces
2. Implementing new API integrations
3. Extending the data models to support additional features
4. Customizing the UI components for different platforms

