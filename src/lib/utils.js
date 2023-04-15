/**
 * @param {import('$lib/types').ParentNode['type']} type
 * @param {import('$lib/types').RichObject} obj
 * @param {Range | null} range
 * @param {number} index
 */
export function updateParentNode(obj, type, range, index) {
    obj[index].type = type;
    return obj;
}

/**
 * @param {'bold' | 'italic' | 'code'} action
 * @param {import('$lib/types').RichObject} object
 * @param {import('$lib/types').RichSelectionRange} selection
 *
 * @returns {{
 * object: import('$lib/types').RichObject;
 * sel: import ('$lib/types').RichSelectionRange;
 * }}
 */
export function updateChildNodes(object, action, selection) {
    // First selected element decides if formatting is applied or removed for all elements
    let remove = object[selection.start.index].children[selection.start.childIndex][action]
        ? true
        : undefined;

    // Selection is within one element
    if (
        selection.start.index === selection.end.index &&
        selection.start.childIndex === selection.end.childIndex
    ) {
        if (
            selection.start.offset === 0 &&
            selection.end.offset ===
                object[selection.start.index].children[selection.start.childIndex].text.length
        ) {
            console.log('entire element');
            // If selection is entire element, update text
            object[selection.start.index].children[selection.start.childIndex][action] = remove
                ? undefined
                : true;
        } else if (selection.start.offset === 0) {
            console.log('start of element');
            // Element needs to be split at endOffset
            let child1 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(0, selection.end.offset),
                [action]: remove ? undefined : true,
            };
            let child2 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(selection.end.offset),
            };
            object[selection.start.index].children.splice(
                selection.start.childIndex,
                1,
                child1,
                child2,
            );
        } else if (
            selection.end.offset ===
            object[selection.start.index].children[selection.start.childIndex].text.length
        ) {
            console.log('end of element');
            // Element needs to be split at startOffset
            let child1 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(0, selection.start.offset),
            };
            let child2 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(selection.start.offset),
                [action]: remove ? undefined : true,
            };
            object[selection.start.index].children.splice(
                selection.start.childIndex,
                1,
                child1,
                child2,
            );

            selection.start.childIndex++;
        } else {
            console.log('middle of element');
            // Selection is in middle, needs to be split at startOffset and endOffset
            let child1 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(0, selection.start.offset),
            };
            let child2 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(selection.start.offset, selection.end.offset),
                [action]: remove ? undefined : true,
            };
            let child3 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(selection.end.offset),
            };
            object[selection.start.index].children.splice(
                selection.start.childIndex,
                1,
                child1,
                child2,
                child3,
            );
            selection.start.childIndex++;
        }
    } else {
        // Selection spans multiple elements
        if (selection.start.offset === 0) {
            console.log('multiple start');
            // If the selection starts at the beginning of the element no split is needed
            object[selection.start.index].children[selection.start.childIndex][action] = remove
                ? undefined
                : true;
        } else {
            console.log('multiple split');
            // Element needs to be split at startOffset
            let child1 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(0, selection.start.offset),
            };
            let child2 = {
                ...object[selection.start.index].children[selection.start.childIndex],
                text: object[selection.start.index].children[
                    selection.start.childIndex
                ].text.substring(selection.start.offset),
                [action]: remove ? undefined : true,
            };
            object[selection.start.index].children.splice(
                selection.start.childIndex,
                1,
                child1,
                child2,
            );
            selection.start.childIndex++;
            selection.end.childIndex++;
        }

        // Loop through all ParentNodes
        for (let i = selection.start.index; i <= selection.end.index; i++) {
            let startChildIndex = i === selection.start.index ? selection.start.childIndex : 0;
            let endChildIndex =
                i === selection.end.index ? selection.end.index : object[i].children.length - 1;
            // Loop through all ChildNodes
            for (let j = startChildIndex; j < endChildIndex; j++) {
                object[i].children[j][action] = remove ? undefined : true;
            }
        }
        if (
            selection.end.offset ===
            object[selection.end.index].children[selection.end.childIndex].text.length
        ) {
            // If the selection ends at the end of the element no split is needed
            object[selection.end.index].children[selection.end.childIndex][action] = remove
                ? undefined
                : true;
        } else {
            // Element needs to be split at endOffset
            let child1 = {
                ...object[selection.end.index].children[selection.end.childIndex],
                text: object[selection.end.index].children[selection.end.childIndex].text.substring(
                    0,
                    selection.end.offset,
                ),
                [action]: remove ? undefined : true,
            };
            let child2 = {
                ...object[selection.end.index].children[selection.end.childIndex],
                text: object[selection.end.index].children[selection.end.childIndex].text.substring(
                    selection.end.offset,
                ),
            };
            object[selection.end.index].children.splice(
                selection.end.childIndex,
                1,
                child1,
                child2,
            );
        }
    }

    return mergeEqualChilds(object, selection);
}

