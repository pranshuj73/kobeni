

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
            // get the computed styles of the element
            const styles = window.getComputedStyle(element);
            let styleString = "";
            for (let i = 0; i < styles.length; i++) {
              // add the style to the string if it is not a custom property and a default property
              if (!styles[i].startsWith("--") && styles[i] !== "all") {
                styleString += `${styles[i]}: ${styles.getPropertyValue(styles[i])}; `;
              }
            }
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
                return element.outerHTML;
              }
              return element.outerHTML;
            } else {
              // return the HTML of the element with all the attributes
              let html = element.outerHTML;
              let children = element.children;
              for (let i = 0; i < children.length; i++) {
                html = html.replace(children[i].outerHTML, getHTML(children[i]));
              }
              return html;
            }
          }

          // add click event listener to the element
          element.addEventListener("click", (event) => {
            event.stopPropagation();

            // get the HTML of the element
            const html = getHTML(event.target);
            console.log("HTML: ", html);

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