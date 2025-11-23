# COS30045 Data Visualisation Project

An interactive, responsive website that explores traffic enforcement data across Australian jurisdictions. The site presents multiple coordinated visualisations built with D3, including a multi-series line chart, a choropleth (map) with contextual callouts and a linked bar chart panel, plus donut views that break down police vs camera-issued fines. The experience is optimized for desktop, tablet, and mobile with accessible interactions and smooth, progressive enhancements.

## Key Features
- Multi-series line chart of annual fines, with keyboard and legend interactions, tooltips, and responsive axes
- Choropleth map with always-on callouts, focus highlighting, zoom, fullscreen toggle, and linked bar chart
- Donut breakdowns for police vs camera-issued fines with responsive labelling and tooltips
- Rich responsive layout that adapts grid, spacing, and typography across breakpoints
- Accessibility: keyboard navigation, Aria labels, live-region announcements, focus-visible rings
- Progressive enhancements: IntersectionObserver-based reveal animations, snap scrolling, reduced motion support

---

## Installation and Setup

### System Requirements
- Modern desktop or mobile browser (Chrome, Edge, Firefox, Safari) with JavaScript enabled
- Internet access for fetching the GeoJSON (state boundaries) used by the map
- A local HTTP server to serve the site (required for D3 CSV/JSON loading)

### Quick Start Options
Choose any one of the following:

- Python 3 (built-in server)
  - Navigate to the project directory and run:
    - `python -m http.server 8000`
  - Open `http://localhost:8000/index.html`

- Node.js http-server (install globally)
  - `npm install -g http-server`
  - `http-server -p 8000`
  - Open `http://localhost:8000/index.html`

- VS Code Live Server Extension
  - Right-click `index.html` → “Open with Live Server”
  - Open the provided local URL

### Configuration
- No build step is required; the site is static
- Data CSVs are read from `data/` at runtime; ensure the `data` directory is served
- GeoJSON is fetched from a public GitHub URL inside the map visualisation; internet connectivity is required

### Environment Variables
- None required. All paths are relative and set within the JavaScript files
- Optional: if you need to offline the GeoJSON, you can modify `geoUrl` in `chart/visualisation3.js` to point to a local file and serve it

---

## Usage Guide

### Run/Start
- Visit `https://data-vis-group23.vercel.app`
- Use the top navigation and the snap-scrolling sections to explore each visualisation

### Basic Usage Examples
- Line chart (Visualisation 2):
  - Select a time range and detection method
  - Click a legend item or press Enter/Space on it to highlight a series and show the tooltip for the latest year
  - Hover or tap line segments to inspect values

- Choropleth map (Visualisation 3):
  - Hover states to see the rate indicator and hover caption
  - Click a state to focus; callouts and linking arrows update emphasis
  - Use the fullscreen button to maximize the viewing area
  - Detection method filters and year selection update both the map and the linked bar chart

- Bar chart panel (Visualisation 3 – Info):
  - Switch between “Description” and “Bars” in the info panel toggle
  - Hover bars to see tooltips; click to focus and sync with the map

---

## Technical Specifications

### Architecture Overview
- Static web app served over HTTP
- Client-side rendering using D3 for all charts
- Visualisation modules are organized per chart under `chart/`
- Interaction helpers and page-level behavior under `js/`
- Responsive layout and design system defined in `css/style.css` (plus supplemental CSS files)

### Technology Stack
- D3.js (v6/v7-compatible usage patterns)
- Vanilla JavaScript (ES5/ES6)
- SVG-based visualisations (paths, scales, axes, transitions)
- CSS for layout/grid, responsive design, accessibility, and animations

### Dependencies and Third-Party Libraries
- D3.js loaded in `index.html`
- Public GeoJSON for Australian states: `https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.geojson`
- Optional: Bootstrap Icons referenced in CSS classes (ensure icons are available if used in HTML)

---

## Development Information

### Project Structure
- `index.html` — Entry point and section scaffolding
- `css/style.css` — Core responsive layout and styling for sections and visualisation grids
- `css/documentation.css`, `css/about.css` — Supplemental styles for other pages/sections
- `chart/visualisation1.js` — Visualisation 1 script
- `chart/visualisation2.js` — Multi-series line chart
- `chart/visualisation3.js` — Choropleth map and callouts logic
- `chart/visualisation3_bar.js` — Linked horizontal bar chart in info panel
- `js/interaction.js` — Shared interactions and donut rendering tied to chart selections
- `js/scroll.js`, `js/documentation.js` — Page-level enhancements and navigation behavior
- `data/` — CSV data files consumed by D3 (ensure these are served)
- `README.md` — Project documentation (this file)

### Contribution Guidelines
- Use consistent code style (existing patterns, plain JS, D3 idioms)
- Do not commit secrets; do not hardcode credentials
- Keep changes modular; follow existing naming and layout conventions
- For UI updates, preserve accessibility attributes (aria roles/labels, focus-visible)

### Testing Procedures
- Manual testing across viewport widths (≥1025px desktop, ≤1024px tablet, ≤768px mobile, ≤480px tiny)
- Verify:
  - Alignment and spacing are consistent
  - Text remains readable; typography scales at breakpoints
  - Interactive components are keyboard-accessible and properly sized
  - Charts redraw and animate cleanly on resize and filter changes

### Deployment Instructions
- Static hosting (GitHub + Vercel)

---

## License Information

© 2025 DataVis Group 23. All rights reserved.

Academic Use Only. Non-commercial use permitted for personal study and coursework referencing with proper citation. No reproduction, redistribution, or submission as original work. For other uses, please contact the authors to obtain permission.
