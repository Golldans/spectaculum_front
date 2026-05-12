"use client";

import styled from "styled-components";
import { faqItems } from "../data";
import { SectionTitle } from "../styles";

const Wrapper = styled.section`
  padding: 2.2rem 0;
`;

const FaqGrid = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.9rem;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const FaqCard = styled.article`
  border-radius: 1rem;
  border: 1px solid rgba(245, 180, 74, 0.3);
  padding: 1rem;
  background: rgba(10, 7, 16, 0.78);
`;

const FaqQuestion = styled.h3`
  margin: 0;
  font-size: 1.02rem;
`;

const FaqAnswer = styled.p`
  margin: 0.45rem 0 0;
  color: var(--text-muted);
  line-height: 1.45;
`;

export function FaqSection() {
  return (
    <Wrapper>
      <SectionTitle>FAQ rapido</SectionTitle>
      <FaqGrid>
        {faqItems.map((item) => (
          <FaqCard key={item.question}>
            <FaqQuestion>{item.question}</FaqQuestion>
            <FaqAnswer>{item.answer}</FaqAnswer>
          </FaqCard>
        ))}
      </FaqGrid>
    </Wrapper>
  );
}
