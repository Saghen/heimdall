import * as std from '@std'
import { ProviderName } from 'parser/std'
import { PlayerConfig } from '../types/player-config'
import {
  PlayerAdaptiveFormat,
  PlayerAudioFormat,
  PlayerFormat,
  PlayerVideoFormat,
  StreamingData,
} from '../types/streaming-data'
import { VideoDetails } from '../types/video-details'

export function processPlayer(
  videoDetails: VideoDetails,
  playerConfig: PlayerConfig,
  streamingData: StreamingData,
): std.Player {
  streamingData.formats
  return {
    provider: ProviderName.YT,
    type: videoDetails.isLiveContent ? std.VideoType.Live : std.VideoType.Static,
    id: videoDetails.videoId,
    title: videoDetails.title,
    staticThumbnail: videoDetails.thumbnail.thumbnails,
    sources: [
      ...streamingData.formats.map(processFormat),
      ...streamingData.adaptiveFormats.map(processAdaptiveFormat),
    ],
    viewedLength: playerConfig.playbackStartConfig?.startSeconds ?? 0,
    length: Number(videoDetails.lengthSeconds),
  }
}

export const processFormat = (format: PlayerFormat): std.Source => ({
  type: std.SourceType.AudioVideo,
  framerate: format.fps,
  width: format.width,
  height: format.height,
  url: format.url,
  mimetype: format.mimeType,
})

export const processAdaptiveFormat = (format: PlayerAdaptiveFormat): std.Source =>
  'audioQuality' in format ? processAdaptiveAudioFormat(format) : processAdaptiveVideoFormat(format)

export const processAdaptiveVideoFormat = (
  format: PlayerAdaptiveFormat & PlayerVideoFormat,
): std.Source<std.SourceType.Video> => ({
  type: std.SourceType.Video,
  framerate: format.fps,
  width: format.width,
  height: format.height,
  url: format.url,
  mimetype: format.mimeType,
  videoBitrate: format.bitrate,
})

export const processAdaptiveAudioFormat = (
  format: PlayerAdaptiveFormat & PlayerAudioFormat,
): std.Source<std.SourceType.Audio> => ({
  type: std.SourceType.Audio,
  url: format.url,
  mimetype: format.mimeType,
  audioBitrate: format.bitrate,
})
