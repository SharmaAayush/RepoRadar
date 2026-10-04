import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/Auth/AuthProvider.tsx'
import { RouterProvider } from 'react-router'
import { router } from './router/router.tsx'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/query.client.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
