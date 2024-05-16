import { and, eq } from 'drizzle-orm'

import { db } from '~db/config'
import { follows } from '~db/schema'

export class FollowService {
  static async followUser(userId: string, followedId: string) {
    return (
      await db
        .insert(follows)
        .values({ follower: userId, followed: followedId })
        .returning()
    )?.[0]
  }

  static async unfollowUser(userId: string, followedId: string) {
    return await db
      .delete(follows)
      .where(
        and(eq(follows.follower, userId), eq(follows.followed, followedId))
      )
  }

  static async checkIfFollowed(userId: string, followedId: string) {
    return (
      await db
        .select()
        .from(follows)
        .where(
          and(eq(follows.follower, userId), eq(follows.followed, followedId))
        )
    )?.length
      ? true
      : false
  }
}