/**
 * @param {import('$lib/types').RichObject} object
 * @param {import('$lib/types').RichSelectionRange} selection
 * @returns {{
 * object: import('$lib/types').RichObject;
 * sel: import ('$lib/types').RichSelectionRange;
 * }}
 */
function mergeEqualChilds(object, selection) {
    for (let i = selection.start.index; i <= selection.end.index; i++) {
        console.log('i', i);
        let endChildIndex = object[i].children.length - 2;
        console.log(object[i]);
        console.log('endChildIndex', endChildIndex);
        for (let j = 0; j < endChildIndex; j++) {
            console.log('j', j);
            if (object[i].children[j].text.length === 0) {
                object[i].children.splice(j, 1);
                j--;
                selection.end.childIndex--;
                continue;
            }
            console.log(object[i].children[j], object[i].children[j + 1]);
            if (areChildNodesEqual(object[i].children[j], object[i].children[j + 1])) {
                object[i].children[j].text += object[i].children[j + 1].text;
                object[i].children.splice(j + 1, 1);
                j--;
                if (i === selection.end.index) {
                    selection.end.childIndex--;
                }
            }
        }
    }
    return { object, sel: selection };
}

/**
 * @param {import('$lib/types').ChildNode} ch1
 * @param {import('$lib/types').ChildNode} ch2
 */
function areChildNodesEqual(ch1, ch2) {
    if (
        Object.is(ch1.bold, ch2.bold) &&
        Object.is(ch1.italic, ch2.italic) &&
        Object.is(ch1.code, ch2.code) &&
        Object.is(ch1.style, ch2.style)
    ) {
        return true;
    } else {
        return false;
    }
}

/**
 * @param {string | any[]} obj
 */
export function generateHtmlFromObject(obj) {
    let html = '';

    for (let i = 0; i < obj.length; i++) {
        let element = obj[i];
        let tagName = element.type;
        let children = element.children;

        html += '<' + tagName + '>';

        for (let j = 0; j < children.length; j++) {
            let child = children[j];
            let text = child.text;

            if (child.bold) {
                text += '<strong>' + text + '</strong>';
            }
            if (child.italic) {
                text += '<em>' + text + '</em>';
            }
            if (child.code) {
                text += '<code>' + text + '</code>';
            }
            html += text;
        }
        html += '</' + tagName + '>';
    }
    return html;
}

/**
 * @param {any} html
 */
export function generateObjectFromHtml(html) {
    let obj = [];
    let currentElement = null;
    let currentText = '';
    let buffer = html;

    while (buffer.length > 0) {
        let tagMatch = buffer.match(/<(\w+)([^>]*)>/);
        let textMatch = buffer.match(/>([^<]*)</);

        if (tagMatch) {
            let tagName = tagMatch[1];
            let tagAttrs = tagMatch[2];

            if (currentElement) {
                // Save the current element before creating a new one
                currentElement.children.push({ text: currentText });
                obj.push(currentElement);
            }

            // Create a new element
            currentElement = { type: tagName, children: [] };

            // Parse the attributes of the tag
            let attrRegex = /(\w+)="([^"]*)"/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(tagAttrs)) !== null) {
                let attrName = attrMatch[1];
                let attrValue = attrMatch[2];
                currentElement[attrName] = attrValue;
            }

            // Update the buffer to remove the processed tag
            buffer = buffer.substring(tagMatch.index + tagMatch[0].length);
        } else if (textMatch) {
            // Save the text between the last tag and the current one
            currentText += textMatch[1];

            // Update the buffer to remove the processed text
            buffer = buffer.substring(textMatch.index + textMatch[0].length);
        } else {
            // If there are no more tags or text in the buffer, break the loop
            break;
        }
    }

    // Save the final element
    if (currentElement) {
        currentElement.children.push({ text: currentText });
        obj.push(currentElement);
    }

    return obj;
}

// export function handleKeyDown(event) {
//     // Check if the enter key was pressed
//     if (event.keyCode === 13) {
//         let range = selection.getRangeAt(0);
//         // Prevent the default behavior (inserting a new line)
//         event.preventDefault();

//         // Create a new paragraph element
//         let p = document.createElement('p');
//         // Insert a new paragraph at the current caret position
//         range.insertNode(p);

//         // Move the caret to the end of the new paragraph
//         range.setStart(p, 0);
//         range.setEnd(p, 0);
//         selection.removeAllRanges();
//         selection.addRange(range);
//     }
// }
