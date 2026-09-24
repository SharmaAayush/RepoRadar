export type ErrorBannerProps = { message: string }

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return <div className="bg-red-950 rounded-xl border border-red-500 text-red-500 py-2 px-3 mt-1" role="alert">
    {message}
  </div>
}