import { Channel, Comment, Playlist, Video, Player, User } from '.'

export enum LikeStatus {
  Indifferent = 'indifferent',
  Like = 'like',
  Dislike = 'dislike',
}

export enum ProviderName {
  YT = 'yt',
  Twitch = 'twitch',
  Nebula = 'nebula',
  Curiosity = 'curiosity',
  Floatplane = 'floatplane',
}

export enum ResourceType {
  Channel = 'channel',
  Comment = 'comment',
  Playlist = 'playlist',
  Self = 'self',
  User = 'user',
  Video = 'video',
}

export type Resource<Type extends ResourceType> = Type extends ResourceType.Channel
  ? Channel
  : Type extends ResourceType.Comment
  ? Comment
  : Type extends ResourceType.Playlist
  ? Playlist
  : Type extends ResourceType.Self
  ? never
  : Type extends ResourceType.User
  ? User
  : Type extends ResourceType.Video
  ? Video
  : never

type IdIfNotSelf<ResourceTypes extends ResourceType, ReturnType> = <
  ResourceType extends ResourceType.Self | ResourceTypes,
>(
  resourceType: ResourceType,
) => ResourceType extends ResourceType.Self ? () => ReturnType : (id: string) => ReturnType

export type Provider = {
  // TODO:
  getRecommended?: () => AsyncIterable<(Video | { title: string; videos: Video[] })[]>
  // What about getting new videos from followed channels? /subscribed on YT

  // TODO:
  getPlayer: (videoId: string) => Promise<Player>
  getVideo: (videoId: string) => Promise<Video>
  listVideos: (
    resourceType: ResourceType.Channel | ResourceType.Playlist,
  ) => (id: string) => AsyncIterable<Video[]>
  setVideoLikeStatus?: (videoId: string) => (likeStatus: LikeStatus) => Promise<void>

  getUser: (userId: string) => Promise<User>
  listFollowedUsers: () => AsyncIterable<User[]>
  listLiveFollowedUsers?: () => AsyncIterable<User[]>
  setUserFollowed: (id: string) => (isFollowing: boolean) => Promise<void>

  getPlaylist?: (playListId: string) => Promise<Playlist>
  listPlaylists?: IdIfNotSelf<ResourceType.User, AsyncIterable<Playlist[]>>

  getChannel: (channelId: string) => Promise<Channel>
  /** Going to want this eventually for subscriptions view */
  // listFollowedChannels: IdIfNotSelf<ResourceType.Channel, AsyncIterable<Channel[]>>
  // listLiveFollowedChannels?: IdIfNotSelf<ResourceType.Channel, AsyncIterable<Channel[]>>

  getComment?: (commentId: string) => Promise<Comment>
  listComments?: (videoId: string) => AsyncIterable<Comment[]>

  /** Gets search results from the provider */
  getSearch: <Type extends ResourceType.Channel | ResourceType.Playlist | ResourceType.Video>(
    resourceType: Type[],
  ) => (query: string) => AsyncIterable<Resource<Type>[]>
  /** Gets search suggestions from the provider. The resourceType may be respected but may also be ignored */
  getSearchSuggestions: (
    resourceType: (ResourceType.Channel | ResourceType.Playlist | ResourceType.Video)[],
  ) => (query: string) => Promise<string[]>
}
