import * as std from '@std'
import { combineSomeText } from '@yt/components/text'
import { ChannelResponse } from '../api'
import { ChannelTabName } from '../types'

export const processChannelPage =
  (channelId: string) =>
  (channelResponse: ChannelResponse<ChannelTabName.Home>): std.Channel => {
    const metadata = channelResponse.metadata.channelMetadataRenderer
    const header = channelResponse.header.c4TabbedHeaderRenderer

    return {
      provider: std.ProviderName.YT,
      id: channelId,
      user: {
        avatar: metadata.avatar.thumbnails,
        id: channelId,
        name: metadata.title,
        followed: header.subscribeButton.subscribeButtonRenderer.subscribed,
        followerCount: Number(combineSomeText(header.subscriberCountText)),
        /** TODO: Check if live by looking for live streams on their home page? */
        // isLive: res.contents.twoColumnBrowseResultsRenderer.tabs.find(isTab(ChannelTabName.Home))?.tabRenderer.content.sectionListRenderer.contents
      },
      banner: header.banner.thumbnails,
      description: [{ content: metadata.description, type: std.DescriptionChunkType.Text }],
    }
  }
