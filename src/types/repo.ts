export type Repo = {
  id: number;
  full_name: string;      // "facebook/react"
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  language_color_class?: string;
}