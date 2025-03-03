import type { ComputedRef, MaybeRef } from 'vue'

export type Nullable<T> = T | null

export type Undefinable<T> = T | undefined

export type Recordable<T = any> = Record<string, T>

export type MaybePromise<T> = T | Promise<T>

export type AnyFunction = (...args: any[]) => any

// 将 T 的每个属性类型用 MaybeRef 包裹
export type WrapWithMaybeRef<T extends Recordable> = {
  [K in keyof T]: MaybeRef<T[K]>
}

// 将 T 的每个属性类型用 ComputedRef 包裹
export type WrapWithComputed<T extends Recordable> = {
  [K in keyof T]: ComputedRef<T[K]>;
}
