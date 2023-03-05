function isSingleClosing(elem: HTMLElement) {
    const elems = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    return elems.indexOf(elem.tagName.toLowerCase()) !== -1;
}

export {
    isSingleClosing
}