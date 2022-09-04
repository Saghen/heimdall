import { Image } from './components/image'
import { User, LikeStatus, ProviderName } from '.'
import { Playlist } from './playlist'
import { Description } from './components/description'

export enum VideoType {
  Live = 'live',
  Static = 'static',
}

export type Video = {
  provider: ProviderName

  type: VideoType
  id: string

  title: string
  shortDescription?: string
  description?: Description
  viewCount?: number

  likeStatus?: LikeStatus
  likeCount?: number
  dislikeCount?: number

  author?: User

  /** The static and primary thumbnail for the video. An array of objects for various sizes */
  staticThumbnail: Image[]
  /** The animated thumbnail for the video. An array of objects for various sizes. Can be used for on-hover for example */
  animatedThumbnail?: Image[]

  /** Videos related to this video */
  related?: () => AsyncGenerator<(Video | User | Playlist)[], void, void>

  /** Length of the video or uptime of live stream in seconds */
  length?: number
  /** Length of the video in seconds that has already been viewed */
  viewedLength?: number
  /** Date that the video was uploaded or that the live stream started */
  publishDate?: Date
}

