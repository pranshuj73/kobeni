import { minify } from "csso";

const defaultProperties = {
    "background": "~none",
    "color": "~rgb(0, 0, 0)",
    "font": "",
    "padding": "~0px",
    "margin": "~0px",
    "border": "~none",
    "box-shadow": "~none",
    "text-shadow": "~none",
    "text-align": "~start",
    "text-decoration": "~none",
    "text-transform": "~none",
    "transform": "~none",
    "transition": "~all 0s ease 0s",
    "cursor": "~auto",
}

// check if the element has only text children not including <br>
function hasOnlyTextChildren(elem: HTMLElement) {
    // get the innerText of the element
    let innerText = elem.innerText;

    // remove all the <br> tags
    innerText = innerText.replace(/<br>/g, "");

    // check if the innerText contains any tags
    return !innerText.includes("<");
}


function getStyles(elem: HTMLElement) {
    const style = window.getComputedStyle(elem);

    let result = "";

    let each: keyof typeof defaultProperties

    for (each in defaultProperties) {
        let value = style.getPropertyValue(each);
        // check for ~ properties
        if (defaultProperties[each].startsWith("~")) {
            if (!value.includes(defaultProperties[each].substring(1))) {
                if (hasOnlyTextChildren(elem) && (each.startsWith("text-") || each.startsWith("font"))) {
                    continue;
                }
                result += `${each}: ${value};`;
            }
        } else {
            result += `${each}: ${value};`;
        }
    }


    result = minify(`div { ${result} }`).css;
    result = result.substring(4, result.length - 1);

    // document.body.removeChild(refDiv);
    return result;
}

export {
    hasOnlyTextChildren,
    getStyles
}