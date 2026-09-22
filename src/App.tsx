import type { Repo } from './types/repo'
import SearchBar from './components/SearchBar'
import RepoCard from './components/RepoCard'
import Layout from './components/Layout';


const repoCards: Repo[] = [
  {
    id: 10270250,
    full_name: "facebook/react",
    description: "The library for web and native user interfaces.",
    stargazers_count: 232000,
    forks_count: 48000,
    language: "JavaScript",
    language_color_class: "bg-yellow-400",
    // TODO Phase 8: replace with Zustand store action
    onFavorite(id) {
      console.log('favorite clicked:', id)
    },
  },
  {
    id: 24195339,
    full_name: "angular/angular",
    description: "Deliver web apps with confidence. The modern web developer's platform.",
    stargazers_count: 98000,
    forks_count: 25000,
    language: "TypeScript",
    language_color_class: "bg-sky-500",
    // TODO Phase 8: replace with Zustand store action
    onFavorite(id) {
      console.log('favorite clicked:', id)
    },
  },
  {
    id: 11730342,
    full_name: "vuejs/vue",
    description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    stargazers_count: 108000,
    forks_count: 36000,
    language: "TypeScript",
    language_color_class: "bg-sky-500",
    // TODO Phase 8: replace with Zustand store action
    onFavorite(id) {
      console.log('favorite clicked:', id)
    },
  },
];

function App() {
  return (
    <Layout>
        <SearchBar />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {repoCards.map((repo) => (
            <RepoCard key={repo.id} {...repo} />
          ))}
        </div>
    </Layout>
  )
}

export default App
