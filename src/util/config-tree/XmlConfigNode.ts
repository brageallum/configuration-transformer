import ConfigNode, { ConfigNodeOptions } from './ConfigNode';
import Json from '../types/Json';
import StringMap from '../types/StringMap';
import ConfigNodeArray from './ConfigNodeArray';

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

    protected _extractChildren(json: Json): ConfigNodeArray {
        const array = new ConfigNodeArray();

        Object.keys(json).forEach(key => {
            // @ts-ignore
            const childArray: Json[] = <Json[]>json[key];

            childArray.forEach(child => {
                array.push(
                    // @ts-ignore
                    new this.constructor(child, {
                        parent: this,
                        key,
                    }),
                );
            });
        });

        return array;
    }
}
