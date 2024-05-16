import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import {
  AnyPgColumn,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

import { users } from './auth'

export const usersRelations = relations(users, ({ many }) => ({
  tweets: many(tweets),
  likes: many(likes),
  retweets: many(retweets),
  bookmarks: many(bookmarks)
}))

export const tweets = pgTable('tweets', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: text('text').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  replyId: uuid('reply_id').references((): AnyPgColumn => tweets.id)
})

export type Tweet = InferSelectModel<typeof tweets>
export type TweetInsert = InferInsertModel<typeof tweets>
export const tweetInsertSchema = createInsertSchema(tweets)

export const tweetsRelations = relations(tweets, ({ one }) => ({
  user: one(users, {
    fields: [tweets.userId],
    references: [users.id]
  }),
  tweet: one(tweets, {
    fields: [tweets.replyId],
    references: [tweets.id]
  })
}))

export const hashtags = pgTable('hashtags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull()
})

export const tweetHashtag = pgTable(
  'tweet_hashtag',
  {
    tweetId: uuid('tweet_id')
      .notNull()
      .references(() => tweets.id),
    hashtagId: uuid('hashtag_id')
      .notNull()
      .references(() => hashtags.id)
  },
  (tweet_hashtag) => ({
    tweetHashtagPrimaryKey: primaryKey({
      columns: [tweet_hashtag.tweetId, tweet_hashtag.hashtagId]
    })
  })
)

export const likes = pgTable(
  'likes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    tweetId: uuid('tweet_id')
      .notNull()
      .references(() => tweets.id),
    created_at: timestamp('created_at').defaultNow().notNull()
  },
  (likes) => ({
    uniqueLikeIndex: uniqueIndex('likes__user_id_tweet_id__idx').on(
      likes.userId,
      likes.tweetId
    )
  })
)

export type LikeInsert = InferInsertModel<typeof likes>

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id]
  })
}))

export const retweets = pgTable(
  'retweets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    tweetId: uuid('tweet_id')
      .notNull()
      .references(() => tweets.id),
    created_at: timestamp('created_at').defaultNow().notNull()
  },
  (retweets) => ({
    uniqueRetweetIndex: uniqueIndex('retweets__user_id_tweet_id__idx').on(
      retweets.userId,
      retweets.tweetId
    )
  })
)

export const retweetsRelations = relations(retweets, ({ one }) => ({
  user: one(users, {
    fields: [retweets.userId],
    references: [users.id]
  })
}))

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    tweetId: uuid('tweet_id')
      .references(() => tweets.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  (bookmarks) => ({
    uniqueBookmarkIndex: uniqueIndex('bookmarks__user_id_tweet_id__idx').on(
      bookmarks.userId,
      bookmarks.tweetId
    )
  })
)

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id]
  })
}))

export const follows = pgTable(
  'follows',
  {
    follower: text('follower_id')
      .references(() => users.id)
      .notNull(),
    followed: text('followed_id')
      .references(() => users.id)
      .notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.follower, table.followed] })
  })
)

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.follower],
    references: [users.id]
  }),
  followed: one(users, {
    fields: [follows.followed],
    references: [users.id]
  })
}))
