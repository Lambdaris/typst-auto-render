import wypst from 'wypst';


const findMathTextRange = function (string) {
    let base = 0;
    while (base < string.length) {
        let begin = string.indexOf("$", base);
        if (begin === -1) {
            break;
        } else if (begin > 0 && string[begin - 1] === "\\") {
            base = begin + 1;
            continue;
        } else {
            let end = string.indexOf("$", begin + 1);
            if (end === -1) {
                break;
            } else {
                return [begin, end + 1]
            }
        }
    }
    return [-1, 0]
}

const extractMathText = function (string) {
    let data = [];
    while (string.length > 0) {
        let [begin, end] = findMathTextRange(string);
        if (begin === -1 || end - begin < 1) {
            data.push({
                type: "text",
                data: string,
            });
            break;
        } else {
            data.push({
                type: "text",
                data: string.slice(0, begin),
            });
            let rawData = string.slice(begin, end);
            let display = rawData.at(1) === " " && rawData.at(-2) === " ";
            data.push({
                type: "math",
                data: rawData.slice(1, -1).trim(),
                rawData,
                display
            });
        }
        string = string.slice(end);
    }
    return data;
}


const renderMathInText = function (text, options) {
    const data = extractMathText(text);
    if (data.length === 1 && data[0].type === 'text') {
        // There is no formula in the text.
        // Let's return null which means there is no need to replace
        // the current text node with a new one.
        return null;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "text") {
            fragment.appendChild(document.createTextNode(data[i].data));
        } else {
            const span = document.createElement("span");

            // Override any display mode defined in the settings with that
            // defined by the text itself
            options.displayMode = data[i].display;
            let math = data[i].data;
            wypst.render(math, span, options);

            fragment.appendChild(span);
        }
    }

    return fragment;
};


const renderElem = function (elem, options) {
    for (let i = 0; i < elem.childNodes.length; i++) {
        const childNode = elem.childNodes[i];
        if (childNode.nodeType === 3) {
            // Text node
            // Concatenate all sibling text nodes.
            // Webkit browsers split very large text nodes into smaller ones,
            // so the delimiters may be split across different nodes.
            let textContentConcat = childNode.textContent;
            let sibling = childNode.nextSibling;
            let nSiblings = 0;
            while (sibling && (sibling.nodeType === Node.TEXT_NODE)) {
                textContentConcat += sibling.textContent;
                sibling = sibling.nextSibling;
                nSiblings++;
            }
            const frag = renderMathInText(textContentConcat, options);
            if (frag) {
                // Remove extra text nodes
                for (let j = 0; j < nSiblings; j++) {
                    childNode.nextSibling.remove();
                }
                i += frag.childNodes.length - 1;
                elem.replaceChild(frag, childNode);
            } else {
                // If the concatenated text does not contain math
                // the siblings will not either
                i += nSiblings;
            }
        } else if (childNode.nodeType === 1) {
            // Element node
            const className = ' ' + childNode.className + ' ';
            const shouldRender = options.ignoredTags.indexOf(
                childNode.nodeName.toLowerCase()) === -1 &&
                options.ignoredClasses.every(
                    x => className.indexOf(' ' + x + ' ') === -1);

            if (shouldRender) {
                renderElem(childNode, options);
            }
        }
        // Otherwise, it's something else, and ignore it.
    }
};


const renderMathInElement = function (elem, options) {
    if (!elem) {
        throw new Error("No element provided to render");
    }

    const optionsUsed = {};

    // Object.assign(optionsUsed, option)
    for (const option in options) {
        if (options.hasOwnProperty(option)) {
            optionsUsed[option] = options[option];
        }
    }

    optionsUsed.ignoredTags = optionsUsed.ignoredTags || [
        "script", "noscript", "style", "textarea", "pre", "code", "option",
    ];

    optionsUsed.ignoredClasses = optionsUsed.ignoredClasses || [];
    optionsUsed.errorCallback = optionsUsed.errorCallback || console.error;

    renderElem(elem, optionsUsed);
};

window.renderMathInElement = function (elem, options) {
    wypst.init().then(() => {
        renderMathInElement(document.body, {
            throwOnError: false
        });
    });
}



