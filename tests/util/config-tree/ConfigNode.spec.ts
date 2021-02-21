import ConfigNode from '../../../src/util/config-tree/ConfigNode';
import ConfigNodeArray from '../../../src/util/config-tree/ConfigNodeArray';

describe('ConfigNode', () => {
    it('wraps around a string', () => {
        const str = 'Hello World!';
        const node = new ConfigNode(str);

        expect(node.type).toBe('value');
        expect(node.hasParent).toBeFalsy();
        expect(node.path).toBe('');
        expect(node.value).toBe(str);
    });

    it('wraps around an object', () => {
        const obj = { attr: 'child', subobj: { subobjattr: 'subobjchild' } };
        const node = new ConfigNode(obj);

        expect(node.type).toBe('object');

        expect(node.children[0]).toBeDefined();
        expect(node.children[0].value).toBe(obj.attr);
        expect(node.children[0].path).toBe('attr');

        expect(node.children[1]).toBeDefined();
        node.children[1].children.includes(obj.subobj.subobjattr);
        expect(
            node.children[1].children.includes(obj.subobj.subobjattr),
        ).toBeTruthy();
        expect(node.children[1].children[0].path).toBe('subobj.subobjattr');
    });

    it('wraps around an array', () => {
        const arr = ['val1', 'val2'];
        const node = new ConfigNode(arr);

        expect(node.type).toBe('array');

        expect(node.children.includes('val1')).toBeTruthy();

        expect(node.children[0]).toBeDefined();
        expect(node.children[0].value).toBe('val1');
        expect(node.children[0].path).toBe('[0]');

        expect(node.children[1]).toBeDefined();
        expect(node.children[1].value).toBe('val2');
        expect(node.children[1].path).toBe('[1]');
    });
});
