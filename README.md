# Chaos Lore - Stories of the Unbound

An immersive story reading experience featuring tales of a character who treats reality as a mere suggestion and finds entertainment in the impossible.

## Features

- **Full-Screen Episodes**: Each story takes up the entire viewport for maximum immersion
- **Smooth Horizontal Scrolling**: Mouse wheel scrolling with smooth snapping between episodes
- **Extended Narrative**: Multiple story paths continue after the main storyline
- **Dark Theme**: Modern dark interface with chaotic color splashes
- **Markdown Support**: Rich text formatting for engaging storytelling
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Navigation**: Use arrow keys to navigate between episodes
- **Episode Indicators**: Visual dots for direct navigation



## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Markdown** for story rendering
- **Lucide React** for icons

## Branching Narrative System

After completing Episode 11 "White Flower Origin", the story branches into four distinct paths:

### How It Works
- **Main Story**: Episodes 1-11 follow the linear narrative
- **Branch Point**: After Episode 11, navigate right to access the branch selection screen
- **Four Paths**: Choose from different narrative directions, each exploring unique aspects of the Jester universe
- **Separate Experiences**: Each branch contains its own series of stories with independent navigation


### Navigation
- **Main Story**: Use arrow keys, mouse wheel, or navigation dots
- **Accessing Branches**: After Episode 11, scroll/swipe right or use the purple branch indicator dot
- **Branch Selection**: Click/tap a path to enter, scroll left or press ← or Esc to return to main story  
- **Branch Stories**: Full horizontal scrolling with mouse wheel/swipe, scroll left at beginning to return to selection
- **Visual Indicators**: Episode 11 shows "BRANCHES AHEAD", purple dots indicate branching, animated branch dot in navigation
- **Keyboard Shortcuts**: Arrow keys work throughout, Esc returns to previous screen
- **Mobile**: Full swipe gesture support on all screens

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### GitHub Pages (Automatic)

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://[username].github.io/chaos-lore-reader`

### Manual Deployment

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

## Configuration

Update the `homepage` field in `package.json` and the `base` field in `vite.config.ts` to match your repository name:

```json
"homepage": "https://[YOUR_USERNAME].github.io/[YOUR_REPO_NAME]"
```

```typescript
base: '/[YOUR_REPO_NAME]/'
```

## License

MIT License - Feel free to use this for your own story collections!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your stories to `src/data/stories.ts`
4. Submit a pull request

---

*Experience the chaos. Embrace the impossible.*

This file has been created using AI tools
