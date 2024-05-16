import { and, count, desc, eq, exists } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { db } from '~db/config'
import {
  Tweet,
  TweetInsert,
  bookmarks,
  likes,
  retweets,
  tweets,
  users
} from '~db/schema'

import { BookmarkService } from './bookmark.service'
import { LikeService } from './like.service'
import { RetweetService } from './retweet.service'

export class TweetService {
  static async addTweet(tweetData: TweetInsert) {
    return (
      await db
        .insert(tweets)
        .values({ ...tweetData })
        .returning()
    )?.[0]
  }

  static async getTweets(userId: string) {
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
      .leftJoin(replies, eq(tweets.id, replies.replyId))
      .leftJoin(likes, eq(tweets.id, likes.tweetId))
      .leftJoin(retweets, eq(tweets.id, retweets.tweetId))
      .groupBy(tweets.id, users.name, users.image)
      .leftJoin(users, eq(tweets.userId, users.id))
      .orderBy(desc(tweets.createdAt))
  }

  static async getTweet(userId: string, id: string) {
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
          isLiked: exists(
            db
              .select()
              .from(likes)
              .where(
                and(eq(likes.tweetId, tweets.id), eq(likes.userId, userId))
              )
          ),
          isRetweeted: exists(
            db
              .select()
              .from(retweets)
              .where(
                and(
                  eq(retweets.tweetId, tweets.id),
                  eq(retweets.userId, userId)
                )
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
        .where(eq(tweets.id, id))
        .leftJoin(replies, eq(tweets.id, replies.replyId))
        .leftJoin(likes, eq(tweets.id, likes.tweetId))
        .leftJoin(retweets, eq(tweets.id, retweets.tweetId))
        .groupBy(tweets.id, users.name, users.image)
        .leftJoin(users, eq(tweets.userId, users.id))
    )?.[0]
  }

  static async getLikedTweets(userId: string) {
    return await db
      .select({
        tweetId: likes.tweetId
      })
      .from(likes)
      .where(eq(likes.userId, userId))
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

  static async getReplies(userId: string, tweetId: string) {
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
      .where(eq(tweets.replyId, tweetId))
      .leftJoin(replies, eq(tweets.id, replies.replyId))
      .leftJoin(likes, eq(tweets.id, likes.tweetId))
      .leftJoin(retweets, eq(tweets.id, retweets.tweetId))
      .groupBy(tweets.id, users.name, users.image)
      .leftJoin(users, eq(tweets.userId, users.id))
      .orderBy(desc(tweets.createdAt))
  }

  static async getTweetWithUserContext(tweet: Partial<Tweet>, userId: string) {
    const isLiked = LikeService.checkIfLiked(userId, tweet.id as string)
    const isRetweeted = RetweetService.checkIfRetweeted(
      userId,
      tweet.id as string
    )
    const isBookmarked = BookmarkService.checkIfBookmarked(
      userId,
      tweet.id as string
    )

    const [liked, retweeted, bookmarked] = await Promise.all([
      isLiked,
      isRetweeted,
      isBookmarked
    ])

    return {
      ...tweet,
      isLiked: liked,
      isRetweeted: retweeted,
      isBookmarked: bookmarked
    }
  }
}
