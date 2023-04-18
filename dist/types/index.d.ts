export type RichObject = TextNode[];

export type TextNode = {
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'ul' | 'ol' | 'blockquote' | 'code' | 'hr';
    text: string;
    format?: FormatSection[];
};

export type FormatSection = {
    start: number;
    end: number;
} & { [key in HtmlFormat]?: boolean | undefined };

export type HtmlFormat = 'b' | 'i' | 'code' | 'u' | 'span' | 'a' | 'img';

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
