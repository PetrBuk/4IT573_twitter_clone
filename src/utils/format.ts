import { Tweet } from '~db/schema'

export const getLikeContext = (
  tweets: Partial<Tweet>[],
  likedTweets: { tweetId: string }[]
) => {
  return tweets.map((tweet) => {
    const isLiked = likedTweets.some(
      (likedTweet) => likedTweet.tweetId === tweet?.id
    )

    return {
      ...tweet,
      isLiked
    }
  })
}
