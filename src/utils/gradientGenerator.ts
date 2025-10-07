// Predefined color palettes that work well together
const colorPalettes = [
    // Warm palettes
    ['#ef4444', '#f97316'], // red to orange
    ['#f97316', '#eab308'], // orange to yellow
    ['#eab308', '#84cc16'], // yellow to lime
    ['#ef4444', '#ec4899'], // red to pink
    ['#ec4899', '#a855f7'], // pink to purple

    // Cool palettes
    ['#06b6d4', '#3b82f6'], // cyan to blue
    ['#3b82f6', '#6366f1'], // blue to indigo
    ['#6366f1', '#8b5cf6'], // indigo to violet
    ['#8b5cf6', '#a855f7'], // violet to purple
    ['#10b981', '#06b6d4'], // emerald to cyan

    // Mixed palettes
    ['#ef4444', '#8b5cf6'], // red to violet
    ['#f97316', '#06b6d4'], // orange to cyan
    ['#eab308', '#3b82f6'], // yellow to blue
    ['#84cc16', '#ec4899'], // lime to pink
    ['#10b981', '#a855f7'], // emerald to purple

    // Dark/mysterious palettes
    ['#7c3aed', '#1e1b4b'], // violet to dark blue
    ['#dc2626', '#7f1d1d'], // red to dark red
    ['#059669', '#064e3b'], // emerald to dark green
    ['#0891b2', '#164e63'], // cyan to dark cyan
    ['#9333ea', '#581c87'], // purple to dark purple

    // Chaotic/vibrant palettes
    ['#ff0080', '#00ff80'], // magenta to bright green
    ['#ff8000', '#8000ff'], // orange to purple
    ['#00ffff', '#ff00ff'], // cyan to magenta
    ['#ffff00', '#ff0040'], // yellow to red-pink
    ['#40ff00', '#0040ff'], // lime to blue
];

// Gradient directions for variety
const gradientDirections = [
    'to-r',      // left to right
    'to-l',      // right to left
    'to-t',      // bottom to top
    'to-b',      // top to bottom
    'to-tr',     // bottom-left to top-right
    'to-tl',     // bottom-right to top-left
    'to-br',     // top-left to bottom-right
    'to-bl',     // top-right to bottom-left
];

/**
 * Generates a deterministic random gradient based on a seed string
 * This ensures the same story always gets the same gradient
 */
export function generateGradient(seed: string): string {
    // Simple hash function to convert string to number
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Make hash positive
    hash = Math.abs(hash);

    // Select palette and direction based on hash
    const paletteIndex = hash % colorPalettes.length;
    const directionIndex = Math.floor(hash / colorPalettes.length) % gradientDirections.length;

    const palette = colorPalettes[paletteIndex];
    const direction = gradientDirections[directionIndex];

    // For some variety, occasionally use 3 colors instead of 2
    const useThreeColors = (hash % 7) === 0; // ~14% chance

    if (useThreeColors && palette.length >= 2) {
        // Add a third color by blending or picking from another palette
        const secondPaletteIndex = (paletteIndex + 1) % colorPalettes.length;
        const thirdColor = colorPalettes[secondPaletteIndex][0];
        return `from-[${palette[0]}] via-[${palette[1]}] ${direction} to-[${thirdColor}]`;
    }

    return `from-[${palette[0]}] ${direction} to-[${palette[1]}]`;
}

/**
 * Generates CSS linear-gradient directly
 * More reliable than parsing Tailwind classes
 */
export function generateGradientCSS(seed: string): string {
    // Improved hash function with better distribution
    let hash = 0;
    if (seed.length === 0) return 'linear-gradient(to right, #ef4444, #f97316)';

    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Add additional mixing to improve distribution
    hash = hash ^ (hash >>> 16);
    hash = Math.imul(hash, 0x85ebca6b);
    hash = hash ^ (hash >>> 13);
    hash = Math.imul(hash, 0xc2b2ae35);
    hash = hash ^ (hash >>> 16);

    // Make hash positive
    hash = Math.abs(hash);



    // Select palette and direction based on hash
    const paletteIndex = hash % colorPalettes.length;
    const directionIndex = Math.floor(hash / colorPalettes.length) % gradientDirections.length;

    const palette = colorPalettes[paletteIndex];
    const direction = gradientDirections[directionIndex];



    // Convert direction to CSS (order matters - longer strings first)
    const cssDirection = direction
        .replace('to-tr', 'to top right')
        .replace('to-tl', 'to top left')
        .replace('to-br', 'to bottom right')
        .replace('to-bl', 'to bottom left')
        .replace('to-r', 'to right')
        .replace('to-l', 'to left')
        .replace('to-t', 'to top')
        .replace('to-b', 'to bottom');

    // For some variety, occasionally use 3 colors instead of 2
    const useThreeColors = (hash % 7) === 0; // ~14% chance

    let result;
    if (useThreeColors && palette.length >= 2) {
        // Add a third color by blending or picking from another palette
        const secondPaletteIndex = (paletteIndex + 1) % colorPalettes.length;
        const thirdColor = colorPalettes[secondPaletteIndex][0];
        result = `linear-gradient(${cssDirection}, ${palette[0]}, ${palette[1]}, ${thirdColor})`;
    } else {
        result = `linear-gradient(${cssDirection}, ${palette[0]}, ${palette[1]})`;
    }

    return result;
}

/**
 * Get a lighter version of the gradient for subtle effects
 */
export function generateLightGradient(seed: string): string {
    const baseGradient = generateGradient(seed);
    // Add opacity to make it lighter
    return baseGradient.replace(/from-\[([^\]]+)\]/, 'from-[$1]/20')
        .replace(/via-\[([^\]]+)\]/, 'via-[$1]/20')
        .replace(/to-\[([^\]]+)\]/, 'to-[$1]/20');
}

/**
 * Preview function to see what gradient a story would get
 */
export function previewGradient(storyTitle: string): void {
    console.log(`Story: "${storyTitle}"`);
    console.log(`Gradient: bg-gradient-${generateGradient(storyTitle)}`);
    console.log(`CSS: ${generateGradientCSS(storyTitle)}`);
    console.log('---');
}