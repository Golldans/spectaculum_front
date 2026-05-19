"use client";

import styled from "styled-components";
import { benefits } from "../data";
import { BaseCard, CardText, CardTitle } from "../ui/Card";
import { SectionBlock } from "../ui/SectionBlock";

const BenefitGrid = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.9rem;

  @media (max-width: 740px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled(BaseCard)`
  background: linear-gradient(150deg, rgba(39, 24, 23, 0.75), rgba(21, 13, 35, 0.9));
  border-color: rgba(230, 75, 47, 0.35);
`;

export function BenefitsSection() {
  return (
    <SectionBlock
      title="Por que usar o Spectaculum"
      text="Tudo que você precisa para descobrir, avaliar, compartilhar e se conectar com a comunidade de cinéfilos."
    >
      <BenefitGrid>
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.title}>
            <CardTitle>{benefit.title}</CardTitle>
            <CardText>{benefit.text}</CardText>
          </BenefitCard>
        ))}
      </BenefitGrid>
    </SectionBlock>
  );
}
