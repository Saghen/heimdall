import { BrowseId, Endpoint, fetchYt, fetchEndpointContinuation } from '../core/api'
import { CompactContinuationResponse } from './types/responses/compact-continuation'
import { VideoResponse } from './types/responses/video'
import { PlayerResponse } from './types/responses/player'
import { RecommendedResponse } from './types/responses/recommended'

export const fetchRecommended = (continuationToken?: string): Promise<RecommendedResponse> =>
  fetchYt(
    Endpoint.Browse,
    continuationToken ? { continuation: continuationToken } : { browseId: BrowseId.Recommended },
  )
export const fetchPlayer = (videoId: string): Promise<PlayerResponse> => fetchYt(Endpoint.Player, { videoId })
export const fetchVideo = (videoId: string): Promise<VideoResponse> => fetchYt(Endpoint.Next, { videoId })
export const fetchCompactVideoContinuation = fetchEndpointContinuation(
  Endpoint.Next,
)<CompactContinuationResponse>

export const fetchVideoLike = (videoId: string) => fetchYt(Endpoint.Like, { target: { videoId } })
export const fetchVideoDislike = (videoId: string) => fetchYt(Endpoint.Like, { target: { videoId } })
export const fetchVideoIndifferent = (videoId: string) => fetchYt(Endpoint.Like, { target: { videoId } })
