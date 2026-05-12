"use client";

import { ReactNode } from "react";
import { Section, SectionText, SectionTitle } from "../styles";

type SectionBlockProps = {
  id?: string;
  title: string;
  text?: string;
  children: ReactNode;
};

export function SectionBlock({ id, title, text, children }: SectionBlockProps) {
  return (
    <Section id={id}>
      <SectionTitle>{title}</SectionTitle>
      {text ? <SectionText>{text}</SectionText> : null}
      {children}
    </Section>
  );
}
