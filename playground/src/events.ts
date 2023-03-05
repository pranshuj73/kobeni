import { getHTML } from "./html";

function MouseOverEvent(elem: HTMLElement) {
  elem.addEventListener("mouseover", (event) => {
    event.stopPropagation();
    (event.target as HTMLElement).classList.add("kobeni-outline");
  });
}

function MouseOutEvent(elem: HTMLElement) {
  elem.addEventListener("mouseout", (event) => {
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove("kobeni-outline");
  });
}

function ClickEvent(elem: HTMLElement) {
  elem.addEventListener("click", (event) => {
    event.stopPropagation();

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

    document.body.insertAdjacentHTML("beforeend", template);

    const code = document.getElementById("kobeni-code");
    if (code) {
      code.innerText = getHTML(event.target as HTMLElement);
    }

    // remove all the event listeners
    const cards = document.getElementsByClassName("kobeni-card");
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }
  });
}

export {
  MouseOverEvent,
  MouseOutEvent,
  ClickEvent
}