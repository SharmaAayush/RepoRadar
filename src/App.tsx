import type { Repo } from './types/repo'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import RepoCard from './components/RepoCard'


const repoCards: Repo[] = [
  {
    id: 10270250,
    full_name: "facebook/react",
    description: "The library for web and native user interfaces.",
    stargazers_count: 232000,
    forks_count: 48000,
    language: "JavaScript",
    language_color_class: "bg-yellow-400",
  },
  {
    id: 24195339,
    full_name: "angular/angular",
    description: "Deliver web apps with confidence. The modern web developer's platform.",
    stargazers_count: 98000,
    forks_count: 25000,
    language: "TypeScript",
    language_color_class: "bg-sky-500",
  },
  {
    id: 11730342,
    full_name: "vuejs/vue",
    description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    stargazers_count: 108000,
    forks_count: 36000,
    language: "TypeScript",
    language_color_class: "bg-sky-500",
  },
];

function App() {

  return (
    <div className='min-w-screen flex flex-col min-h-screen'>
      <Header />
      <main className='w-full max-w-6xl mx-auto p-6 space-y-6'>
        <SearchBar />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {repoCards.map((repo) => (
            <RepoCard key={repo.id} {...repo} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
