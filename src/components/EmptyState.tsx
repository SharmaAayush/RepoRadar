export type EmptyStateProps = {
  message?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (<div className="p-4 mb-4 text-sm bg-[var(--bg-elevated-2)] text-[var(--text-primary)] rounded-xl" role="alert">
    {message || 'No repos match your search.'}
  </div>)
}