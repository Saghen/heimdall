import { Renderer } from '../core/internals'
import { Accessibility } from './utility/accessibility'
import { Tracking } from './utility/tracking'
import { Icon } from './icon'

export type MetadataBadge = Renderer<
  'metadataBadge',
  {
    /** For example { iconType: "CHECK_CIRCLE_THICK" } */
    icon: Icon
    /** For example "BADGE_STYLE_TYPE_VERIFIED" */
    style: string
    /** For example "VERIFIED" */
    tooltip: string
  } & Accessibility &
    Tracking
>
