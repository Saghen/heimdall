import { curry } from 'ramda'
import { Endpoint, headOfSome, Renderer, Some, SomeOptions } from '../../core/internals'

/** General function for converting a navigation endpoint to a relative or absolute url */
export const getNavigationUrl = <T extends Navigation<UrlEndpoint | BrowseEndpoint | WatchEndpoint>>(
  val: T,
) => {
  if ('urlEndpoint' in val.navigationEndpoint) return getUrlNavigationUrl(val as Navigation<UrlEndpoint>)
  if ('browseEndpoint' in val.navigationEndpoint)
    return getBrowseNavigationUrl(val as Navigation<BrowseEndpoint>)
  if ('watchEndpoint' in val.navigationEndpoint)
    return getWatchNavigationUrl(val as Navigation<WatchEndpoint>)

  console.warn(
    'Unrecognized navigation endpoint with the following keys',
    Object.keys(val.navigationEndpoint),
  )
  return '#'
}

export const getBrowseNavigationId = <T, U>(
  some: Some<NavigationSome<BrowseEndpoint, SomeOptions<T, U>>> | Navigation<BrowseEndpoint>,
) => headOfSome(some).navigationEndpoint.browseEndpoint.browseId

export const getBrowseNavigationUrl = <T, U>(
  some: Some<NavigationSome<BrowseEndpoint, SomeOptions<T, U>>> | Navigation<BrowseEndpoint>,
) => headOfSome(some).navigationEndpoint.browseEndpoint.canonicalBaseUrl

/** What a name */
export const getUrlNavigationUrl = <T, U>(
  some: Some<NavigationSome<UrlEndpoint, SomeOptions<T, U>>> | Navigation<UrlEndpoint>,
) => headOfSome(some).navigationEndpoint.urlEndpoint.url

export const getWatchNavigationUrl = <T, U>(
  some: Some<NavigationSome<WatchEndpoint, SomeOptions<T, U>>> | Navigation<WatchEndpoint>,
) => {
  const val = headOfSome(some)
  return `/w/${val.navigationEndpoint.watchEndpoint.videoId}?t=${val.navigationEndpoint.watchEndpoint.startTimeSeconds}`
}

export const getWatchNavigationId = <T, U>(
  some: Some<NavigationSome<WatchEndpoint, SomeOptions<T, U>>> | Navigation<WatchEndpoint>,
) => headOfSome(some).navigationEndpoint.watchEndpoint.videoId

export const mapNavigation = curry(
  <T, U extends {}>(
    callback: ({ id, baseUrl }: { id: string; baseUrl?: string }) => T,
    value: Navigation<BrowseEndpoint> & U,
  ): T =>
    callback({
      id: value.navigationEndpoint.browseEndpoint.browseId,
      baseUrl: value.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
    }),
)

export type NavigationSome<
  NavigationEndpoint extends Endpoint = BrowseEndpoint,
  T extends SomeOptions<{}, {}> = SomeOptions<{}, {}>,
> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Navigation<NavigationEndpoint> & U, Navigation<NavigationEndpoint> & V>
  : never

export type Navigation<NavigationEndpoint extends Endpoint = BrowseEndpoint> = Endpoint<
  'navigation',
  NavigationEndpoint
>

/** Used for navigation within Youtube */
export type BrowseEndpoint = Endpoint<
  'browse',
  { browseId: string; params?: string; canonicalBaseUrl?: string }
>

/** Used for links to reels */
export type ReelWatchEndpoint = Endpoint<
  'reelWatch',
  {
    params?: string
    playerParams?: string
    overlay: Renderer<'reelPlayerOverlay', { TODO: 'TODO' }>
    /** Only seen "REEL_WATCH_SEQUENCE_PROVIDER_RPC" */
    sequenceProvider?: string
    /** Only seen "REEL_WATCH_INPUT_TYPE_SEEDLESS" */
    inputType?: boolean
  }
>

/** Used for links to other Youtube videos */
export type WatchEndpoint = Endpoint<
  'watch',
  {
    videoId: string
    startTimeSeconds?: number
    nofollow?: boolean
    params?: string
    playerParams?: string

    // For playlists
    playlistId?: string
    continuePlayback?: boolean
  }
>
/** Used for navigation outside of Youtube */
export type UrlEndpoint = Endpoint<
  'url',
  {
    nofollow: boolean
    target: string // Only seen 'TARGET_NEW_WINDOW'
    /** A youtube URL that redirects externally. Should calculate actual url from this */
    url: string // https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbDNfajZmYWFzN0dCLWg2MmFGZ3ZFUmIyQ2RBd3xBQ3Jtc0trdk1tVEFrNGlqdmNnQXB5VWxuMzVnVDlzbWpVanFFVlVKYk9NeDFnaGhCSUtEeXhoaWVxMU9XVHVOdGVwN1ZMajJWZUgwN0oyNTV4NGZqTkE3cmpEalQzN0JQN3dYSmZBemxYWjhaNU9XQXZCTGJ3cw&q=http%3A%2F%2FExtremitiesPodcast.com
  }
>

// The following are sometimes a part of watch endpoint
// Not sure if they matter though
type WatchEndpointSupportedOnesieConfig = {
  watchEndpointSupportedOnesieConfig: {
    html5PlaybackOnesieConfig: {
      commonConfig: {
        url: string
      }
    }
  }
}

type WatchEndpointSupportedPrefetchContentConfig = {
  watchEndpointSupportedPrefetchConfig: {
    prefetchHintConfig: {
      prefetchPriority: 0
      countdownUiRelativeSecondsPrefetchCondition: -3
    }
  }
}
