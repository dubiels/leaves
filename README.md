# 🥬 Leaves

An infinite clone of [LinkedIn's Queens puzzle game](https://www.linkedin.com/games/queens/), playable as many times as you want instead of just once daily.

**Play it live:** [karolina.mgdubiel.com/leaves](https://karolina.mgdubiel.com/leaves)

## The Problem

LinkedIn Queens is fun, but artificially limited to one puzzle per day. This project removes that constraint while maintaining the elegant puzzle mechanics.

## What is Queens?

Queens is a logic puzzle based on the classic [N-Queens problem](https://en.wikipedia.org/wiki/Eight_queens_puzzle). The goal is to place exactly 8 queens (represented as 🥬 leaves) on an 8×8 board such that:

- **One queen per row**
- **One queen per column**
- **One queen per color region**
- **No two queens touch, even diagonally**

## Tech Stack

- **Next.js 15.1.0** with React 19.0.0
- **Custom N-Queens Solver** using backtracking algorithm with randomization
- **Dynamic Region Generation** creates 8 color regions around queen positions
- **Pure React State Management** (no external libraries)
- **Inline CSS Styling** with dynamic border rendering and error stripe gradients

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play locally.

## How It Works

The puzzle generation happens in two steps:

1. **Queens Solver** ([utils/queensSolver.js](utils/queensSolver.js:20-34)) – Uses a randomized backtracking algorithm to generate valid queen placements
2. **Region Generator** ([utils/queensSolver.js](utils/queensSolver.js:36-97)) – Creates 8 color regions by expanding from each queen's position, ensuring each region contains exactly one queen from the solution

The game validates moves in real-time, checking for:
- Multiple queens in the same row/column
- Multiple queens in the same color region
- Queens touching diagonally (only adjacent cells, not entire diagonal lines)

## Deployment

This project is deployed as a static export on Cloudflare Pages under the `/leaves` subdirectory of my main site.

### Building for Production

```bash
# Build static export
npm run build

# Static files will be generated in the /out directory
```

The `next.config.ts` is configured with `output: 'export'` and `basePath: '/leaves'` for subdirectory deployment.
