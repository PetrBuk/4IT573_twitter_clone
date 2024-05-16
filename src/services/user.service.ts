import { and, eq, exists } from 'drizzle-orm'

import { db } from '~db/config'
import { follows, users } from '~db/schema'

export class UserService {
  static async getUsers(loggedUserId: string) {
    return await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        isFollowed: exists(
          db
            .select()
            .from(follows)
            .where(
              and(
                eq(follows.follower, loggedUserId),
                eq(follows.followed, users.id)
              )
            )
        )
      })
      .from(users)
  }

  static async getUser(loggedUserId: string, userId: string) {
    return (
      await db
        .select({
          id: users.id,
          name: users.name,
          image: users.image,
          isFollowed: exists(
            db
              .select()
              .from(follows)
              .where(
                and(
                  eq(follows.follower, loggedUserId),
                  eq(follows.followed, users.id)
                )
              )
          )
        })
        .from(users)
        .where(eq(users.id, userId))
    )?.[0]
  }
}
