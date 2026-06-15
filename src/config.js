/**
 * @file src/config.js
 * @description Global configuration settings for the Dynamic Color Palette Generator application.
 *              This file centralizes constants, API endpoints, and other environment-specific
 *              or application-wide settings.
 *
 *              Note: For a client-side JavaScript project without a build step (e.g., Webpack, Vite),
 *              `process.env` variables will not be automatically populated. In such cases,
 *              these values would typically be hardcoded, injected via a server-side template,
 *              or loaded from a global `window.APP_CONFIG` object.
 *              The use of `process.env` here anticipates a modern build pipeline.
 */

// --- Application Core Settings ---

/**
 * The default number of colors to display in the palette.
 * This determines how many color cards are generated initially.
 * @type {number}
 */
export const DEFAULT_PALETTE_SIZE = 5;

/**
 * The duration (in milliseconds) for which the "Copied!" feedback message is displayed
 * after a hex code is copied to the clipboard.
 * @type {number}
 */
export const COPY_FEEDBACK_DURATION_MS = 1500;

/**
 * The key used for storing locked colors in the browser's local storage.
 * This allows locked colors to persist across user sessions.
 * Prefixing with 'dcp_' (Dynamic Color Palette) helps avoid conflicts.
 * @type {string}
 */
export const LOCAL_STORAGE_KEY_LOCKED_COLORS = 'dcp_locked_colors';

// --- Cross-Project / Microservice Integration Settings ---

/**
 * Base URL for the primary backend API, if this application were to interact
 * with a dedicated backend service. This is a placeholder for future expansion
 * and demonstrates a microservice-oriented architecture.
 * Defaults to a local development API endpoint if not provided via environment variables.
 * @type {string}
 */
export const API_BASE_URL = process.env.DCP_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * URLs for other interconnected services within the larger system.
 * These are provided to simulate a microservice architecture and allow
 * for potential deep linking or API calls to these services from the palette generator.
 * Defaults to common local development ports for each service.
 * @type {Object.<string, string>}
 */
export const INTERCONNECTED_SERVICE_URLS = {
    /** URL for the HTML Canvas Drawing Board application. */
    CANVAS_DRAWING_BOARD: process.env.CANVAS_DRAWING_BOARD_URL || 'http://localhost:8081/canvas-board',
    /** URL for the Live Markdown Editor application. */
    LIVE_MARKDOWN_EDITOR: process.env.LIVE_MARKDOWN_EDITOR_URL || 'http://localhost:8082/markdown-editor',
    /** URL for the Interactive Kanban Board application. */
    INTERACTIVE_KANBAN_BOARD: process.env.KANBAN_BOARD_URL || 'http://localhost:8083/kanban-board',
};

// --- Feature Flags (Example) ---

/**
 * Feature flag to enable/disable a hypothetical "Advanced Color Picker" functionality.
 * This demonstrates how feature flags can be managed centrally, allowing features
 * to be toggled without code changes.
 * @type {boolean}
 */
export const FEATURE_ADVANCED_COLOR_PICKER = process.env.FEATURE_ADVANCED_COLOR_PICKER === 'true'; // Default to false if not explicitly 'true'

// --- Environment-specific settings ---

/**
 * Determines if the application is running in development mode.
 * This flag can be used for conditional logging, debugging features, or
 * enabling/disabling certain development-only tools.
 * In a real-world scenario with a build tool, `process.env.NODE_ENV` would be
 * automatically set (e.g., 'development' or 'production').
 * @type {boolean}
 */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Export all configurations as a single default object for convenience.
// This allows for both named imports (e.g., `import { DEFAULT_PALETTE_SIZE } from './config'`)
// and a single default import (e.g., `import config from './config'`) to access all settings.
export default {
    DEFAULT_PALETTE_SIZE,
    COPY_FEEDBACK_DURATION_MS,
    LOCAL_STORAGE_KEY_LOCKED_COLORS,
    API_BASE_URL,
    INTERCONNECTED_SERVICE_URLS,
    FEATURE_ADVANCED_COLOR_PICKER,
    IS_DEVELOPMENT,
};