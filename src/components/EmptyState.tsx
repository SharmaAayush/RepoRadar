export type EmptyStateProps = {
  message?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (<div className="p-4 mb-4 text-sm bg-[#161e2e] text-slate-200 rounded-xl" role="alert">
    {message || 'No repos match your search.'}
  </div>)
}