/** @typedef {typeof __propDef.props}  RichEditorProps */
/** @typedef {typeof __propDef.events}  RichEditorEvents */
/** @typedef {typeof __propDef.slots}  RichEditorSlots */
export default class RichEditor extends SvelteComponentTyped<{
    content: import("./types").RichObject;
}, {
    mousedown: MouseEvent;
} & {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type RichEditorProps = typeof __propDef.props;
export type RichEditorEvents = typeof __propDef.events;
export type RichEditorSlots = typeof __propDef.slots;
import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        content: import('./types').RichObject;
    };
    events: {
        mousedown: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
