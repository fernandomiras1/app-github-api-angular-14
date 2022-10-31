export interface GithubApi {
  items: GithubUser[];
  total_count: number;
}

export interface GithubUser {
  avatar_url: string;
  login: string;
  type: string;
}
