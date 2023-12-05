function hasVisibleText(text) {
    return /[\x21-\x7E]/.test(text);
}
function getElementInfo(node, path) {
    if (node.nodeType !== 1 && node.nodeType !== 3 || node.tagName && (node.tagName.toLowerCase() === 'script' || node.tagName.toLowerCase() === 'noscript')) {
        return null;
    }

    let info = {};
    if (node.nodeType === 3) {
        if (!hasVisibleText(node.nodeValue)) {
            return null;
        }
        if (!node.nodeValue.trim()) {
            return null;
        }

        var range = document.createRange();
        range.selectNode(node);
        var rect = range.getBoundingClientRect();
        info = {
            type: "text",
            textContent: node.nodeValue.trim(),
            xpath: path,
            boxInfo: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            }
        };
    } else if (node.nodeType === 1) {
        let rect = node.getBoundingClientRect();
        info = {
            type: "element",
            tagName: node.tagName.toLowerCase(),
            xpath: path,
            boxInfo: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            }
        };
        if (node.tagName.toLowerCase() === "img") {
            info.src = node.src;
            info.alt = node.alt;
        }
    }

    let children = [];
    for (let i = 0; i < node.childNodes.length; i++) {
        let childNode = node.childNodes[i];
        let childInfo = getElementInfo(childNode, `${path}/node()[${i + 1}]`);
        if (childInfo) {
            children.push(childInfo);
        }
    }
    if (children.length > 0) {
        info.children = children;
    }
    return info;
}
return getElementInfo(document.body, "/html/body");