"use client";

import styled from "styled-components";
import { cinemaPreviews } from "../data";
import { sweep } from "../styles";
import { GhostButton, PrimaryButton } from "../ui/Buttons";

const Hero = styled.header`
  padding: 4.2rem 0 3rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--accent);
  font-size: 0.92rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
`;

const HeroGrid = styled.div`
  margin-top: 1.35rem;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1.1fr 0.9fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-family: var(--font-geist-mono), "Courier New", monospace;
  font-size: clamp(2.15rem, 5vw, 4rem);
  line-height: 1.04;
  max-width: 12ch;
`;

const HeroText = styled.p`
  margin: 1rem 0 0;
  color: var(--text-muted);
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  line-height: 1.6;
  max-width: 52ch;
`;

const CtaRow = styled.div`
  margin-top: 1.7rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const HeroCard = styled.aside`
  border: 1px solid var(--stroke);
  border-radius: 1.2rem;
  background: linear-gradient(160deg, rgba(29, 20, 44, 0.9), rgba(13, 9, 21, 0.95));
  padding: 1.15rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      transparent 30%,
      rgba(245, 180, 74, 0.16),
      transparent 70%
    );
    animation: ${sweep} 3.5s linear infinite;
  }
`;

const HeroCardBody = styled.div`
  position: relative;
  z-index: 1;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.08rem;
`;

const DotLine = styled.div`
  margin-top: 0.7rem;
  border-top: 1px dashed rgba(245, 180, 74, 0.42);
`;

const CinemaList = styled.ul`
  margin: 0.9rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.62rem;
`;

const CinemaItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid rgba(245, 180, 74, 0.16);
  border-radius: 0.85rem;
  padding: 0.65rem 0.75rem;
  background: rgba(9, 5, 15, 0.5);
`;

const CinemaName = styled.span`
  font-weight: 600;
`;

const Distance = styled.small`
  color: var(--accent);
  font-weight: 700;
`;

export function HeroSection() {
  return (
    <Hero>
      <Eyebrow>● Comunidade de cinéfilos</Eyebrow>
      <HeroGrid>
        <div>
          <HeroTitle>Descubra, avalie e compartilhe filmes.</HeroTitle>
          <HeroText>
            Spectaculum é sua plataforma para explorar filmes com metadados ricos, 
            avaliar com precisão, criar listas colaborativas, conectar com amigos 
            cinéfilos e receber notificações de sessões em cinemas.
          </HeroText>
          <CtaRow>
            <PrimaryButton href="/movies">Explorar filmes</PrimaryButton>
            <GhostButton href="#como-funciona">Como funciona</GhostButton>
          </CtaRow>
        </div>

        <HeroCard aria-label="destaques do Spectaculum">
          <HeroCardBody>
            <CardTitle>Principais recursos</CardTitle>
            <DotLine />
            <CinemaList>
              <CinemaItem>
                <CinemaName>🎥 Metadados OMDb</CinemaName>
                <Distance>Sinopse, capas</Distance>
              </CinemaItem>
              <CinemaItem>
                <CinemaName>⭐ Avaliações</CinemaName>
                <Distance>Meia-estrela</Distance>
              </CinemaItem>
              <CinemaItem>
                <CinemaName>📋 Listas</CinemaName>
                <Distance>Colaborativas</Distance>
              </CinemaItem>
              <CinemaItem>
                <CinemaName>👥 Amigos</CinemaName>
                <Distance>Rede social</Distance>
              </CinemaItem>
              <CinemaItem>
                <CinemaName>🔔 Notificações</CinemaName>
                <Distance>Sessões</Distance>
              </CinemaItem>
              <CinemaItem>
                <CinemaName>🍿 Cinemas</CinemaName>
                <Distance>Validados CEP</Distance>
              </CinemaItem>
            </CinemaList>
          </HeroCardBody>
        </HeroCard>
      </HeroGrid>
    </Hero>
  );
}
