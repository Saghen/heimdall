import * as std from '@std'
import { combineSomeText } from '@yt/components/text'
import { durationTextToSeconds } from '@yt/core/helpers'
import { findRenderer } from '@yt/core/internals'
import { subYears, subMonths, subDays, subHours, subMinutes, subSeconds } from 'date-fns'
import { BaseVideo } from './regular'

export const getLength = (lengthText: BaseVideo['lengthText']): number =>
  lengthText && durationTextToSeconds(combineSomeText(lengthText))
export const getViewedLength = (
  thumbnailOverlays: BaseVideo['thumbnailOverlays'],
  length: number | undefined
) => {
  const viewedPercent = findRenderer('thumbnailOverlayResumePlayback')(
    thumbnailOverlays
  )?.percentDurationWatched
  if (viewedPercent === undefined || length === undefined) return
  return (length * viewedPercent) / 100
}

export const relativeToAbsoluteDate = (relativeDate: string): Date => {
  const date = new Date()
  const value = Number(relativeDate.split(' ')[0])
  if (isNaN(value)) throw Error('Failed to parse date')

  if (relativeDate.includes('year')) return subYears(date, value)
  if (relativeDate.includes('month')) return subMonths(date, value)
  if (relativeDate.includes('day')) return subDays(date, value)
  if (relativeDate.includes('hour')) return subHours(date, value)
  if (relativeDate.includes('minute')) return subMinutes(date, value)
  if (relativeDate.includes('second')) return subSeconds(date, value)

  throw Error('Failed to parse date')
}
