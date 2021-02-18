import XmlConfigNode from '../../../../src/util/config-tree/XmlConfigNode';
import xmlToJson from '../../../../src/xmlToJson';

describe('XmlConfigNode', () => {
    it('it generates from the output of xmlToJson', async () => {
        // xmlToJson stores attributes in the $ property (an object) and children in the _ property (an array)
        const xml = `
            <toptag type="0">
                <tag type="1">A</tag>
                <tag type="2">B</tag>
            </toptag>
        `;
        const json = await xmlToJson(xml);
        const tree = new XmlConfigNode(json);

        expect(tree.children[0]).toBeDefined();
        const toptag = tree.children[0];

        expect(toptag.children[0]).toBeDefined();
        const tag = toptag.children[0];

        expect(tag.children[0]).toBeDefined();
        expect(tag.children[0].attributes.type).toBe('1');
        expect(tag.children[0].value).toBe('A');
        expect(tag.children[0].path).toBe('toptag.tag[0]');

        expect(tag.children[1]).toBeDefined();
        expect(tag.children[1].attributes.type).toBe('2');
        expect(tag.children[1].value).toBe('B');
        expect(tag.children[1].path).toBe('toptag.tag[1]');

        return json;
    });
});
