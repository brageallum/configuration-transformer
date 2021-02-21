import ConfigNode from './config-tree/ConfigNode';
import _ from 'lodash';

export default function findMultipleConfigNodesInTree(
    tree: ConfigNode,
    matchers: Matcher[],
): ConfigNode[] {
    return new ConfigNodeMatcher(tree, matchers).matchedNodes;
}

type Matcher = (node: ConfigNode) => boolean;

class ConfigNodeMatcher {
    private _matchedNodes: ConfigNode[] = [];

    get matchedNodes(): ConfigNode[] {
        return _.cloneDeep(this._matchedNodes);
    }

    constructor(tree: ConfigNode, matchers: Matcher[]) {
        this._findMatches(tree, matchers);
    }

    private _findMatches(node: ConfigNode, matchers: Matcher[]) {
        if (
            matchers.reduce(
                (matches, matcher) => matches && matcher(node),
                true,
            )
        ) {
            this._matchedNodes.push(node);
        }
        node.children.forEach(
            node => node && this._findMatches(node, matchers),
        );
    }
}
