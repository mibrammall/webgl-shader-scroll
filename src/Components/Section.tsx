import { ReactElement } from "react";

interface SectionProps {
  section: string;
  index: number;
}

export function Section({
  section,
  index,
}: SectionProps): ReactElement<SectionProps> {
  return (
    <>
      <div className="section section__title">
        <h1 className="section__title-number">{index + 1}</h1>
        <h2 className="section__title-title">{section}</h2>
      </div>
    </>
  );
}
