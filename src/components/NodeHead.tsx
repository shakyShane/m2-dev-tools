import * as React from 'react';
import {NodeId, NodeItem, NodePath} from "../types";
import {NodeAttr} from "./NodeAttr";
import * as  classnames from 'classnames';

export interface NodeInfoProps {
    node: NodeItem,
    indent: number,
    isHovered: boolean,
    isCollapsed: boolean,
    isSelected: boolean,
    hasChildren: boolean,
    searchTerm: string,
    toggle(id: NodeId): void,
    select(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
    addHover(id: NodeId, path: NodePath, pos: {head: boolean, tail: boolean}): void,
}

export function NodeHead(props: NodeInfoProps) {
    const {node, indent, addHover, hasChildren, isCollapsed, isSelected, select} = props;
    if (node.id === '$$root') {
        return null;
    }
    const classes = classnames({
        node_info: true,
        'node_info--hovered': props.isHovered,
        'node_info--selected': props.isSelected
    });
    const nodeName = node.data && node.data.type;
    return (
        <div style={{paddingLeft: String(indent) + 'px'}}
             className={classes}
             onMouseEnter={() => addHover(node.id, node.path, {head: true, tail: false})}
             onClick={(e) => select(node.id, node.path, {head: true, tail: false})}>
            <p className="node__line">
                {hasChildren && (
                    <button
                        className="node__toggle"
                        type="button"
                        onClick={(e) => {
                            // don't let toggles propagate to node line
                            e.preventDefault();
                            e.stopPropagation();
                            props.toggle(node.id)
                        }}
                    >
                        <svg
                            className="arrow"
                            height="7"
                            fill={isSelected ? 'white' : 'black'}
                            viewBox="0 0 50 50"
                            transform={`${isCollapsed ? 'rotate(-90)' : ''}`}
                            id="canvas">
                            <polygon points="0,0 50,0 25.0,43.3"></polygon>
                        </svg>
                    </button>
                )}
                <span className="token lt">&lt;</span>
                <span className="token token--name">{nodeName}</span>
                <NodeAttr
                    data={node.data}
                    dataKey={'name'}
                    attrName={'name'}
                    searchTerm={props.searchTerm}
                />
                <NodeAttr
                    data={(node.data as any)}
                    dataKey={'template_file'}
                    attrName={'template'}
                    searchTerm={props.searchTerm}
                />
                {!hasChildren && (
                    <span className="token gt">{' /'}</span>
                )}
                <span className="token gt">&gt;</span>
                <span className="token token--icon">
                    {node.hasRelatedElement && (
                        <SyncIcon />
                    )}
                </span>
            </p>
            <div className="node__props">
                {node.data && Object.keys(node.data).map(key => {
                    const value = node.data[key];
                    if (typeof value === 'string') {
                        return (
                            <p key={key}>
                                <span className="token token--key">{key}:</span>
                                {' '}
                                <span className="token token--value">{node.data[key]}</span>
                            </p>
                        )
                    }
                })}
            </div>
        </div>
    )
}

function SyncIcon() {
    return (
        <svg height="10px" version="1.1" viewBox="0 0 16 16">
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g fill="#777777" id="Group" transform="translate(-192.000000, -192.000000)">
                    <path d="M201,205.917042 C203.512502,205.49553 205.495527,203.512505 205.917042,201 L203,201 L203,199 L205.917042,199 C205.495527,196.487495 203.512502,194.50447 201,194.082958 L201,197 L199,197 L199,194.082958 C196.487498,194.50447 194.504473,196.487495 194.082958,199 L197,199 L197,201 L194.082958,201 C194.504473,203.512505 196.487498,205.49553 199,205.917042 L199,203 L201,203 Z M200,208 C195.581722,208 192,204.418278 192,200 C192,195.581722 195.581722,192 200,192 C204.418278,192 208,195.581722 208,200 C208,204.418278 204.418278,208 200,208 Z M200,208"/>
                </g>
            </g>
        </svg>
    )
}