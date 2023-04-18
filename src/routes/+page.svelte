<script>
    import RichEditor from '$lib/RichEditor.svelte';
    import { html, object } from '$lib/stores';

    /** @type {import('$lib/types').RichObject} */
    let startContent = [
        {
            type: 'h1',
            text: "Rich's favourite text editor",
        },
        {
            type: 'p',
            text: "This rich editor is different than most others, because in it's object representation it separates the text from the formatting.",
            format: [
                {
                    start: 20,
                    end: 29,
                    i: true,
                },
                {
                    start: 103,
                    end: 127,
                    b: true,
                },
            ],
        },
        {
            type: 'p',
            text: 'It is aspiring to become the most minimalistic rich-text-editor. All functionality is contained in a single file',
            format: [
                {
                    start: 29,
                    end: 46,
                    i: true,
                    b: true,
                },
            ],
        },
        {
            type: 'p',
            text: 'However, it still needs some love to make it fully functional.',
        },
    ];
</script>

<RichEditor content={startContent} />

<br />
Object: <br />
<pre class="code">{JSON.stringify($object, null, 2)}</pre>

Html:<br />
<pre class="code">
    {$html}
</pre>

<style>
    :global(body) {
        font-family: sans-serif;
    }
    .code {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 10px;
        line-height: 1.4;
        padding: 10px;
        white-space: pre-wrap;
    }
</style>
