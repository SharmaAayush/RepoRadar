export type Repo = {
  id: number;
  full_name: string;      // "facebook/react"
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

export type RepoCardProps = Repo & {
  selected: string[];

  onFavorite: (id: number) => void;
  onSelectionChange: (fullName: string, checked: boolean) => void;
}