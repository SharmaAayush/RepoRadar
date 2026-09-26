import Layout from './components/Layout';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import RepoDetailPage from './pages/RepoDetailPage';
import ComparePage from './pages/ComparePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/repo/:owner/:name' element={<RepoDetailPage />} />
        <Route path='/compare' element={<ComparePage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
