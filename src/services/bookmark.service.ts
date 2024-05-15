import { and, count, desc, eq, exists } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { db } from '~db/config'
import { bookmarks, likes, retweets, tweets, users } from '~db/schema'

export class BookmarkService {
  static async bookmarkTweet(userId: string, tweetId: string) {
    return (
      await db.insert(bookmarks).values({ userId, tweetId }).returning()
    )?.[0]
  }

  static async unbookmarkTweet(userId: string, tweetId: string) {
    return await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.tweetId, tweetId), eq(bookmarks.userId, userId)))
  }

  static async checkIfBookmarked(userId: string, tweetId: string) {
    return (
      await db
        .select()
        .from(bookmarks)
        .where(
          and(eq(bookmarks.tweetId, tweetId), eq(bookmarks.userId, userId))
        )
    )?.length
      ? true
      : false
  }

  static async getBookmarks(userId: string) {
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
        isLiked: exists(
          db
            .select()
            .from(likes)
            .where(and(eq(likes.tweetId, tweets.id), eq(likes.userId, userId)))
        ),
        isRetweeted: exists(
          db
            .select()
            .from(retweets)
            .where(
              and(eq(retweets.tweetId, tweets.id), eq(retweets.userId, userId))
            )
        ),
        isBookmarked: exists(
          db
            .select()
            .from(bookmarks)
            .where(
              and(
                eq(bookmarks.tweetId, tweets.id),
                eq(bookmarks.userId, userId)
              )
            )
        ),
        user: {
          name: users.name,
          image: users.image
        }
      })
      .from(tweets)
      .rightJoin(bookmarks, eq(tweets.id, bookmarks.tweetId))
      .leftJoin(replies, eq(tweets.id, replies.replyId))
      .leftJoin(likes, eq(tweets.id, likes.tweetId))
      .leftJoin(retweets, eq(tweets.id, retweets.tweetId))
      .groupBy(tweets.id, users.name, users.image, bookmarks.createdAt)
      .leftJoin(users, eq(tweets.userId, users.id))
      .orderBy(desc(bookmarks.createdAt))
  }
}
