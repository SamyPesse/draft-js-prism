/// <reference types="draft-js" />
/// <reference types="react" />
/// <reference types="immutable" />

import * as React from 'react';
import * as Draft from 'draft-js';
import * as Immutable from 'immutable';

export default class PrismDecorator {
    highlighted: any;
    constructor(options?: IPrismOptions);
    /**
     * Return list of decoration IDs per character
     *
     * @param {ContentBlock}
     * @return {List<String>}
     */
    getDecorations(block: any): Immutable.List<string>;
    /**
     * Return component to render a decoration
     *
     * @param {String}
     * @return {Function}
     */
    getComponentForKey(key: any): (props: any) => React.DOMElement<any, any>;
    /**
     * Return props to render a decoration
     *
     * @param {String}
     * @return {Object}
     */
    getPropsForKey(key: any): {
        type: any;
    };
}

export interface IPrismOptions {
    defaultSyntax?: string;
    getSyntax?: (block: Draft.ContentBlock) => string;
    render?: (props: any) => React.DOMElement<any, any>;
    blockFilter?: (block: Draft.ContentBlock) => boolean;
}
