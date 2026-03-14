//Interfaces

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  submitted_by: string;
  created_at: string;
}

export interface ArticleWithUser extends Article {
  username: string;
  email: string;
}
