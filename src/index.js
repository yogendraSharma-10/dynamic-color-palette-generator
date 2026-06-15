import { generateRandomHexColor, copyToClipboard } from './utils/colorUtils.js';
import { PALETTE_SIZE, API_BASE_URL } from './config.js';

// --- DOM Elements ---
const paletteContainer = document.getElementById('palette-container');
const generateButton = document.getElementById('generate-button');

// --- State Management ---
/**
 * @typedef {Object} ColorState
 * @property {string} hex - The hexadecimal color code (e.g., "#RRGGBB").
 * @property {boolean} locked - True if the color is locked and should not change on regeneration.
 */

/**
 * The current array of colors in the palette, including their lock status.
 * @type {ColorState[]}
 */
let currentPalette = [];

// --- Utility Functions (Internal) ---

/**
 * Displays a temporary "Copied!" message next to the target element.
 * @param {HTMLElement} targetElement - The element near which to display the feedback.
 */
function showCopyFeedback(targetElement) {
    const feedbackSpan = document.createElement('span');
    feedbackSpan.textContent = 'Copied!';
    feedbackSpan.className = 'copy-feedback'; // Assumes .copy-feedback styling in style.css
    targetElement.appendChild(feedbackSpan);

    // Remove the feedback message after a short delay
    setTimeout(() => {
        feedbackSpan.remove();
    }, 1500);
}

// --- Core Application Logic ---

/**
 * Generates a new color palette. If `currentPalette` is empty, it initializes
 * a full palette. Otherwise, it regenerates only the unlocked colors.
 */
function generatePalette() {
    if (currentPalette.length === 0) {
        // Initial generation: create PALETTE_SIZE new, unlocked colors
        for (let i = 0; i < PALETTE_SIZE; i++) {
            currentPalette.push({
                hex: generateRandomHexColor(),
                locked: false
            });
        }
    } else {
        // Regenerate only unlocked colors from the existing palette
        currentPalette = currentPalette.map(color => {
            if (color.locked) {
                return color; // Keep locked colors as they are
            } else {
                return {
                    hex: generateRandomHexColor(),
                    locked: false // New colors are unlocked by default
                };
            }
        });
    }
    renderPalette(); // Update the UI to reflect the new palette
}

/**
 * Renders the current `currentPalette` state to the DOM.
 * Clears existing color cards and creates new ones based on the state.
 */
function renderPalette() {
    paletteContainer.innerHTML = ''; // Clear previous palette cards

    currentPalette.forEach((color, index) => {
        const colorCard = document.createElement('div');
        colorCard.className = 'color-card';
        colorCard.style.backgroundColor = color.hex;
        colorCard.dataset.index = index; // Store index for event delegation

        // Hex code display
        const hexCodeDisplay = document.createElement('span');
        hexCodeDisplay.className = 'hex-code';
        hexCodeDisplay.textContent = color.hex;
        hexCodeDisplay.title = 'Click to copy';

        // Lock/Unlock button
        const lockButton = document.createElement('button');
        lockButton.className = `lock-button ${color.locked ? 'locked' : ''}`;
        // Uses Font Awesome icons (assumes Font Awesome is linked in index.html)
        lockButton.innerHTML = `<i class="fas ${color.locked ? 'fa-lock' : 'fa-lock-open'}"></i>`;
        lockButton.title = color.locked ? 'Unlock color' : 'Lock color';

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        // Uses Font Awesome icons
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy hex code';

        // Append elements to the color card
        colorCard.appendChild(hexCodeDisplay);
        colorCard.appendChild(lockButton);
        colorCard.appendChild(copyButton);

        // Append the color card to the main palette container
        paletteContainer.appendChild(colorCard);
    });
}

/**
 * Toggles the lock status of a color at a specific index in the palette.
 * @param {number} index - The index of the color in the `currentPalette` array.
 */
function toggleLock(index) {
    if (index >= 0 && index < currentPalette.length) {
        currentPalette[index].locked = !currentPalette[index].locked;
        renderPalette(); // Re-render to update the lock icon and state visually
    }
}

/**
 * Handles copying a hex code to the clipboard and provides user feedback.
 * @param {string} hexCode - The hex code string to copy.
 * @param {HTMLElement} targetElement - The DOM element that triggered the copy action,
 *                                       used for positioning feedback.
 */
async function handleCopyHexCode(hexCode, targetElement) {
    try {
        await copyToClipboard(hexCode);
        showCopyFeedback(targetElement);
    } catch (error) {
        console.error('Failed to copy hex code:', error);
        // In a production app, consider showing a user-friendly error message
        alert('Failed to copy color. Please try again or copy manually.');
    }
}

// --- Event Listeners ---

// Event listener for the main "Generate Palette" button
generateButton.addEventListener('click', generatePalette);

// Keyboard shortcut: Pressing spacebar generates a new palette
document.addEventListener('keydown', (event) => {
    // Check if the spacebar was pressed and not held down (to prevent rapid generation)
    if (event.code === 'Space' && !event.repeat) {
        event.preventDefault(); // Prevent default browser behavior (e.g., scrolling)
        generatePalette();
    }
});

// Event delegation for lock and copy actions on color cards
// This is more efficient than attaching listeners to each individual button.
paletteContainer.addEventListener('click', (event) => {
    const target = event.target;
    // Find the closest parent .color-card to determine which color was clicked
    const colorCard = target.closest('.color-card');

    if (!colorCard) {
        return; // Click was not inside a color card
    }

    // Get the index of the color from the dataset attribute
    const index = parseInt(colorCard.dataset.index, 10);

    //