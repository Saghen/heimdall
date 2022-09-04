import * as std from '@std'
import {
  fetchVideo,
  fetchRecommended,
  fetchPlayer,
  fetchCompactVideoContinuation,
  fetchVideoLike,
  fetchVideoDislike,
  fetchVideoIndifferent,
} from './api'

import { MetadataBadge } from '../components/badge'
import { findRendererRaw } from '../core/internals'
import { processFullVideo } from './processors/full'
import { makeContinuationIterator } from '@yt/core/api'
import { RichItem } from '@yt/components/item'
import { processVideo, Video } from './processors/regular'
import { processCompactVideo } from './processors/compact'
import { processPlayer } from './processors/player'
export * from './types'

export async function* getRecommended() {
  const recommendedVideosIterator = makeContinuationIterator(token =>
    fetchRecommended(token).then(
      response =>
        response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer
          .contents,
    ),
  )
  for await (const recommendedVideos of recommendedVideosIterator) {
    yield recommendedVideos
      .filter((renderer): renderer is RichItem<Video> => 'richItemRenderer' in renderer)
      .map(renderer => renderer.richItemRenderer.content)
      .map(processVideo)
  }
}

export async function getVideo(videoId: string): Promise<std.Video> {
  const [videoResponse, playerResponse] = await Promise.all([fetchVideo(videoId), fetchPlayer(videoId)])

  const contents = videoResponse.contents.twoColumnWatchNextResults.results.results.contents
  const primaryInfo = findRendererRaw('videoPrimaryInfo')(contents)
  const secondaryInfo = findRendererRaw('videoSecondaryInfo')(contents)
  if (!primaryInfo || !secondaryInfo) {
    throw Error('Failed to find primary and secondary info in the YT request. Something has gone wrong!')
  }

  const video = processFullVideo(videoId, [primaryInfo, secondaryInfo], playerResponse.videoDetails)

  const relatedVideos =
    videoResponse.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results

  const relatedVideosIterator = makeContinuationIterator(async token =>
    !token
      ? relatedVideos
      : fetchCompactVideoContinuation(token).then(
          response => response.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems,
        ),
  )

  return {
    ...video,
    related: async function* (): AsyncGenerator<std.Video[], void, void> {
      for await (const relatedVideos of relatedVideosIterator) {
        yield relatedVideos.map(processCompactVideo)
      }
    },
  }
}

export const getPlayer = (videoId: string) =>
  fetchPlayer(videoId).then(playerResponse =>
    processPlayer(playerResponse.videoDetails, playerResponse.playerConfig, playerResponse.streamingData),
  )

export const setVideoLikeStatus = (videoId: string) => (likeStatus: std.LikeStatus) =>
  (likeStatus === std.LikeStatus.Like
    ? fetchVideoLike
    : likeStatus === std.LikeStatus.Dislike
    ? fetchVideoDislike
    : fetchVideoIndifferent)(videoId).then(() => {})

export function getVideoType(video: { badges?: MetadataBadge[] }): std.VideoType {
  const isLive =
    'badges' in video && video.badges?.some(badge => badge.metadataBadgeRenderer.label === 'LIVE NOW')
  return isLive ? std.VideoType.Live : std.VideoType.Static
}
