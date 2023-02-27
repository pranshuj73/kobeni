import { minify } from "csso";

const elements = document.querySelectorAll("*");
elements.forEach((element) => {


  element.addEventListener("mouseover", (event) => {
    event.stopPropagation();
    (event.target as HTMLElement).classList.add("kobeni-outline");
  });
  element.addEventListener("mouseout", (event) => {
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove("kobeni-outline");
  });


  function isSingleClosing(elem: HTMLElement) {
    const elems = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    return elems.indexOf(elem.tagName.toLowerCase()) !== -1;
  }

  function getStyles(elem: HTMLElement) {
    // const refDiv = document.createElement("div");
    // document.body.appendChild(refDiv);

    const style = window.getComputedStyle(elem);
    // const defaultStyle = window.getComputedStyle(refDiv);

    let result = "";
    const defaultProperties = {
      "background": "~none",
      "color": "~rgb(0, 0, 0)",
      "font": "",
      "padding": "~0px",
      "margin": "~0px",
      "border": "~none",
      // "outline": "~none",
      "box-shadow": "~none",
      "text-shadow": "~none",
      "text-align": "~start",
      "text-decoration": "~none",
      "text-transform": "~none",
      "transform": "~none",
      "transition": "~all 0s ease 0s",
      "cursor": "~auto",
    }

    let each: keyof typeof defaultProperties

    for (each in defaultProperties) {
      let value = style.getPropertyValue(each);
      // check for ~ properties
      if (defaultProperties[each].startsWith("~")) {
        if (!value.includes(defaultProperties[each].substring(1))) {
          result += `${each}: ${value};`;
        }
      } else {
        // if (!value.includes(defaultProperties[each])) {
        result += `${each}: ${value};`;
        // }
      }
    }


    result = minify(`div { ${result} }`).css;
    result = result.substring(4, result.length - 1);

    // document.body.removeChild(refDiv);
    return result;
  }


  function getHTML(elem: HTMLElement) {
    // recursively get the HTML using DFS
    if (elem.children.length === 0) {
      // 3 cases as "SVG", "self-closing" and "normal"
      if (elem.tagName.toLowerCase() === "svg") {
        return elem.outerHTML.replace(/class="[^"]*"/g, "").replace(/id="[^"]*"/g, "").replace(/style="[^"]*"/g, "").replace(">", ` style="${getStyles(elem)}">`);
      } else if (isSingleClosing(elem)) {
        return `<${elem.tagName.toLowerCase()} style="${getStyles(elem)}" />`;
      }
      return `<${elem.tagName.toLowerCase()} style="${getStyles(elem)}">${elem.innerHTML}</${elem.tagName.toLowerCase()}>`;
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

  // add click event listener to the element
  element.addEventListener("click", (event) => {
    event.stopPropagation();

    console.log(getHTML(event.target as HTMLElement));

    // create a new div that will be used to display the HTML
    // make the div position absolute and set the top and left to the mouse position
    // make sure that the div does not overflow the screen 
    // also give it a height of 20rem and width of 50rem and make it scrollable
    // add a close button to the div
    // add a copy button to the div
    let template = `
        <div class="kobeni-card">
      <div class="kobeni-card-header">
        <div class="kobeni-card-title">HTML</div>
          <div class="kobeni-card-buttons">
            <div class="kobeni-card-copy"></div>
            <div class="kobeni-card-close"></div>
          </div>
        </div>
      <div class="kobeni-card-body">
      <code id="kobeni-code">
        {}
      </code>
      </div>
    </div>
    `

    // append the template to the body
    document.body.insertAdjacentHTML("beforeend", template);

    // add the HTML as text to the code tag
    const code = document.getElementById("kobeni-code");
    if (code) {
      code.innerText = getHTML(event.target as HTMLElement);
    }
  });

});