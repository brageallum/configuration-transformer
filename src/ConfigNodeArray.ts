import ConfigNode from './ConfigNode';
import Json from './util/types/Json';

export default class ConfigNodeArray extends Array<ConfigNode> {
    includes(searchElement: Json, fromIndex?: number): boolean {
        return [...this]
            .map(child => child.value)
            .includes(searchElement, fromIndex);
    }
}
