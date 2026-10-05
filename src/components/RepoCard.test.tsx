import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import RepoCard from './RepoCard'
import { useFavoritesStore } from '../store/favoritesStore'
import type { FavoritesStore } from '../store/favoritesStore'

// Mock the favorites store
vi.mock('../store/favoritesStore', () => ({
  useFavoritesStore: vi.fn(),
}))

// Mock the app config
vi.mock('../config/app.config', () => ({
  default: {
    MAX_REPO_FOR_COMPARISON: 4,
  },
}))

const mockRepoCardProps = {
  id: 1,
  full_name: 'facebook/react',
  description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
  language: 'TypeScript',
  forks_count: 48000,
  stargazers_count: 220000,
}

const renderRepoCard = (props = {}) => {
  return render(
    <MemoryRouter>
      <RepoCard {...mockRepoCardProps} {...props} />
    </MemoryRouter>
  )
}

describe('RepoCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useFavoritesStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isFavorite: vi.fn().mockReturnValue(false),
      toggleFavorite: vi.fn(),
    } as unknown as FavoritesStore)
  })

  it('renders repository name', () => {
    renderRepoCard()
    expect(screen.getByText('facebook/react')).toBeInTheDocument()
  })

  it('renders repository description', () => {
    renderRepoCard()
    expect(screen.getByText('A declarative, efficient, and flexible JavaScript library for building user interfaces.')).toBeInTheDocument()
  })

  it('renders language with color indicator', () => {
    renderRepoCard()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    // Check for the color dot (span with background-color style)
    const { container } = renderRepoCard()
    const colorDot = container.querySelector('span[style*="background-color"]')
    expect(colorDot).toBeInTheDocument()
  })

  it('renders star count', () => {
    renderRepoCard()
    expect(screen.getByText('220000')).toBeInTheDocument()
  })

  it('renders fork count', () => {
    renderRepoCard()
    expect(screen.getByText('48000')).toBeInTheDocument()
  })

  it('renders View on GitHub link', () => {
    renderRepoCard()
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/facebook/react')
    expect(link).toHaveAttribute('target', '__blank')
  })

  it('renders favorite button', () => {
    renderRepoCard()
    // The button has an SVG with aria-hidden, so query by the button element
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows checkbox when onSelectionChange is provided', () => {
    renderRepoCard({ onSelectionChange: vi.fn() })
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('calls onSelectionChange when checkbox is clicked', () => {
    const onSelectionChange = vi.fn()
    renderRepoCard({ onSelectionChange })

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(onSelectionChange).toHaveBeenCalledWith('facebook/react', true)
  })

  it('disables checkbox when max comparison limit is reached', () => {
    renderRepoCard({
      selected: ['repo1', 'repo2', 'repo3', 'repo4'],
      onSelectionChange: vi.fn(),
    })
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('allows checkbox when repo is already selected even at max limit', () => {
    renderRepoCard({
      selected: ['facebook/react', 'repo2', 'repo3', 'repo4'],
      onSelectionChange: vi.fn(),
    })
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeDisabled()
  })

  it('shows tooltip when checkbox is disabled due to limit', () => {
    renderRepoCard({
      selected: ['repo1', 'repo2', 'repo3', 'repo4'],
      onSelectionChange: vi.fn(),
    })
    const checkbox = screen.getByRole('checkbox')
    fireEvent.mouseEnter(checkbox)
    expect(screen.getByText(/you can only compare upto 4 repos/i)).toBeInTheDocument()
  })

  it('renders link to repo detail page', () => {
    renderRepoCard()
    const link = screen.getByRole('link', { name: /facebook\/react/i })
    expect(link).toHaveAttribute('href', '/repo/facebook/react')
  })

  it('handles null description gracefully', () => {
    renderRepoCard({ description: null })
    // Should not crash - description element should not be in document or show empty
    const descriptionElement = screen.queryByText('null')
    expect(descriptionElement).not.toBeInTheDocument()
  })

  it('handles null language gracefully', () => {
    renderRepoCard({ language: null })
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument()
  })
})