import ConfigNode from './ConfigNode';

export default class ConfigNodeArray extends Array<ConfigNode> {
    includes(searchElement: string | ConfigNode, fromIndex?: number): boolean {
        if (typeof searchElement !== 'string') {
            return super.includes(searchElement, fromIndex);
        }
        return [...this]
            .map(child => child.value)
            .includes(searchElement, fromIndex);
    }
}
