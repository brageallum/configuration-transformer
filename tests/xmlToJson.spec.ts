import xmlToJson from '../src/xmlToJson';

describe('xmlToJson', () => {
    it('happy path', async () => {
        const json: any = await xmlToJson('<myTag my-attribute="Attribute text">Text</myTag>');

        expect(json.myTag).toBeDefined();
        expect(json.myTag._).toBe("Text");
        expect(json.myTag.$).toBeDefined();
        expect(json.myTag.$['my-attribute']).toBe("Attribute text");

        return json;
    });
});
