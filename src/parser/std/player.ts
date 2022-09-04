import { ProviderName, VideoType } from '.'
import { Image } from './components/image'

export type Player = {
  provider: ProviderName

  type: VideoType
  id: string
  title: string

  sources: Source[]

  /** The static and primary thumbnail for the video. An array of objects for various sizes */
  staticThumbnail: Image[]
  /** The animated thumbnail for the video. An array of objects for various sizes. Can be used for on-hover for example */
  animatedThumbnail?: Image[]

  /** Length of the video or uptime of live stream in seconds */
  length?: number
  /** Length of the video in seconds that has already been viewed */
  viewedLength?: number
  /** Date that the video was published or that the live stream started */
  publishDate?: Date
}

export enum SourceType {
  Audio = 'audio',
  Video = 'video',
  AudioVideo = 'audiovideo',
}

export type Source<Type extends SourceType = SourceType> = BaseSource<Type> &
  (Type extends SourceType.Audio | SourceType.AudioVideo ? AudioSource : {}) &
  (Type extends SourceType.Video | SourceType.AudioVideo ? VideoSource : {})

type BaseSource<Type extends SourceType> = { type: Type; url: string; mimetype?: string }
type AudioSource = { audioBitrate?: number }
type VideoSource = { width: number; height: number; framerate: number; videoBitrate?: number }
