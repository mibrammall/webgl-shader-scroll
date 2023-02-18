import { ReactElement } from "react";
import "./App.css";

const sections = ["Logma", "Naos", "Chara"];

function App(): ReactElement {
  return (
    <>
      {sections.map((title, index) => (
        <Section section={title} index={index} />
      ))}
    </>
  );
}

interface SectionProps {
  section: string;
  index: number;
}

function Section({ section, index }: SectionProps): ReactElement<SectionProps> {
  return (
    <>
      <div className="section__title">
        <h1 className="section__title-number">{index}</h1>
        <h2 className="section__title-title">{section}</h2>
      </div>
    </>
  );
}

export default App;
