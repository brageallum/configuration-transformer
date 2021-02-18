import ConfigNode, { ConfigNodeOptions } from './ConfigNode';
import Json from '../types/Json';
import StringMap from '../types/StringMap';

export default class XmlConfigNode extends ConfigNode {
    constructor(
        json: Json,
        { parent, key, attributes = {} }: ConfigNodeOptions = {},
    ) {
        // @ts-ignore
        const $ = <StringMap>json['$'];
        // @ts-ignore
        delete json['$'];

        // @ts-ignore
        const _ = <StringMap>json['_'];
        // @ts-ignore
        delete json['_'];

        super(json, {
            parent,
            key,
            attributes: { ...$, ...attributes },
        });

        // @ts-ignore
        this._value = _;
    }
}
