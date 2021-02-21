import _ from 'lodash';
import ConfigNodeArray from './ConfigNodeArray';
import StringMap from '../types/StringMap';
import Json from '../types/Json';
import JsonObject from '../types/JsonObject';

type ConfigNodeKey = string | number;
type ConfigNodeType = 'value' | 'object' | 'array';

export interface ConfigNodeOptions {
    parent?: ConfigNode;
    key?: ConfigNodeKey;
    attributes?: StringMap;
}

export default class ConfigNode {
    protected _children: ConfigNodeArray;
    protected _attributes: StringMap;
    protected _type: ConfigNodeType;
    protected _key: ConfigNodeKey;
    protected _parent?: ConfigNode;
    protected _path: string;
    protected _value?: string;

    get parent(): ConfigNode | undefined {
        return this._parent;
    }
    get hasParent(): boolean {
        return !!this._parent;
    }
    get path(): string {
        return this._path;
    }
    get type(): ConfigNodeType {
        return this._type;
    }
    get value(): string | undefined {
        return this._value;
    }
    get children(): ConfigNodeArray {
        return this._children;
    }
    get attributes(): StringMap {
        return this._attributes;
    }
    get attributeAmount(): number {
        return Object.keys(this._attributes).length;
    }
    get key(): ConfigNodeKey {
        return this._key;
    }

    constructor(
        json: Json,
        { parent, key, attributes }: ConfigNodeOptions = {},
    ) {
        this._parent = parent;
        if (!!key || key === '' || key === 0) {
            this._key = key;
        } else {
            this._key = '';
        }
        this._attributes = attributes || {};

        this._path = this._buildPath();

        if (_.isPlainObject(json)) {
            this._type = 'object';
        } else if (_.isArray(json)) {
            this._type = 'array';
        } else {
            this._value = <string>json;
            this._type = 'value';
        }

        this._children = this._extractChildren(json);
    }

    private _buildPath(): string {
        if (this._parent) {
            const parentPath: string = this._parent.path || '';

            if (this._parent.type === 'array') {
                return `${parentPath}[${this._key}]`;
            } else {
                return parentPath === ''
                    ? this._key.toString()
                    : `${parentPath}.${this._key}`;
            }
        }
        return '';
    }

    protected _extractChildren(json: Json): ConfigNodeArray {
        if (this._type === 'object') {
            return this._objectChildrenToNodeArray(json);
        } else if (this._type === 'array') {
            return this._arrayChildrenToNodeArray(json);
        } else {
            return new ConfigNodeArray();
        }
    }

    protected _objectChildrenToNodeArray(json: Json): ConfigNodeArray {
        const jsonObject = <JsonObject>json;
        return new ConfigNodeArray(
            ...Object.keys(jsonObject).map(
                (childKey: string) =>
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    new this.constructor(<Json>jsonObject[childKey], {
                        parent: this,
                        key: childKey,
                    }),
            ),
        );
    }

    protected _arrayChildrenToNodeArray(json: Json): ConfigNodeArray {
        const jsonArray = <Json[]>json;
        return new ConfigNodeArray(
            ...jsonArray.map(
                (child: Json, index: number) =>
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    new this.constructor(child, {
                        parent: this,
                        key: index,
                    }),
            ),
        );
    }
}
