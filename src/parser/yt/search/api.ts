import { fetcher } from '@libs/fetch'
import { getContinuationItemResponseItems } from '@yt/components/continuation'
import { Endpoint, fetchYt, fetchEndpointContinuation, makeContinuationIterator } from '@yt/core/api'
import { SearchResponse, SearchResponseContinuation, SearchSuggestions } from './types'

export const fetchSearch = (query: string): Promise<SearchResponse> => fetchYt(Endpoint.Search, { query })
export const fetchSearchContinuation = fetchEndpointContinuation(Endpoint.Search)<SearchResponseContinuation>

// TODO: Make much cleaner
export const fetchSearchIterator = (query: string) =>
  makeContinuationIterator(token =>
    token
      ? fetchSearchContinuation(token).then(getContinuationItemResponseItems)
      : fetchSearch(query).then(
          res => res.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents,
        ),
  )

/** TODO: Youtube includes video_id when on a video. What else do they include? How does this affect results? */
export const fetchSearchSuggestions = (query: string): Promise<SearchSuggestions> =>
  fetcher(
    `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&q=${encodeURIComponent(
      query,
    )}&callback=google.sbox.p50`,
  )
    .then(res => res.text())
    .then(res => JSON.parse(res.slice(35, -1)))
