import xmlToJson from '../src/xmlToJson';

describe('xmlToJson', () => {
    it('happy path', async () => {
        const json: any = await xmlToJson(
            '<myTag my-attribute="Attribute text">Text</myTag>',
        );

        expect(json.myTag).toBeDefined();
        expect(json.myTag[0]._).toBe('Text');
        expect(json.myTag[0].$).toBeDefined();
        expect(json.myTag[0].$['my-attribute']).toBe('Attribute text');

        return json;
    });

    it('can parse multiple root elements', async () => {
        const json: any = await xmlToJson(
            '<myTag my-attribute="Attribute text 1">Text 1</myTag><myTag my-attribute="Attribute text 2">Text 2</myTag>',
        );

        expect(json.myTag).toBeDefined();
        expect(json.myTag[0]._).toBe('Text 1');
        expect(json.myTag[0].$).toBeDefined();
        expect(json.myTag[0].$['my-attribute']).toBe('Attribute text 1');

        expect(json.myTag).toBeDefined();
        expect(json.myTag[1]._).toBe('Text 2');
        expect(json.myTag[1].$).toBeDefined();
        expect(json.myTag[1].$['my-attribute']).toBe('Attribute text 2');

        return json;
    });
});
