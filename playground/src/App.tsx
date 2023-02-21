import { useEffect, useRef, useState } from 'react'
import { minify } from 'csso';

export default function App() {
  const mainDiv = useRef<HTMLDivElement | null>(null);
  const refDiv = useRef<HTMLDivElement | null>(null);
  const [output, setOutput] = useState("")
  useEffect(() => {
    if (mainDiv.current && refDiv.current) {
      const style = window.getComputedStyle(mainDiv.current);
      const divStyle = window.getComputedStyle(refDiv.current);
      let result = "";
      let remove = ["border-block-start", "border-block-end", "border-inline-start", "border-inline-end", "perspective-origin", "webkit", "transform-origin", "caret", "block-size", "outline", "inline", "text-emphasis-color", "text-decoration-color", "column-rule-color"];
      for (let i = 0; i < style.length; i++) {
        if (style.getPropertyValue(style[i]) != divStyle.getPropertyValue(style[i])) {
          if (remove.some((item) => style[i].includes(item))) {
            continue;
          }
          // if text-decoration is none then remove it
          if (style[i] == "text-decoration" && style.getPropertyValue(style[i]).includes("none")) {
            continue;
          }
          // if border-color is specified but not border-width then remove it
          if (style[i] == "border-color" && style.getPropertyValue("border-width").includes("0px")) {
            continue;
          }
          result += `${style[i]}:${style.getPropertyValue(style[i])};`;
        }
      }
      setOutput(minify(`div{${result}}`).css);
    }
  }, [mainDiv, refDiv])
  return (
    <>
      <div ref={mainDiv} style={{ width: 100, height: 100, color: "blue", background: "red" }}>
        Hello world
      </div>
      <div>
        {output}
      </div>
      <div ref={refDiv}></div>
    </>
  )
}