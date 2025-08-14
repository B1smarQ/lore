import { generateGradient, previewGradient } from './gradientGenerator';

// Test function to preview gradients for current stories
export function testCurrentStoryGradients() {
    const storyTitles = [
        'A FIREWORK IN THE FACE OF GOD',
        'AND GOD SAID: YO MAMA SO FAT...',
        'STAR WRECK',
        'THE END OF THE WORLD'
    ];

    console.log('=== Story Gradient Preview ===');
    storyTitles.forEach(title => {
        previewGradient(title);
    });
}

// Test function to show gradient variety
export function testGradientVariety() {
    const testSeeds = [
        'Story A', 'Story B', 'Story C', 'Story D', 'Story E',
        'The Adventure Begins', 'Mystery of the Lost Key', 'Dragon\'s Tale',
        'Space Odyssey', 'Time Traveler', 'Magic Forest', 'Ocean Deep'
    ];

    console.log('=== Gradient Variety Test ===');
    testSeeds.forEach(seed => {
        console.log(`"${seed}" → bg-gradient-${generateGradient(seed)}`);
    });
}

// Test CSS generation
export function testCSSGeneration() {
    const { generateGradientCSS } = require('./gradientGenerator');

    console.log('=== CSS Gradient Test ===');
    console.log('Test Story 1:', generateGradientCSS('Test Story 1'));
    console.log('Test Story 2:', generateGradientCSS('Test Story 2'));
    console.log('Test Story 3:', generateGradientCSS('Test Story 3'));
}

// Run tests (uncomment to use)
// testCurrentStoryGradients();
// testGradientVariety();
// testCSSGeneration();