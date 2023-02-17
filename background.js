const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

// run when the page is loaded  
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
      // Insert the CSS file when the user turns the extension on
      // await chrome.scripting.insertCSS({
      //   files: ["focus-mode.css"],
      //   target: { tabId: tab.id },
      // });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          let currentState = "";

          const elements = document.querySelectorAll("*");
          elements.forEach((element) => {
            element.addEventListener("mouseover", (event) => {
              event.stopPropagation();
              // insert a inside border for the element
              currentState = event.target.style.border;
              event.target.style.boxSizing = "border-box";
              event.target.style.border = "1px solid red";

            });
            element.addEventListener("mouseout", (event) => {
              event.stopPropagation();  
              // remove the border when the mouse leaves the element  
              event.target.style.border = currentState;
            });
            element.addEventListener("click", (event) => {
              event.stopPropagation();
              event.preventDefault();
              console.log(event.target);
            });
        });
          }
      })
    } else if (nextState === "OFF") {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          // Remove the HTML file when the user turns the extension off
          const html = document.getElementById("focus-mode");
          html.remove();
        }
      });
    }
  });