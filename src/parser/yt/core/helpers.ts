import { __, pipe, cond, divide, concat, T, lte, split, filter, replace, head } from 'ramda'

export const divideByAndConcat = (divisor: number, suffix: string) => (num: number) =>
  pipe(
    (val: number) => divide(val, divisor),
    (val: number) => (divisor < 1_000_000 ? Math.floor(val) : val.toFixed(1)),
    String,
    concat(__, suffix)
  )(num)

export const toShortHumanReadable = cond([
  [lte(1_000_000_000), divideByAndConcat(1_000_000_000, 'B')],
  [lte(1_000_000), divideByAndConcat(1_000_000, 'M')],
  [lte(1_000), divideByAndConcat(1_000, 'K')],
  [T, divideByAndConcat(1, '')],
]) as (viewCount: number) => string

/**
 * Text must be in the form "123,345 views"
 * Grabbed from richItemRenderer.content.videoRenderer.viewCountText
 */
export function humanReadableToNumber(text: string): number {
  return Number(
    text
      .split(/([\d,]+)/)
      .filter(Boolean)[0]
      .replaceAll(',', '')
  )
}

/**
 * Converts from "20:36" to the number of seconds.
 * Ex. 20:36 -> 20 * 60 + 36 -> 1236
 */
export function durationTextToSeconds(simpleText: string): number {
  return simpleText
    .split(':')
    .reverse() // Seconds, Minutes, Hours, etc..
    .map((val, i) => +val * 60 ** i) // Seconds 60 ** 0 (1), Minutes 60 ** 1 (60), etc...
    .reduce((a, b) => a + b, 0) // Add seconds together
}

export const parseViewCount = pipe(
  split(/([\d,]+)/),
  filter(Boolean),
  head,
  replace(/,/g, ''),
  Number
)
