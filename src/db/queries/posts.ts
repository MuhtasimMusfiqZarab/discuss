import type { Post } from '@prisma/client';
import { db } from '@/db';

//      first approach for defining type of returned data using typescript
export type PostWithData = Post & {
  topic: {
    slug: string;
  };
  user: {
    name: string | null;
  };
  _count: { comments: number };
};

// second and alternative approach if we dont want to write
// returned type using typescript
// export type PostWithData = Awaited<ReturnType<typeof fetchPostByTopicSlug>>[number];

export function fetchPostByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: { topic: { slug } },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } }
    }
  });
}

export function fetchTopPosts(): Promise<PostWithData[]> {
  return db.post.findMany({
    orderBy: [
      {
        comments: {
          _count: 'desc'
        }
      }
    ],
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } }
    },
    take: 5
  });
}
