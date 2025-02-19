import type { ComputedRef, MaybeRef } from 'vue'

declare global{
  type Nullable<T> = T | null

  type Undefinable<T> = T | undefined

  type Recordable<T = any> = Record<string, T>

  type MaybePromise<T> = T | Promise<T>

  type AnyFunction = (...args: any[]) => any

  // 将 T 的每个属性类型用 MaybeRef 包裹
  type WrapWithMaybeRef<T extends Recordable> = {
    [K in keyof T]: MaybeRef<T[K]>
  }

  // 将 T 的每个属性类型用 ComputedRef 包裹
  type WrapWithComputed<T extends Recordable> = {
    [K in keyof T]: ComputedRef<T[K]>;
  }
}
