import { Description } from "./components/description"
import { User, ProviderName } from '.'

/**
 * Includes all necessary information to render a channel page other than the videos and playlists
 * which should be fetched separately since it contains continuation data.
 */
export type Comment = {
  provider: ProviderName
  id: string
  author: User
  content: Description // TODO:
  likes?: number
  replies?: AsyncIterable<Comment[]>
}
