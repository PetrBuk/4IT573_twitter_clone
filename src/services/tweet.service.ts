import { count, desc, eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { db } from '~db/config'
import { TweetInsert, likes, retweets, tweets, users } from '~db/schema'

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
    const replies = alias(tweets, 'reply')

    return await db
      .select({
        id: tweets.id,
        text: tweets.text,
        createdAt: tweets.createdAt,
        updatedAt: tweets.updatedAt,
        repliesCount: count(replies.id),
        likesCount: count(likes.id),
        retweetsCount: count(retweets.id),
        user: {
          name: users.name,
          image: users.image
        }
      })
      .from(tweets)
      .leftJoin(replies, eq(tweets.id, replies.replyId))
      .leftJoin(likes, eq(tweets.id, likes.tweetId))
      .leftJoin(retweets, eq(tweets.id, retweets.tweetId))
      .groupBy(tweets.id, users.name, users.image)
      .leftJoin(users, eq(tweets.userId, users.id))
      .orderBy(desc(tweets.createdAt))
  }

  static async getTweet(id: string) {
    const replies = alias(tweets, 'reply')

    return (
      await db
        .select({
          id: tweets.id,
          text: tweets.text,
          createdAt: tweets.createdAt,
          updatedAt: tweets.updatedAt,
          repliesCount: count(replies.id),
          likesCount: count(likes.id),
          retweetsCount: count(retweets.id),
          user: {
            name: users.name,
            image: users.image
          }
        })
        .from(tweets)
        .where(eq(tweets.id, id))
        .leftJoin(replies, eq(tweets.id, replies.replyId))
        .leftJoin(likes, eq(tweets.id, likes.tweetId))
        .leftJoin(retweets, eq(tweets.id, retweets.tweetId))
        .groupBy(tweets.id, users.name, users.image)
        .leftJoin(users, eq(tweets.userId, users.id))
    )?.[0]
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

  static async getReplies(tweetId: string) {
    const replies = alias(tweets, 'reply')

    return await db
      .select({
        id: tweets.id,
        text: tweets.text,
        createdAt: tweets.createdAt,
        updatedAt: tweets.updatedAt,
        repliesCount: count(replies.id),
        likesCount: count(likes.id),
        retweetsCount: count(retweets.id),
        user: {
          name: users.name,
          image: users.image
        }
      })
      .from(tweets)
      .where(eq(tweets.replyId, tweetId))
      .leftJoin(replies, eq(tweets.id, replies.replyId))
      .leftJoin(likes, eq(tweets.id, likes.tweetId))
      .leftJoin(retweets, eq(tweets.id, retweets.tweetId))
      .groupBy(tweets.id, users.name, users.image)
      .leftJoin(users, eq(tweets.userId, users.id))
      .orderBy(desc(tweets.createdAt))
  }
}
