"use client";

import styled from "styled-components";
import { howItWorksItems } from "../data";
import { BaseCard, CardText, CardTitle } from "../ui/Card";
import { SectionBlock } from "../ui/SectionBlock";

const Features = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.9rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureStep = styled.span`
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: rgba(245, 180, 74, 0.2);
  color: var(--accent);
  font-weight: 700;
`;

export function HowItWorksSection() {
  return (
    <SectionBlock
      id="como-funciona"
      title="Como funciona"
      text="Em tres passos voce configura sua area e recebe uma lista objetiva de cinemas disponiveis por perto."
    >
      <Features>
        {howItWorksItems.map((item) => (
          <BaseCard key={item.title}>
            <FeatureStep>{item.step}</FeatureStep>
            <CardTitle>{item.title}</CardTitle>
            <CardText>{item.text}</CardText>
          </BaseCard>
        ))}
      </Features>
    </SectionBlock>
  );
}
