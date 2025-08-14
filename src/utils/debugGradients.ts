import { generateGradientCSS } from './gradientGenerator';

// Debug function to test gradient generation
export function debugGradients() {
    const testTitles = [
        'A FIREWORK IN THE FACE OF GOD',
        'AND GOD SAID: YO MAMA SO FAT...',
        'STAR WRECK',
        'THE END OF THE WORLD',
        'Test Story 1',
        'Test Story 2',
        'Different Title',
        'Another Story'
    ];

    console.log('=== Gradient Debug ===');
    testTitles.forEach((title, index) => {
        const gradient = generateGradientCSS(title);
        console.log(`${index + 1}. "${title}"`);
        console.log(`   Gradient: ${gradient}`);
        console.log('---');
    });
}

// Call this function to debug
debugGradients();