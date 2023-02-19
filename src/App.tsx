import { ReactElement, useEffect, useRef } from "react";

import "./App.css";

import { Section } from "./Components/Section";
import { ScrollState } from "./ScrollState";

const sections = ["Logma", "Naos", "Chara"];

function App(): ReactElement {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || !content.current) {
      return;
    }

    if (container.current.childNodes.length) {
      return;
    }

    let scrollstate = new ScrollState(container.current, content.current);

    return () => {
      scrollstate.dispose();
    };
  }, []);
  return (
    <>
      <div className="scroll__stage">
        <div ref={content} className="scroll__content">
          {sections.map((title, index) => (
            <Section section={title} index={index} />
          ))}
        </div>
        <div ref={container}></div>
      </div>
    </>
  );
}

export default App;
