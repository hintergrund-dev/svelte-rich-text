<script>
    import { updateParentNode, updateChildNodes } from './utils.js';
    import { onMount } from 'svelte';

    /** @type {HTMLDivElement | null} */
    let editor = null;

    /** @type {Selection | null}*/
    let selection = null;

    /** @type {import('$lib/types').RichSelectionRange | undefined}*/
    let richSelection;

    /**
     * @type {any}
     */
    let html;

    function handleSelectionChange() {
        selection = document.getSelection();
        const selString = selection?.toString();

        // Anchor and focus need to be in editor (anchor and focus nodes are start and end nodes of selection)
        if (
            !editor ||
            !selection ||
            !selString ||
            selString.length === 0 ||
            !(editor.contains(selection.focusNode) && editor.contains(selection.anchorNode)) ||
            selection?.rangeCount === 0
        ) {
            richSelection = undefined;
        } else {
            const length = selection.toString().length;

            let range = selection.getRangeAt(0);

            let startNode = selection.anchorNode;
            let startChildNode;
            while (startNode?.parentElement && startNode?.parentElement !== editor) {
                startChildNode = startNode;
                startNode = startNode?.parentElement;
            }

            const startIndex = Array.prototype.indexOf.call(
                startNode?.parentNode?.childNodes,
                startNode,
            );
            const startChildIndex = Array.prototype.indexOf.call(
                startNode?.childNodes,
                startChildNode,
            );
            if (selection.anchorNode === selection.focusNode) {
                richSelection = {
                    start: {
                        index: startIndex,
                        childIndex: startChildIndex,
                        offset: range.startOffset,
                    },
                    end: {
                        index: startIndex,
                        childIndex: startChildIndex,
                        offset: range.endOffset,
                    },
                    length,
                };
            } else {
                let endNode = selection.focusNode;
                let endChildNode;
                // Find parent node
                while (endNode?.parentElement && endNode?.parentElement !== editor) {
                    endChildNode = endNode;
                    endNode = endNode?.parentElement;
                }

                const endIndex = Array.prototype.indexOf.call(
                    endNode?.parentNode?.childNodes,
                    endNode,
                );
                const endChildIndex = Array.prototype.indexOf.call(
                    endNode?.childNodes,
                    endChildNode,
                );
                if (
                    endIndex < startIndex ||
                    (endIndex === startIndex && endChildIndex < startChildIndex)
                ) {
                    richSelection = {
                        start: {
                            index: endIndex,
                            childIndex: endChildIndex,
                            offset: range.startOffset,
                        },
                        end: {
                            index: startIndex,
                            childIndex: startChildIndex,
                            offset: range.endOffset,
                        },
                        length,
                    };
                } else {
                    richSelection = {
                        start: {
                            index: startIndex,
                            childIndex: startChildIndex,
                            offset: range.startOffset,
                        },
                        end: {
                            index: endIndex,
                            childIndex: endChildIndex,
                            offset: range.endOffset,
                        },
                        length,
                    };
                }
            }
        }
    }

    onMount(() => {
        editor?.normalize();
        document.addEventListener('selectionchange', handleSelectionChange);
        liveContent = startContent;
    });

    /** @type {import('$lib/types').RichObject} */
    let liveContent;

    /** @type {import('$lib/types').RichObject} */
    let startContent = [
        {
            type: 'p',
            children: [
                {
                    text: "Since it's rich text, you can do things like turn a selection of text ",
                },
                { text: 'bold', bold: true },
                {
                    text: ', or add a semantically rendered block quote in the middle of the page, like this:',
                },
            ],
        },
        {
            type: 'blockquote',
            children: [{ text: 'A wise quote.' }],
        },
        {
            type: 'p',
            children: [{ text: 'Try it out for yourself!' }],
        },
    ];

    /** @param {'bold' | 'italic' | 'code'} action */
    function updateStyle(action) {
        if (!richSelection) {
            return;
        }
        const { object, sel } = updateChildNodes(liveContent, action, richSelection);
        liveContent = object;
        richSelection = sel;

        if (editor) {
            editor.normalize();
        }
        if (
            richSelection.start.index &&
            richSelection.start.childIndex &&
            richSelection.end.index &&
            richSelection.end.childIndex
        ) {
            // selection?.removeAllRanges();
            let newRange = document.createRange();

            const startNode =
                editor?.children[richSelection.start.index].children[
                    richSelection.start.childIndex
                ];
            const endNode =
                editor?.children[richSelection.end.index].children[richSelection.end.childIndex];

            if (!richSelection.end.index && startNode) {
                console.log('same node');
                newRange.selectNode(startNode);
                selection?.addRange(newRange);
                return;
            } else if (startNode && endNode) {
                console.log('different nodes');
                newRange.setStartBefore(startNode);
                newRange.setEndAfter(endNode);
                selection?.addRange(newRange);
            } else {
                throw new Error('Selection error');
            }
            // editor?.focus();
        }
    }

    /** @param {import('$lib/types').ParentNode['type']} type */
    function updateParent(type) {}

    /** @param {import('$lib/types').ChildNode} child*/
    function childToHtml(child) {
        let text = child.text;
        if (child.code) {
            text = `<code>${text}</code>`;
        }
        if (child.italic) {
            text = `<em>${text}</em>`;
        }
        if (child.bold) {
            text = `<strong>${text}</strong>`;
        }
        return text;
    }
    /** @type {any} */
    $: textChilds = liveContent;
</script>

{#if liveContent}
    <div id="editor" bind:this={editor} contenteditable="true" bind:innerHTML={html}>
        {#each liveContent as node, i}
            <svelte:element this={node.type}>
                {#each node.children as child, j}
                    <span
                        style={child.style}
                        contenteditable="true"
                        bind:textContent={textChilds[i].text}
                    >
                        child
                        <!-- {@html childToHtml(child)} -->
                    </span>
                {/each}
            </svelte:element>
        {/each}
    </div>
{/if}

<button on:click={() => updateStyle('bold')}>B</button>
<button on:click={() => updateStyle('italic')}>I</button>
<button on:click={() => updateParent('h1')}>H1</button>
<!-- <button on:click={handleUnderlineClick}>U</button> -->

<div class="analytics">
    <div>
        <code>Selection type: {selection?.type}</code><br />
        <code>StartIndex: {richSelection?.start?.index}</code><br />
        <code>StartChildIndex {richSelection?.start?.childIndex}</code><br />
        <code>Startoffset: {richSelection?.start?.offset}</code><br />
        <code>EndIndex: {richSelection?.end?.index}</code><br />
        <code>EndChildIndex {richSelection?.end?.childIndex}</code><br />
        <code>Endoffset: {richSelection?.end?.offset}</code><br />
        <code>Length: {richSelection?.length}</code><br />
    </div>
    <pre>
        {JSON.stringify(textChilds, null, 2)}
    </pre>

    <pre>
        {JSON.stringify(liveContent, null, 2)}
    </pre>
</div>

<style>
    #editor {
        width: 300px;
        height: 200px;
        border: 1px solid #ccc;
        padding: 10px;
        font-family: sans-serif;
    }
    .analytics {
        font-family: monospace;
        font-size: 12px;
        display: flex;
    }
</style>
