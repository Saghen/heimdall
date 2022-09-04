import { applyTo, curry, map } from 'ramda'

export const applyEach = curry((fns, x) => map(applyTo(x), fns))
