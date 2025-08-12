# Chaos Lore - Stories of the Unbound

An immersive story reading experience featuring tales of a character who treats reality as a mere suggestion and finds entertainment in the impossible.

## Features

- **Full-Screen Episodes**: Each story takes up the entire viewport for maximum immersion
- **Smooth Horizontal Scrolling**: Mouse wheel scrolling with smooth snapping between episodes
- **Dark Theme**: Modern dark interface with chaotic color splashes
- **Markdown Support**: Rich text formatting for engaging storytelling
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Navigation**: Use arrow keys to navigate between episodes
- **Episode Indicators**: Visual dots for direct navigation

## Stories Included

1. **The Day Reality Broke** - When physics becomes optional
2. **Temporal Mischief** - Time travel chaos at a birthday party  
3. **The Emotion Thief** - Borrowing feelings from others
4. **The Library of Unwritten Books** - Stories that were never written
5. **The Color Collector** - Creating impossible new colors

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Markdown** for story rendering
- **Lucide React** for icons

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