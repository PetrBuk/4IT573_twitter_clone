import { and, eq } from 'drizzle-orm'

import { db } from '~db/config'
import { likes } from '~db/schema'

export class LikeService {
  static async likeTweet(userId: string, tweetId: string) {
    return (await db.insert(likes).values({ userId, tweetId }).returning())?.[0]
  }

  static async unlikeTweet(userId: string, tweetId: string) {
    return await db
      .delete(likes)
      .where(and(eq(likes.tweetId, tweetId), eq(likes.userId, userId)))
  }

  static async checkIfLiked(userId: string, tweetId: string) {
    return (
      await db
        .select()
        .from(likes)
        .where(and(eq(likes.tweetId, tweetId), eq(likes.userId, userId)))
    )?.length
      ? true
      : false
  }
}
