import { Provider, ResourceType } from 'parser/std'
import { getChannel, listChannelVideos } from './channel'
import { getPlayer, getRecommended, getVideo, setVideoLikeStatus } from './video'
import { getUser, listFollowedUsers, listLiveFollowedUsers, setUserFollowed } from './user'
import { getSearch, getSearchSuggestions } from './search'

export const makeProvider = (): Provider => ({
  getRecommended,

  getPlayer,
  getVideo,
  listVideos: type => id => type === ResourceType.Channel ? listChannelVideos(id) : listChannelVideos(id),
  setVideoLikeStatus,

  getUser,
  listFollowedUsers,
  listLiveFollowedUsers,
  setUserFollowed,

  // getPlaylist,
  // listPlaylists,

  getChannel,

  // getComment,
  // listComments,

  getSearch,
  getSearchSuggestions
})
