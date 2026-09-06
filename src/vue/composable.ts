import {
  ComponentPublicInstance,
  computed,
  ComputedGetter,
  isRef,
  MaybeRefOrGetter,
  onMounted,
  onUnmounted,
  readonly,
  ref,
  Ref,
  shallowRef,
  ShallowRef,
  toValue,
  watch
} from 'vue'
import { MaskaDetail, MaskInput, MaskInputOptions } from '../input'

const DEFAULT_MODEL_TYPE = 'unmasked'

export type MaybeElement<T extends HTMLElement = HTMLElement> = T | ComponentPublicInstance | undefined | null
export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>

export type RefOrGetter<T> = Ref<T> | ComputedGetter<T>

export function unrefElement<T extends MaybeElement>(elRef: MaybeComputedElementRef<T>): T | undefined {
  const plain = toValue(elRef)
  return (plain as ComponentPublicInstance)?.$el ?? plain
}

export function isRefOrGetter<T>(value: MaybeRefOrGetter<T>): value is RefOrGetter<T> {
  return isRef(value) || typeof value === 'function'
}

export type MaskElement = MaybeElement<HTMLInputElement>

export interface UseMaskaReturn {
  masked: Readonly<Ref<string>>
  unmasked: Readonly<Ref<string>>
  completed: Readonly<Ref<boolean>>
  instance: Readonly<ShallowRef<MaskInput>>
}

export type MaskaElementTarget = MaybeComputedElementRef<MaskElement>
export type MaskaSelectorTarget = string

interface UseMaskaModelType {
  modelType?: 'masked' | 'unmasked'
}

export type MaskaPattern = MaybeRefOrGetter<string>
export type MaskaConfig = MaybeRefOrGetter<Partial<MaskInputOptions> & UseMaskaModelType>
export type MaskaModel = Ref<string | undefined> | undefined

export function useMaska(target: MaskaElementTarget, pattern: MaskaPattern, model?: Ref<string>): UseMaskaReturn
export function useMaska(target: MaskaElementTarget, config: MaskaConfig, model?: Ref<string>): UseMaskaReturn
export function useMaska(selector: MaskaSelectorTarget, pattern: MaskaPattern, model?: Ref<string>): UseMaskaReturn
export function useMaska(selector: MaskaSelectorTarget, config: MaskaConfig, model?: Ref<string>): UseMaskaReturn

export function useMaska(
  target: MaskaElementTarget | MaskaSelectorTarget,
  options: MaskaPattern | MaskaConfig,
  model: MaskaModel = undefined
): UseMaskaReturn {
  let prevTarget: HTMLInputElement | undefined | null
  const instance = shallowRef<MaskInput>()

  const masked = ref('')
  const unmasked = ref('')
  const completed = ref(false)

  const modelType = computed(() => {
    const plainOptions = toValue(options)

    if (typeof plainOptions === 'string') {
      return DEFAULT_MODEL_TYPE
    }

    if ((plainOptions as UseMaskaModelType)?.modelType !== undefined) {
      return (plainOptions as UseMaskaModelType).modelType ?? DEFAULT_MODEL_TYPE
    }

    return DEFAULT_MODEL_TYPE
  })

  function getTarget(): Exclude<MaskElement, ComponentPublicInstance> {
    let el

    if (isRefOrGetter(target)) {
      el = toValue(target)
    }

    if (typeof el === 'string') {
      return document.querySelector(el)
    }

    if (el != null) {
      return unrefElement(el) as Exclude<MaskElement, ComponentPublicInstance>
    }

    return undefined
  }

  if (model != null) {
    watch(model, value => {
      if (instance.value === undefined) {
        return
      }

      const targetValue = modelType.value === 'masked' ? masked.value : unmasked.value

      if (targetValue === value) {
        return
      }

      const target = getTarget()

      if (target != null) {
        target.value = value ?? ''
      }
    })
  }

  function onMaska(detail: MaskaDetail): void {
    masked.value = detail.masked
    unmasked.value = detail.unmasked
    completed.value = detail.completed

    if (model != null) {
      model.value = modelType.value === 'masked' ? detail.masked : detail.unmasked
    }
  }

  function createConfig(): MaskInputOptions {
    const optionsValue = toValue(options)

    if (typeof optionsValue === 'string') {
      return {
        onMaska,
        mask: optionsValue
      }
    }

    return {
      ...optionsValue,
      onMaska
    }
  }

  function initialize(): void {
    prevTarget = getTarget()

    if (prevTarget == null) {
      return
    }

    instance.value = new MaskInput(prevTarget, createConfig())

    if (model != null) {
      prevTarget.value = model.value ?? ''
    }
  }

  function refresh(): void {
    if (instance.value === undefined) {
      initialize()
      return
    }

    if (prevTarget !== target) {
      destroy()
      initialize()
    }
  }

  function update(): void {
    instance.value?.update(createConfig())
  }

  function destroy(): void {
    instance.value?.destroy()
  }

  if (isRefOrGetter(target)) {
    watch(() => unrefElement(target), value => {
      if (value != null) refresh()
    })
  }

  if (isRefOrGetter(options)) {
    watch(() => toValue(options as RefOrGetter<MaskInputOptions>), value => {
      if (value) update()
    }, { deep: true })
  }

  onMounted(initialize)
  onUnmounted(destroy)

  return {
    masked: readonly(masked),
    unmasked: readonly(unmasked),
    completed: readonly(completed),
    instance: readonly(instance)
  }
}
