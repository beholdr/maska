export default class Maska {
    constructor(el: any, opts?: {});
    _opts: {
        mask: any;
        tokens: any;
        preprocessor?: (value: string) => string;
    };
    _el: any;
    init(): void;
    destroy(): void;
    updateValue(el: any, evt: any): void;
    beforeInput(e: any): void;
}
