import { getStyles } from "./style";
import { isSingleClosing } from "./utilities";

function getAttributeString(elem: HTMLElement) {
    let attributes: { [key: string]: string } = {};

    // get all attributes that change the appearance of the element ( except style, class and id)
    for (let i = 0; i < elem.attributes.length; i++) {
        let attr = elem.attributes[i];
        // check if the attribute name starts with "data-" or "aria-" or "on" just continue
        if (attr.name.startsWith("data-") ||
            attr.name.startsWith("aria-") ||
            attr.name.startsWith("on") ||
            attr.name === "style" ||
            attr.name === "class" ||
            attr.name === "id"
        ) {
            continue;
        }
        attributes[attr.name] = attr.value;
    }

    // get the attributes string
    let attributesString = "";
    for (let key in attributes) {
        attributesString += `${key}="${attributes[key]}" `;
    }

    return attributesString;
}

function getSVGHTML(elem: HTMLElement) {
    return elem.outerHTML.replace(/class="[^"]*"/g, "").replace(/id="[^"]*"/g, "").replace(/style="[^"]*"/g, "").replace(">", ` style="${getStyles(elem)}">`);
}

function getSelfClosingHTML(elem: HTMLElement) {
    return `<${elem.tagName.toLowerCase()} style="${getStyles(elem)}" ${getAttributeString(elem)}/>`;
}

function getRegularHTML(elem: HTMLElement) {
    return `<${elem.tagName.toLowerCase()} style="${getStyles(elem)}" ${getAttributeString(elem)}>${elem.innerHTML}</${elem.tagName.toLowerCase()}>`;
}

function getHTML(elem: HTMLElement) {
    // recursively get the HTML using DFS
    if (elem.children.length === 0) {
        // 3 cases as "SVG", "self-closing" and "normal"
        if (elem.tagName.toLowerCase() === "svg") {
            return getSVGHTML(elem);
        } else if (isSingleClosing(elem)) {
            return getSelfClosingHTML(elem);
        }
        return getRegularHTML(elem);
    } else {

        let html = `<${elem.tagName.toLowerCase()} style="${getStyles(elem)}">`;
        let children = elem.children;
        for (let i = 0; i < children.length; i++) {
            html += getHTML(children[i] as HTMLElement);
        }
        html += `</${elem.tagName.toLowerCase()}>`;
        return html;
    }
}

export {
    getHTML
}