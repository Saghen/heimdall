import { BaseResponse } from '@yt/core/api'
import { Renderer } from '@yt/core/internals'
import { MicroFormat } from '../micro-format'
import { PlayerConfig } from '../player-config'
import { PlayerAdaptiveFormat, PlayerFormat, StreamingData } from '../streaming-data'
import { VideoDetails } from '../video-details'

export type PlayerResponse = BaseResponse & {
  playabilityStatus: {
    status: 'OK'
    playableInEmbed: boolean
    /** Omitted */
    offlineability: Record<string, any>
    miniPlayer: Renderer<'TODO'>
    contextParams: string
  }
  /** Available formats and links to resources */
  streamingData: StreamingData
  videoDetails: VideoDetails
  microformat: MicroFormat

  /** Renderers for the items that show up at the end of the video */
  endscreen: Renderer<
    'endscreen',
    { elements: Renderer<'endscreenElement', Record<string, any>>; startMs: string }
  >

  videoQualityPromoSupportedRenderers: Record<string, any>
  captions: Record<string, any>
  storyboards: Renderer<'playerStoryboardSpec', { spec: string }>
  heartbeatParams: Record<string, any>
  playbackTracking: Record<string, any>
  attestation: Record<string, any>
  annotations: Record<string, any>[]
  playerConfig: PlayerConfig
}
