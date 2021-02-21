import XmlConfigNode from '../../../src/util/config-tree/XmlConfigNode';
import xmlToJson from '../../../src/xmlToJson';

describe('XmlConfigNode', () => {
    it('it generates from the output of xmlToJson', async () => {
        const xml = `
            <toptag type="0">
                <tag type="1">A</tag>
                <tag type="2">B</tag>
            </toptag>
            <toptag type="0">
                <tag type="1">A</tag>
                <tag type="2">B</tag>
            </toptag>
        `;
        // xmlToJson stores attributes in the $ property (an object) and children in the _ property (an array)
        /*
            For reference, the XML get turned into this JSON object by xmlToJson.
            XmlConfigNode then takes $ for setting attributes and _ for setting the value.
            All other object attributes are considered children.
            {
               "toptag":{
                  "$":{
                     "type":"0"
                  },
                  "tag":[
                     {
                        "_":"A",
                        "$":{
                           "type":"1"
                        }
                     },
                     {
                        "_":"B",
                        "$":{
                           "type":"2",
                           "attr":"value"
                        }
                     }
                  ]
               }
            }
            When parsed into a XmlConfigNode tree it should look more like this:
            {
                toptag: {
                    attributes: { type: "0" }
                    children: [
                        { key: "tag", attributes: { type: "1" }, value: "A" },
                        { key: "tag", attributes: { type: "2" }, value: "B" },
                    ]
                }
            }
         */
        const json = await xmlToJson(xml);
        const tree = new XmlConfigNode(json);

        expect(tree.children[0]).toBeDefined();
        const toptag = tree.children[0];

        expect(toptag.children[0]).toBeDefined();

        expect(toptag.children[0]).toBeDefined();
        expect(toptag.children[0].key).toBe('tag');
        expect(toptag.children[0].attributes.type).toBe('1');
        expect(toptag.children[0].value).toBe('A');
        expect(toptag.children[0].path).toBe('toptag.tag');

        expect(toptag.children[1]).toBeDefined();
        expect(toptag.children[1].key).toBe('tag');
        expect(toptag.children[1].attributes.type).toBe('2');
        expect(toptag.children[1].value).toBe('B');
        expect(toptag.children[1].path).toBe('toptag.tag');

        return json;
    });
});
