

chrome.runtime.onInstalled.addListener(async (tab) => {
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON") {
    // Inject the CSS file to the page
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"],
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {

        const elements = document.querySelectorAll("*");
        elements.forEach((element) => {

          element.addEventListener("mouseover", (event) => {
            event.stopPropagation();
            event.target.classList.add("kobeni-outline");
          });

          // remove the border when the mouse leaves the element
          element.addEventListener("mouseout", (event) => {
            event.stopPropagation();
            event.target.classList.remove("kobeni-outline");
          });


          const elems = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
          /**
           * @param {HTMLElement} elem 
           * @returns {boolean}
           */
          function isSingleClosing(elem) {
            return elems.indexOf(elem.tagName.toLowerCase()) !== -1;
          }

          /**
           * @param {HTMLElement} element
           * @returns {string}
           */
          function getStyles(element) {


            let styles = "";
            let sheets = document.styleSheets;
            for (let i = 0; i < sheets.length; i++) {
              let rules = sheets[i].cssRules;
              for (let j = 0; j < rules.length; j++) {
                if (element.matches(rules[j].selectorText)) {
                  styles += rules[j].cssText;
                }
              }
            }
            //format the styles
            const formatted = styles.replace(/}/g, "}\n");
            return formatted;



          }

          /**
           * @param {HTMLElement} event
           */
          function getHTML(element) {
            // recursively get the HTML using DFS
            if (element.children.length === 0) {
              // return the HTML of the element without any attributes as long os it is not a svg
              if (element.tagName !== "svg") {
                return element.outerHTML;
              }
              else if (isSingleClosing(element)) {


                let html = element.outerHTML.replace(/style="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
                let children = element.children;
                for (let i = 0; i < children.length; i++) {
                  html = html.replace(children[i].outerHTML, getHTML(children[i]));
                }
                const formatted = html.replace(/></g, ">\n<");
                return formatted.replace(/ style="[^"]*"/g, "").replace(/ class="[^"]*"/g, "");

              }
              return element.outerHTML;
            } else {


              let html = element.outerHTML.replace(/style="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
              let children = element.children;
              for (let i = 0; i < children.length; i++) {
                html = html.replace(children[i].outerHTML, getHTML(children[i]));
              }

              // format the HTML code. This is not necessary but it makes it easier to read.
              const formatted = html.replace(/></g, ">\n<");
              // also remove the attributes of the formatted element by replacing the attributes with an empty string.
              return formatted.replace(/ style="[^"]*"/g, "").replace(/ class="[^"]*"/g, "");


            }
          }

          // add click event listener to the element
          element.addEventListener("click", (event) => {
            event.stopPropagation();

            // get the HTML of the element
            const html = getHTML(event.target);
            const Styles = getStyles(event.target);
            console.log("hello world");
            console.log("HTML: ", html);
            console.log("Styles: ", Styles);

          });
        });
      }
    })
  } else if (nextState === "OFF") {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        // refresh the page to remove all the event listeners
        window.location.reload();
      }
    });
  }
});



