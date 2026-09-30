export type ErrorBannerProps = { message: string }

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return <div className="bg-[var(--red-subtle)] rounded-xl border border-[var(--red)]/50 text-[var(--red)] py-2 px-3 mt-1" role="alert">
    {message}
  </div>
}