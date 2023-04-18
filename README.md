# Rich Text for Svelte

A rich editor, different than most others, because in it's object representation it separates the text from the formatting.
It is aspiring to become the most minimalistic most customizable rich-text-editor of all time.
It's bundle size is only 7.2 kB!!!

!!! Attention the editor is not production ready and still contains some known bugs !!!

## Demo

The Demo can be found at:
[sveltehack.maxelia.com](https://sveltehack.maxelia.com)

## Usage

Install the package:

```
npm install svelte-rich-text
# or yarn, pnpm, etc.
```

Import the components you need:

```svelte
<script>
	import { RichEditor, html } from 'svelte-rich-text';

	let startContent = [
        {
            type: 'h1',
            text: "Rich's favourite rich-text-editor",
        },
        {
            type: 'p',
            text: "This rich editor is different than most others.",
            format: [
                {
                    start: 20,
                    end: 29,
                    i: true,
                },
            ],
        },
    ];
</script>

<RichEditor content={startContent} />
```

The `html` export is a svelte store which is constantly updated. This can be handy if clean html has to be exported.

In order to use it use it like any other svelte store:

```svelte
<script>
    import { RichEditor, html } from 'svelte-rich-text';

    html.subscribe((value) => {
        saveHtml(value)
    });
</script>
<div>
    {@html $html}
</div>
```

## Docs

Unlike most other available rich-text-editors, which constantly split up text in small chuncks on format changes, this one simply stores the text separately from the formatting and only updates the format in the object representation without triggering a re-render of the DOM inside the editor.

The object representation is an array of TextNodes which each have a type and a text.

```typescript
export type TextNode = {
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'ul' | 'ol' | 'blockquote' | 'code' | 'hr';
    text: string;
    format?: FormatSection[];
};
```

The `format` property is an array of FormatSections which each have a start and end index and a format.

```typescript
export type FormatSection = {
    start: number;
    end: number;
} & { [key in HtmlFormat]?: boolean | undefined };

export type HtmlFormat = 'b' | 'i' | 'code' | 'u' | 'span' | 'a' | 'img';
```
