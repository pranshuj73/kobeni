

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
      files: ["content.js"],
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



