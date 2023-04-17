import type { Writable } from 'svelte/store';

export type RichObject = TextNode[];

export type TextNode = {
    type:
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'p'
        | 'ul'
        | 'ol'
        | 'blockquote'
        | 'code'
        | 'hr';
    text: string;
    format?: Section[];
};

export type Section = {
    start: number;
    end: number;
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    style?: string;
};

export type ChildNode = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    style?: string;
};

export type RichSelectionRange = {
    start: Index;
    end: Index;
    length: number;
    totalOffset: number;
};

export type Index = {
    index: number;
    childIndex: number;
    offset: number;
};
