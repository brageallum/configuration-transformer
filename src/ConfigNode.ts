import _ from 'lodash';
import ConfigNodeArray from './ConfigNodeArray';
import StringMap from './util/types/StringMap';
import Json from './util/types/Json';
import JsonObject from './util/types/JsonObject';

type ConfigNodeKey = string | number;
type ConfigNodeType = 'value' | 'object' | 'array';

interface ConfigNodeOptions {
    parent?: ConfigNode;
    key?: ConfigNodeKey;
    attributes?: StringMap;
}

export default class ConfigNode {
    private readonly _children: ConfigNodeArray;
    private readonly _attributes: StringMap;
    private readonly _type: ConfigNodeType;
    private readonly _key: ConfigNodeKey;
    private readonly _parent?: ConfigNode;
    private readonly _path: string;
    private readonly _value?: string;

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
            this._children = this._objectChildrenToNodeArray(json);
        } else if (_.isArray(json)) {
            this._type = 'array';
            this._children = this._arrayChildrenToNodeArray(json);
        } else {
            this._value = <string>json;
            this._type = 'value';
            this._children = new ConfigNodeArray();
        }
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

    private _objectChildrenToNodeArray(json: Json) {
        const jsonObject = <JsonObject>json;
        return new ConfigNodeArray(
            ...Object.keys(jsonObject).map(
                (childKey: string) =>
                    new ConfigNode(<Json>jsonObject[childKey], {
                        parent: this,
                        key: childKey,
                    }),
            ),
        );
    }

    private _arrayChildrenToNodeArray(json: Json) {
        const jsonArray = <Json[]>json;
        return new ConfigNodeArray(
            ...jsonArray.map(
                (child: Json, index: number) =>
                    new ConfigNode(child, {
                        parent: this,
                        key: index,
                    }),
            ),
        );
    }
}
