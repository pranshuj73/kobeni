import { hasOnlyTextChildren } from "../src/style";
import { JSDOM } from "jsdom";

test("hasOnlyTextChildren", () => {

    const dom = new JSDOM();
    const document = dom.window.document;

    let div = document.createElement("div");
    div.innerHTML = "Hello World";

    expect(hasOnlyTextChildren(div)).toBe(true);

    div.innerHTML = "Hello <br> World";

    expect(hasOnlyTextChildren(div)).toBe(true);

    div.innerHTML = "Hello <br> World <br>";

    expect(hasOnlyTextChildren(div)).toBe(true);

    div.innerHTML = "<div>Hello World</div>";

    expect(hasOnlyTextChildren(div)).toBe(false);

    div.innerHTML = "<div>Hello World</div>Hello World";

    expect(hasOnlyTextChildren(div)).toBe(false);
});