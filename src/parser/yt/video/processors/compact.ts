import * as std from '@std'
import { ProviderName } from '@std'

import { combineSomeText } from '@yt/components/text'
import { Thumbnail } from '@yt/components/thumbnail'
import { Accessibility } from '@yt/components/utility/accessibility'
import { getBrowseNavigationId, Navigation, WatchEndpoint } from '@yt/components/utility/navigation'
import { humanReadableToNumber } from '@yt/core/helpers'
import { Renderer } from '@yt/core/internals'
import { BaseVideo, getVideoType } from '..'
import { getLength, getViewedLength, relativeToAbsoluteDate } from './helpers'

export function processCompactVideo({ compactVideoRenderer: video }: CompactVideo): std.Video {
  return {
    provider: ProviderName.YT,

    type: getVideoType(video),
    id: video.videoId,

    title: combineSomeText(video.title),
    viewCount: humanReadableToNumber(combineSomeText(video.viewCountText)),

    author: {
      name: combineSomeText(video.longBylineText),
      id: getBrowseNavigationId(video.longBylineText),
      avatar: video.channelThumbnail.thumbnails,
    },

    staticThumbnail: video.thumbnail.thumbnails,
    animatedThumbnail:
      video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails.thumbnails,

    length: getLength(video.lengthText),
    viewedLength: getViewedLength(video.thumbnailOverlays, getLength(video.lengthText)),

    publishDate:
      video.publishedTimeText && relativeToAbsoluteDate(combineSomeText(video.publishedTimeText)),
  }
}

export type CompactVideo = Renderer<
  'compactVideo',
  Navigation<WatchEndpoint> &
    Accessibility & {
      /** Thumbnails for channel */
      channelThumbnail: Thumbnail
    } & Pick<
      BaseVideo,
      | 'badges'
      | 'lengthText'
      | 'longBylineText'
      | 'menu'
      | 'publishedTimeText'
      | 'richThumbnail'
      | 'shortBylineText'
      | 'shortViewCountText'
      | 'thumbnail'
      | 'thumbnailOverlays'
      | 'title'
      | 'videoId'
      | 'viewCountText'
    >
>
