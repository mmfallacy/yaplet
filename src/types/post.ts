export interface Post {
  id: string;
  content: string;
  createdAt: string;
  threadId: string | null;
  threadOrder?: number;
  images: string[];
}

export interface Thread {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface PostWithThread extends Post {
  thread?: Thread;
}
