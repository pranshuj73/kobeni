
import { ClickEvent, MouseOutEvent, MouseOverEvent } from "./events";
import { getHTML } from "./html";

const elements = document.querySelectorAll("*");
elements.forEach((element) => {

  MouseOverEvent(element as HTMLElement);
  MouseOutEvent(element as HTMLElement);
  ClickEvent(element as HTMLElement);
});