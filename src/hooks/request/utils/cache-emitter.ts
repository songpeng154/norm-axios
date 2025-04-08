import type { CachedData } from './cache.ts'
import mitt from 'mitt'

const cacheEmitter = mitt<Record<string, CachedData>>()

export default cacheEmitter
