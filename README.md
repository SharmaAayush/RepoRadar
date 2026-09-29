# RepoRadar - GitHub Repository Explorer

RepoRadar is a modern web application built with React, TypeScript, and Vite for exploring and discovering GitHub repositories. The app allows users to search, filter, compare, and save favorite repositories.

## Features

- 🔍 **Repository Search**: Search GitHub repositories by keywords
- 🎯 **Advanced Filtering**: Filter results by language, stars, forks, and more
- ⭐ **Favorites System**: Save and manage your favorite repositories with Zustand state management
- 📊 **Repository Comparison**: Compare multiple repositories side-by-side
- 🔐 **Authentication**: Secure login system with protected routes
- 💫 **Modern UI**: Built with Tailwind CSS and Lucide icons for a clean, responsive interface
- ⚡ **Fast Performance**: Powered by Vite for instant HMR and optimized builds

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router v8
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown
- **Linting**: ESLint with TypeScript-aware rules
- **HTTP Client**: Custom GitHub API helper

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── layouts/          # Layout components
├── context/          # React Context providers
├── store/            # Zustand stores
├── loaders/          # Data loading utilities
├── helpers/          # Utility functions
├── types/            # TypeScript type definitions
├── config/           # Application configuration
├── consts/           # Constants (like language colors)
└── router/           # Route definitions
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd reporadar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## GitHub Token

To increase API rate limits (from 60 to 5,000 requests/hour), you can provide a GitHub Personal Access Token:

1. Open the app
2. Click the token input field in the header (right side)
3. Enter your GitHub Personal Access Token
4. The token is saved locally in browser storage and reused automatically

The token is only visible to you in the browser and is cleared if you remove it from the input field.

## Docker Deployment

### Build the Docker Image

```bash
docker build -t reporadar .
```

### Run the Container

```bash
docker run -p 80:80 reporadar
```

The application will be accessible at `http://localhost`

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional React components with hooks
- Maintain consistent Tailwind CSS utility class ordering
- Write meaningful commit messages

### State Management

- Use Zustand for global state (favorites)
- Use React Context for authentication state
- Keep component state local when appropriate

### API Integration

- All GitHub API calls go through `src/helpers/github.api.ts`
- Error handling is centralized
- Loading states are managed per request

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmndrs.com/)
- [Lucide Icons](https://lucide.dev/)
- [GitHub API](https://docs.github.com/en/rest)