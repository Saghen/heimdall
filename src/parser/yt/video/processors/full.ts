import * as std from '@std'
import { SubscribeButton } from '@yt/components/button'
import { LikeStatus } from '@yt/components/like-status'
import { combineSomeText, parseDescription, Text } from '@yt/components/text'
import {
  mapNavigation,
  NavigationSome,
  UrlEndpoint,
  WatchEndpoint,
} from '@yt/components/utility/navigation'
import { parseViewCount } from '@yt/core/helpers'
import { headOfSome, Renderer, Some } from '@yt/core/internals'
import { ProviderName } from 'parser/std'
import { prop } from 'ramda'
import { VideoDetails } from '../api'
import { SentimentBar, VideoActions, VideoOwner, VideoViewCount } from '../types'
import { relativeToAbsoluteDate } from './helpers'

export function processFullVideo(
  id: string,
  fullVideo: FullVideo,
  videoDetails: VideoDetails
): std.Video {
  const [{ videoPrimaryInfoRenderer: primary }, { videoSecondaryInfoRenderer: secondary }] =
    fullVideo

  const likeButton = primary.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer
  const dislikeButton = primary.videoActions.menuRenderer.topLevelButtons[1].toggleButtonRenderer
  const likeCount = parseViewCount(
    headOfSome(likeButton.defaultText).accessibility.accessibilityData.label
  )

  const likeStatus: LikeStatus = likeButton.isToggled
    ? 'LIKE'
    : dislikeButton.isToggled
    ? 'DISLIKE'
    : 'INDIFFERENT'

  const owner = secondary.owner.videoOwnerRenderer
  const subscription = secondary.subscribeButton.subscribeButtonRenderer
  const viewCountRenderer = primary.viewCount.videoViewCountRenderer

  return {
    provider: ProviderName.YT,

    // FIXME: Get video type based on video properties
    type: std.VideoType.Static,
    id,
    author: {
      name: combineSomeText(owner.title),
      id: mapNavigation(prop('id'), owner),
      avatar: owner.thumbnail.thumbnails,
      followed: subscription.subscribed,
      followerCount: Number(combineSomeText(owner.subscriberCountText)),
    },

    title: combineSomeText(primary.title),
    shortDescription: videoDetails.shortDescription,
    description: parseDescription(secondary.description),

    staticThumbnail: videoDetails.thumbnail.thumbnails,

    likeCount,
    likeStatus,
    viewCount: parseViewCount(combineSomeText(viewCountRenderer.viewCount)),

    length: Number(videoDetails.lengthSeconds),
    publishDate: relativeToAbsoluteDate(combineSomeText(primary.dateText)),
  }
}

export type FullVideo = [VideoPrimaryInfo, VideoSecondaryInfo]

export type VideoPrimaryInfo = Renderer<
  'videoPrimaryInfo',
  {
    dateText: Some<Text>
    videoActions: VideoActions
    sentimentBar: SentimentBar
    title: Some<Text>
    viewCount: VideoViewCount
  }
>

export type VideoSecondaryInfo = Renderer<
  'videoSecondaryInfo',
  {
    description: Some<NavigationSome<UrlEndpoint | WatchEndpoint, Text>>
    descriptionCollapsedLines: number

    owner: VideoOwner
    showLessText: Some<Text>
    showMoreText: Some<Text>
    subscribeButton: SubscribeButton
  }
>
