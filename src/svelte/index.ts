import { MaskInput, type MaskInputOptions } from 'maska';

const masks = new WeakMap<HTMLInputElement, MaskInput>();

function getMaskOptions(opts: MaskInputOptions) {
  if (typeof opts === 'string') {
    return { mask: opts };
  }
  return opts;
}

export function mask(opts: MaskInputOptions) {
  return (element: HTMLInputElement | HTMLElement) => {
    const input =
      element instanceof HTMLInputElement
        ? element
        : element.querySelector('input');

    if (input == null || input?.type === 'file') return;

    masks.set(input, new MaskInput(input, getMaskOptions(opts)));

    $effect(() => {
      masks.get(input)?.update(getMaskOptions(opts));
    });

    return () => masks.get(input)?.destroy();
  };
}
