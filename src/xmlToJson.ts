import { parseStringPromise } from 'xml2js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function xmlToJson(xml: string): Promise<any> {
    const xmlWrapper = `<root>${xml}</root>`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await parseStringPromise(xmlWrapper);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return json.root;
}
