import { desc, eq } from 'drizzle-orm'

import { db } from '~db/config'
import { TweetInsert, tweets } from '~db/schema'

export class TweetService {
  static async addTweet(tweetData: TweetInsert) {
    return (
      await db
        .insert(tweets)
        .values({ ...tweetData })
        .returning()
    )?.[0]
  }

  static async getTweets() {
    return await db.select().from(tweets).orderBy(desc(tweets.createdAt))
  }

  static async getTweet(id: string) {
    return await db.select().from(tweets).where(eq(tweets.id, id))
  }

  static async updateTweet(
    id: string,
    tweetData: Omit<TweetInsert, 'userId' | 'id' | 'createdAt'>
  ) {
    return await db
      .update(tweets)
      .set({ ...tweetData })
      .where(eq(tweets.id, id))
      .returning()
  }

  static async deleteTweet(id: string) {
    return await db.delete(tweets).where(eq(tweets.id, id)).returning()
  }
}
