import SelectorApi from './SelectorApi';
import ConfigNode from '../util/config-tree/ConfigNode';
import StringMap from '../util/types/StringMap';

interface PathNode {
    key: string;
    attributes: StringMap;
    childIndex?: number;
}

export default class PathV1 extends SelectorApi {
    public readonly name = 'path-simple';
    private _pathNodes: PathNode[] = [];

    private _nodeRegex = /^(?<key>\w+)(?<attributes><(?:\w+="\w+"\s?)*>)?(?:\[(?<childIndex>\d+)\])?\.?/;
    private _attributeRegex = /(?<name>\w+)="(?<value>\w+)"/;

    constructor(method: string) {
        super(method);

        while (method.length > 0) {
            const pathNode = this._getPathNode(method);

            if (!pathNode.key) {
                throw new Error('Invalid method: ' + this._method);
            }

            this._pathNodes.push(pathNode);

            method = method.replace(this._nodeRegex, '');
        }
    }

    private _getPathNode(method: string): PathNode {
        const nodeResult = this._nodeRegex.exec(method);
        const nodeGroups = <StringMap>(nodeResult ? nodeResult.groups : {});
        const { key, childIndex } = nodeGroups;
        const attributeString = nodeGroups.attributes;

        const attributes = attributeString
            ? this._getPathAttributes(attributeString)
            : {};

        return {
            key,
            attributes,
            childIndex: parseInt(childIndex) || undefined,
        };
    }

    private _getPathAttributes(attributeString: string) {
        const substrings = attributeString.split(' ');
        const attributes: StringMap = {};

        substrings.forEach(substring => {
            const substringResult = this._attributeRegex.exec(substring);
            const substringGroups = <StringMap>(
                (substringResult ? substringResult.groups : {})
            );
            const { name, value } = substringGroups;
            attributes[name] = value;
        });

        return attributes;
    }

    apply(node: ConfigNode): string {
        for (const pathNode of this._pathNodes) {
            const childrenMatchingKeyRequirement = node.children.filter(
                child => child.key === pathNode.key,
            );
            if (Object.keys(pathNode.attributes).length > 0) {
                const matches = childrenMatchingKeyRequirement.filter(child =>
                    this._matchesAttributes(child, pathNode),
                );
                node = matches[0];
            } else if (pathNode.childIndex) {
                node = childrenMatchingKeyRequirement[pathNode.childIndex];
                break;
            } else {
                node = childrenMatchingKeyRequirement[0];
            }
        }

        return (node || {}).value || '';
    }

    private _matchesAttributes(cn: ConfigNode, pn: PathNode) {
        return Object.keys(pn.attributes).reduce((accumulator, key) => {
            return accumulator && cn.attributes[key] === pn.attributes[key];
        }, cn.attributeAmount > 0);
    }
}
