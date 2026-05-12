"use client";

import styled from "styled-components";
import { cinemaPreviews } from "../data";
import { SectionBlock } from "../ui/SectionBlock";

const NearbyGrid = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.9rem;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const NearbyCard = styled.article`
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid var(--stroke);
  background: linear-gradient(165deg, rgba(34, 20, 45, 0.92), rgba(12, 8, 18, 0.95));
`;

const NearbyTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.8rem;
`;

const NearbyName = styled.h3`
  margin: 0;
  font-size: 1.06rem;
`;

const Distance = styled.small`
  color: var(--accent);
  font-weight: 700;
`;

const NearbyMeta = styled.p`
  margin: 0.65rem 0 0;
  color: var(--text-muted);
  font-size: 0.96rem;
`;

const Tag = styled.span`
  display: inline-flex;
  margin-top: 0.7rem;
  border-radius: 999px;
  padding: 0.28rem 0.66rem;
  font-size: 0.82rem;
  color: #1b1008;
  background: linear-gradient(130deg, var(--accent), #ffd89c);
  font-weight: 700;
`;

const tags = ["Mais proximo", "Alta demanda", "Conforto premium"];

export function NearbyCinemasSection() {
  return (
    <SectionBlock
      id="cinemas"
      title="Mock de cinemas proximos"
      text="Exemplo visual inicial de como os cinemas podem aparecer quando a busca por regiao estiver ativa."
    >
      <NearbyGrid>
        {cinemaPreviews.map((cinema, index) => (
          <NearbyCard key={cinema.name}>
            <NearbyTop>
              <NearbyName>{cinema.name}</NearbyName>
              <Distance>{cinema.distance}</Distance>
            </NearbyTop>
            <NearbyMeta>
              {cinema.city} • Salas e formatos variados • Sessoes: {cinema.sessions}
            </NearbyMeta>
            <Tag>{tags[index] ?? "Em destaque"}</Tag>
          </NearbyCard>
        ))}
      </NearbyGrid>
    </SectionBlock>
  );
}
