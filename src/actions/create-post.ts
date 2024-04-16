'use server';

import type { Post } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/db';
import paths from '@/paths';

//validation form
const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10)
});

//whenever we make a server action using useFromState then we like to make an interface that exactly states what kind of data we need to return from server action
interface createPostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: createPostFormState,
  formData: FormData
): Promise<createPostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content')
  });

  //issue parsing data
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['You must be signed in to do this']
      }
    };
  }
  //find the topic using slug
  const topic = await db.topic.findFirst({
    where: { slug }
  });

  if (!topic) {
    return {
      errors: {
        _form: ['Can not find the topic']
      }
    };
  }

  //create a post in our database
  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message]
        }
      };
    } else {
      return {
        errors: {
          _form: ['Failed to create post']
        }
      };
    }
  }

  //TODO: Revalidate the TopicShowPage
  revalidatePath(paths.topicShow(slug));
  redirect(paths.postShow(topic.slug, post.id));
}
