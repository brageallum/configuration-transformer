import SelectorApi from './SelectorApi';
import ConfigNode from '../util/config-tree/ConfigNode';
import findInTree from '../util/findInTree';

export default class SimplePath extends SelectorApi {
    public readonly name = 'path-simple';

    apply(node: ConfigNode): string {
        const configNodes = findInTree(node, [
            node => node.path === this._method,
        ]);
        return configNodes[0].value || '';
    }
}
