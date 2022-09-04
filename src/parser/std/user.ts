import { Image } from "./components/image"

export type User = {
  name: string
  id: string
  avatar: Image[]

  isLive?: boolean
  viewCount?: number
  followerCount?: number
  followed?: boolean
}
