import ConfigNode from '../util/config-tree/ConfigNode';

export default abstract class SelectorApi {
    protected readonly _method: string;
    public abstract readonly name: string;

    constructor(method: string) {
        this._method = method;
    }

    public abstract apply(node: ConfigNode): string;
}
