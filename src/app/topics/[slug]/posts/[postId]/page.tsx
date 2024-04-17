import Link from 'next/link';
import PostShow from '@/components/posts/post-show';
import CommentList from '@/components/comments/comment-list';
import CommentCreateForm from '@/components/comments/comment-create-form';
import paths from '@/paths';

import PostShowLoading from '@/components/posts/post-show-loading';

//content streaming
import { Suspense } from 'react';

import { fetchCommentsByPostId } from '@/db/queries/comments';

interface PostShowPageProps {
  params: {
    slug: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { slug, postId } = params;

  return (
    <div className="space-y-3">
      <Link className="underline decoration-solid" href={paths.topicShow(slug)}>
        {'< '}Back to {slug}
      </Link>
      <Suspense fallback={<PostShowLoading />}>
        {/* @ts-expect-error Async Server Component */}
        <PostShow postId={postId} />
      </Suspense>
      <CommentCreateForm postId={postId} startOpen />
      {/* @ts-expect-error Async Server Component */}
      <CommentList fetchData={() => fetchCommentsByPostId(postId)} />
    </div>
  );
}
