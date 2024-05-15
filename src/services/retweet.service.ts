import { and, eq } from 'drizzle-orm'

import { db } from '~db/config'
import { retweets } from '~db/schema'

export class RetweetService {
  static async retweetTweet(userId: string, tweetId: string) {
    return (
      await db.insert(retweets).values({ userId, tweetId }).returning()
    )?.[0]
  }

  static async unretweetTweet(userId: string, tweetId: string) {
    return await db
      .delete(retweets)
      .where(and(eq(retweets.tweetId, tweetId), eq(retweets.userId, userId)))
  }

  static async checkIfRetweeted(userId: string, tweetId: string) {
    return (
      await db
        .select()
        .from(retweets)
        .where(and(eq(retweets.tweetId, tweetId), eq(retweets.userId, userId)))
    )?.length
      ? true
      : false
  }
}
