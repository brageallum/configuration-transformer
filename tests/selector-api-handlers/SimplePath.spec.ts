import SimplePath from '../../src/selector-api-handlers/SimplePath';
import ConfigNode from '../../src/util/config-tree/ConfigNode';

describe('SimplePath', () => {
    it('matches basic paths', () => {
        const json = { path: { to: { node: 'my value' } } };
        const tree = new ConfigNode(json);
        const path = new SimplePath('path.to.node');
        const result = path.apply(tree);

        expect(result).toBe('my value');
    });
});
