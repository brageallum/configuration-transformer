import { parseStringPromise } from 'xml2js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function xmlToJson(xml: string): Promise<any> {
    return parseStringPromise(xml);
}
