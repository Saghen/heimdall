import { CommandMetadata, Endpoint, ExtractCommand, Renderer } from '../core/internals'
import { BrowseEndpoint, Navigation } from './utility/navigation'

// FIXME: Only checked to cover tab found on channels
export type Tab<Title extends string, Content extends Renderer, Selected extends boolean> = Renderer<
  'tab',
  {
    content: Selected extends true ? Content : undefined
    selected: Selected
    title: Title
    endpoint: CommandMetadata & BrowseEndpoint
  }
>

export type TabWithIdentifier<Identifier extends string, Content extends Renderer> = Renderer<
  'tab',
  {
    selected: boolean
    content: Content
    tabIdentifier: Identifier
  }
>

// FIXME: Only checked to cover expandable tab found on channels
export type ExpandableTab<Title extends string> = Renderer<
  'expandableTab',
  Navigation & {
    expandedText: ''
    selected: boolean
    title: Title
  }
>
