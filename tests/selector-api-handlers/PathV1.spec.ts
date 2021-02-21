import xmlToJson from '../../src/xmlToJson';
import XmlConfigNode from '../../src/util/config-tree/XmlConfigNode';
import PathV1 from '../../src/selector-api-handlers/PathV1';

describe('PathV1', () => {
    it('matches using attributes', async () => {
        const xml = `
            <toptag type="0">
                <tag type="1">A</tag>
                <tag type="2" attr="value">B</tag>
            </toptag>
        `;
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
            {
                toptag: {
                    children: [
                        { key: "tag", attributes... },
                        ...
                    ]
                }
            }
         */
        const json = await xmlToJson(xml);
        const tree = new XmlConfigNode(json);

        const path = new PathV1('toptag.tag<type="2" attr="value">');
        const result = path.apply(tree);
        expect(result).toBe('B');

        return json;
    });
    it('matches using subset of attributes', async () => {
        const xml = `
            <toptag type="0">
                <tag type="1">A</tag>
                <tag type="2" attr="value">B</tag>
            </toptag>
        `;
        const json = await xmlToJson(xml);
        const tree = new XmlConfigNode(json);

        const path = new PathV1('toptag.tag<type="2">');
        const result = path.apply(tree);
        expect(result).toBe('B');

        return json;
    });
    it('matches using path (selecting first child when multiple match the pattern)', async () => {
        const xml = `
            <toptag type="0">
                <tag type="1">A</tag>
                <tag type="2" attr="value">B</tag>
            </toptag>
        `;
        const json = await xmlToJson(xml);
        const tree = new XmlConfigNode(json);

        const path1 = new PathV1('toptag.tag');
        const result1 = path1.apply(tree);
        expect(result1).toBe('A');

        return json;
    });
    it('matches using indexes', async () => {
        const xml = `
            <toptag type="0">
                <tag type="1">A</tag>
                <tag type="2" attr="value">B</tag>
            </toptag>
        `;
        const json = await xmlToJson(xml);
        const tree = new XmlConfigNode(json);

        const path1 = new PathV1('toptag.tag[1]');
        const result1 = path1.apply(tree);
        expect(result1).toBe('B');

        return json;
    });
});
