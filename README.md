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

## Stories Included

### Main Storyline (Episodes 1-11)
1. **The Final Laugh** - The Jester's signature chaos
2. **The Jester's Gate** - Medieval mayhem and reality bending
3. **La Divina Commedia** - Sacred comedy and holy roasts
4. **Eclipsing Elation** - Out-fooling the Masked Fools
5. **After Being Hit by Truck-Kun...** - Isekai parody and RPG breaking
6. **The Jester Discovers TikTok** - Digital chaos and viral madness
7. **The Jester Takes a Day Off** - The universe without chaos
8. **The Jester vs. The Shipping Fandom** - AO3 apocalypse
9. **The Jester Gets a Therapist** - Psychology meets chaos
10. **Et Tu, Jester?** - Roman comedy and empire building
11. **White Flower Origin** - The culmination story

### Extended Stories (Episodes 12-15)
12. **Between the Lines** - Dimensional observer's story
13. **The Silent Garden** - Consensual chaos and silent gardens
14. **The Editor's Last Stand** - Narrative control vs. creative freedom
15. **The Archivist's Collection** - Hidden depths of unused endings

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

### The Four Paths

**🔍 The Watcher's Path**
- Follow the mysterious observer watching from between dimensions
- Explore interdimensional mysteries and reality bridges
- Tags: Observer, Dimensional, Mystery

**🤫 The Mime's Silence** 
- Delve into the world of consensual chaos and invitation
- Learn the art of silence as a creative force
- Tags: Mime, Silence, Consent

**✏️ The Editor's Rebellion**
- Witness the battle between narrative control and creative freedom
- See what happens when stories fight back against editing
- Tags: Editor, Control, Rebellion

**📚 The Archivist's Secret**
- Discover the hidden depths of the Museum of Unused Endings
- Uncover the keys to reality itself
- Tags: Archivist, Museum, Secrets

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