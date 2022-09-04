import {
  CommandMetadata,
  ExtractCommand,
  Renderer,
  ServiceEndpoint,
  Some,
  SubCommand,
} from '@yt/core/internals'
import { Icon } from './icon'
import { Text } from './text'
import { Thumbnail } from './thumbnail'
import { BrowseEndpoint, Navigation, ReelWatchEndpoint } from './utility/navigation'

export type GuideSection<Item extends Renderer> = Renderer<
  'guideSection',
  {
    items: Item[]
  }
>

export type SubscriptionsGuideSection<Item extends Renderer> = Renderer<
  'guideSubscriptionsSection',
  {
    /** TODO: Other possible values? */
    sort: 'CHANNEL_RELEVANCE'
    items: Item[]
    formattedTitle: Some<Text>
    /**
     * Values such as GUIDE_ACTION_ADD_TO_SUBSCRIPTIONS and GUIDE_ACTION_REMOVE_FROM_SUBSCRIPTIONS
     * Doesn't seem relevant so not typing as constants
     */
    handlerDatas: string[]
  }
>

export type CollapsibleGuideSectionEntry<Header extends Renderer<'guideEntry'>, Item extends Renderer> = Renderer<
  'guideCollapsibleSectionEntry',
  {
    headerEntry: Header
    expanderIcon: Icon
    collapserIcon: Icon
    sectionsItems: Item[]
    /**
     * Values such as GUIDE_ACTION_ADD_TO_SUBSCRIPTIONS and GUIDE_ACTION_REMOVE_FROM_SUBSCRIPTIONS
     * Doesn't seem relevant so not typing as constants
     */
    handlerDatas: string[]
  }
>

export type ChannelGuideEntry = Renderer<
  'guideEntry',
  {
    thumbnail: Thumbnail
    badges: { liveBroadcasting?: boolean }
    formattedTitle: Some<Text>
    entryData: {
      guideEntryData: {
        guideEntryId: string
      }
    }
    /** TODO: Maybe incomplete */
    presentationStyle: 'GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT' | 'GUIDE_ENTRY_PRESENTATION_STYLE_NONE'
  } & Navigation<BrowseEndpoint & CommandMetadata>
>

export type ButtonGuideEntry<Command extends SubCommand | undefined = undefined> = Renderer<
  'guideEntry',
  {
    icon: Icon
    formattedTitle: Some<Text>
    thumbnail?: Thumbnail
    isPrimary?: boolean
  } & ExtractCommand<Command>
>
export type BrowseGuideEntry = ButtonGuideEntry<Navigation<BrowseEndpoint & CommandMetadata>>
export type ReelGuideEntry = ButtonGuideEntry<ServiceEndpoint<'reel', ReelWatchEndpoint & CommandMetadata>>

export type CollapsibleGuideEntry<
  ExpanderItem extends Renderer,
  CollapserItem extends Renderer,
  ExpandableItems extends Renderer,
> = Renderer<
  'guideCollapsibleEntry',
  {
    expanderItem: ExpanderItem
    expandableItems: ExpandableItems[]
    collapserItem: CollapserItem
  }
>
