import {App} from "../components/App";
import {NodeItems} from "../types";
import {ROOT_ID} from "../utils";

type Selected = App['state']['selected'];

export function down(selection: Selected, data: NodeItems, collapsed: App['state']['collapsed']): Selected {
    const {node, head, tail} = selection;
    if (!node) {
        const root = data[ROOT_ID];
        const firstChild = root.children[0];
        return {
            node: data[firstChild],
            head: true,
            tail: false
        }
    }
    const current = data[node.id];
    const parent = data[current.parent];
    const nextSibling = getNextSibling(node.id, data);
    const isCollapsed = collapsed.has(node.id);
    const hasChildren = current.children && current.children.length > 0;
    const isRoot = node.id === ROOT_ID;

    if (tail && node.id === ROOT_ID) {
        return {
            node: current,
            head,
            tail
        }
    }

    if (head && hasChildren && !isCollapsed) {
        const firstChildId = isRoot
            ? '0'
            : node.path.concat('children', 0).join('.');

        return {
            node: data[firstChildId],
            head: true,
            tail: false
        }
    }

    if (nextSibling) {
        return {
            node: nextSibling,
            head: true,
            tail: false
        }
    } else {
        if (parent.id === ROOT_ID) {
            return {
                node: current,
                head,
                tail,
            }
        }
        return {
            node: parent,
            head: false,
            tail: true,
        }
    }
}

export function up(selection: Selected, data: NodeItems, collapsed: App['state']['collapsed']): Selected {
    const {node, head, tail} = selection;
    if (!node || (node.id ===ROOT_ID && head)) {
        return {
            node: data[ROOT_ID],
            head: true,
            tail: false
        }
    }
    const current = data[node.id];
    const hasChildren = (current.children||[]).length > 0;
    const parent = data[current.parent];
    const prevSibling = getPrevSibling(node.id, data);
    if (tail) {
        const lastChild = current.children[current.children.length-1];
        const lastChildIsCollapsed = collapsed.has(lastChild);
        const lastChildHasChildren = (data[lastChild].children||[]).length > 0;

        if (lastChildIsCollapsed) {
            return {
                node: data[lastChild],
                head: true,
                tail: false,
            }
        } else {
            if (lastChildHasChildren) {
                return {
                    node: data[lastChild],
                    head: false,
                    tail: true,
                }
            }
            return {
                node: data[lastChild],
                head: true,
                tail: false,
            }
        }
    }
    if (!prevSibling) {
        if (tail && hasChildren) {
            const lastChild = current.children[current.children.length-1];
            const lastChildHasChildren = (data[lastChild].children||[]).length > 0;
            if (!lastChildHasChildren) {
                return {
                    node: data[lastChild],
                    head: true,
                    tail: false
                };
            }
        }
        if (parent.id === ROOT_ID) {
            return {
                node: current,
                head: true,
                tail: false,
            }
        }
        return {
            node: parent,
            head: true,
            tail: false,
        }
    }
    const prevSiblingIsCollapsed = collapsed.has(prevSibling.id);
    const prevSiblingHasChildren = (prevSibling.children||[]).length > 0;
    if (prevSibling) {
        if (prevSibling.id === ROOT_ID) {
            return {
                node: current,
                head: true,
                tail: false,
            }
        }
        if (!prevSiblingIsCollapsed) {
            if (prevSiblingHasChildren) {
                return {
                    node: prevSibling,
                    head: false,
                    tail: true,
                }
            }
            return {
                node: prevSibling,
                head: true,
                tail: false,
            }
        }
        return {
            node: prevSibling,
            head: true,
            tail: false,
        }
    }
}

export function left(selection: Selected, data: NodeItems, collapsed: App['state']['collapsed']): {selected: Selected, collapsed: string[]} {
    const {node, head, tail} = selection;
    if (!node || (node.id === ROOT_ID)) {
        if (head) {
            return {
                selected: {
                    node: data[ROOT_ID],
                    head: true,
                    tail: false
                },
                collapsed: [ROOT_ID]
            }
        } else if (tail) {
            return {
                selected: {
                    node: data[ROOT_ID],
                    head: true,
                    tail: false
                },
                collapsed: []
            }
        }
    }
    const hasChildren = (node.children||[]).length > 0;
    const isCollapsed = collapsed.has(node.id);
    if (head) {
        if (isCollapsed) {
            if (node.parent == ROOT_ID) {
                return {
                    selected: {
                        node,
                        head,
                        tail,
                    },
                    collapsed: Array.from(collapsed)
                };
            }
            return {
                selected: {
                    node: data[node.parent],
                    head: true,
                    tail: false
                },
                collapsed: Array.from(collapsed)
            }
        }
        if (hasChildren) {
            if (!isCollapsed) {
                return {
                    selected: selection,
                    collapsed: [node.id]
                }
            }
        } else {
            return {
                selected: {
                    node: data[node.parent],
                    head: true,
                    tail: false
                },
                collapsed: []
            }
        }
    }
    if (tail) {
        return {
            selected: {
                node: selection.node,
                head: true,
                tail: false
            },
            collapsed: Array.from(collapsed)
        }
    }
    return {
        selected: selection,
        collapsed: Array.from(collapsed)
    }
}

export function getPrevSibling(id: string, data: NodeItems) {
    const current = data[id];
    const parent = data[current.parent];
    if (!parent) {
        return null;
    }
    const hasPrevSibling = (parent.children || []).length > current.index - 1;
    if (hasPrevSibling) {
        return data[parent.children[current.index - 1]];
    }
    return null;
}

export function getNextSibling(id, data) {
    const current = data[id];
    const parent = data[current.parent];
    if (!parent) {
        return null;
    }
    const hasNextSibling = (parent.children || []).length > current.index + 1;
    if (hasNextSibling) {
        return data[parent.children[current.index + 1]];
    }
    return null;
}
