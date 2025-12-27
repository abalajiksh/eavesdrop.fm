<img src="https://eavesdrop.fm/list-music-solid.svg" align="right" width="150" />

# eavesdrop.fm

> Submit your Plex music listening data to ListenBrainz

## What is it?

Born out of a desire to contribute listening data to the ListenBrainz project, eavesdrop.fm is a web service that takes Plex webhook payloads and submits them to ListenBrainz via the ListenBrainz API.

## How do I use it?

Head to [eavesdrop.fm](https://eavesdrop.fm) and follow the step-by-step guide to get started.

## About This Fork

This is a modernized fork of [aubrey-wodonga/eavesdrop.fm](https://github.com/aubrey-wodonga/eavesdrop.fm) with significant updates to dependencies and infrastructure.

### Major Changes from Original

#### 🚀 Framework & Build System Upgrades
- **SvelteKit 1.x → 2.x**: Complete migration to SvelteKit 2 with breaking API changes
- **Svelte 3.x → 4.x**: Updated to Svelte 4 for better performance and developer experience
- **TypeScript 4.x → 5.x**: Modern TypeScript with new module resolution and features
- **Vite 4.x → 5.x**: Latest build tooling for faster development builds

#### 📦 Dependency Updates
- **svelte-preprocess 4.x → 5.x**: Required for TypeScript 5 compatibility
- **svelte-check 2.x → 3.x**: Updated type checking for Svelte 4
- **@sveltejs/adapter-cloudflare 2.x → 4.x**: Latest Cloudflare Pages adapter

#### 🏗️ Infrastructure Changes
- **Netlify → Cloudflare Pages**: Migrated deployment platform for better performance and global edge network
- **Bun 1.3.5**: Added modern JavaScript runtime as package manager
- **Wrangler 4.x**: Cloudflare Workers tooling for local development and deployment

#### 🔧 Code Modernization

**Routing & File Structure:**
- HTTP handlers moved from `+page.server.ts` to `+server.ts` (SvelteKit 2 requirement)
- Import paths updated: `$app/env` → `$app/environment`
- Return types changed from objects to `Response` instances

**Preprocessor Configuration:**
```javascript
// Old (svelte-preprocess v4)
preprocess: preprocess({ scss: {...} })

// New (svelte-preprocess v5 with explicit TypeScript)
preprocess: preprocess({
  scss: { prependData: '@use "src/variables.scss" as *;' },
  typescript: true
})
```

**TypeScript Configuration:**
- Module resolution: `node` → `bundler`
- Added `verbatimModuleSyntax` for better ESM compatibility
- Strict mode enabled with modern compiler options

### Migration Commits

Key commits in the migration process:
1. Updated all dependencies to latest compatible versions
2. Fixed svelte-preprocess compatibility with TypeScript 5
3. Migrated POST handler from `+page.server.ts` to `+server.ts`
4. Updated `$app/env` imports to `$app/environment`
5. Configured Cloudflare Pages adapter and deployment

## Developing

### Prerequisites

- **Node.js 18+** or **Bun 1.3.5+**
- This project uses Bun as the package manager (see `packageManager` field in `package.json`)

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/abalajiksh/eavesdrop.fm.git
   cd eavesdrop.fm
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Run the development server
   ```bash
   bun run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
bun run build
```

The build output will be optimized for Cloudflare Pages deployment.

### Local Preview

```bash
bun run preview
```

## Features

eavesdrop.fm is built with [SvelteKit](https://kit.svelte.dev/) and consists of two primary user-facing features:

1. **Front-end**: Generates the unique webhook URL (found in `src/routes/+page.svelte`)
2. **Webhook Listener**: Implemented as a [SvelteKit server endpoint](https://kit.svelte.dev/docs/routing#server) (found in `src/routes/+server.ts`)

### Tech Stack

- **Framework**: SvelteKit 2.x
- **UI Library**: Svelte 4.x
- **Language**: TypeScript 5.x
- **Styling**: SCSS with custom variables
- **Build Tool**: Vite 5.x
- **Deployment**: Cloudflare Pages
- **Package Manager**: Bun 1.3.5

## Deployment

This project is configured for deployment on Cloudflare Pages:

- **Build Command**: `bun run build`
- **Build Output Directory**: `.svelte-kit/cloudflare`
- **Node Version**: 18+

The Cloudflare adapter handles:
- Edge runtime optimization
- Environment variable injection
- Request/response handling
- Global CDN distribution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See the original repository for license information.

## Credits

- Original project by [aubrey-wodonga](https://github.com/aubrey-wodonga)
- Modernization and migration by [abalajiksh](https://github.com/abalajiksh)
- Built with [SvelteKit](https://kit.svelte.dev/)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)
