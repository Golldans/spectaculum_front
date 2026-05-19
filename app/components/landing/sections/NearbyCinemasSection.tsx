"use client";

import styled from "styled-components";
import Link from "next/link";
import { SectionBlock } from "../ui/SectionBlock";

const StartGrid = styled.div`
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

const StartCard = styled(Link)`
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid var(--stroke);
  background: linear-gradient(165deg, rgba(34, 20, 45, 0.92), rgba(12, 8, 18, 0.95));
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:hover {
    border-color: rgba(245, 180, 74, 0.5);
    background: linear-gradient(165deg, rgba(50, 30, 60, 0.95), rgba(20, 15, 30, 0.98));
    transform: translateY(-2px);
  }
`;

const CardIcon = styled.div`
  font-size: 2rem;
`;

const CardName = styled.h3`
  margin: 0;
  font-size: 1.06rem;
  color: var(--accent);
`;

const CardMeta = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.96rem;
  flex-grow: 1;
`;

const Tag = styled.span`
  display: inline-flex;
  align-self: flex-start;
  border-radius: 999px;
  padding: 0.28rem 0.66rem;
  font-size: 0.82rem;
  color: #1b1008;
  background: linear-gradient(130deg, var(--accent), #ffd89c);
  font-weight: 700;
  margin-top: 0.5rem;
`;

const startItems = [
  {
    icon: "🎥",
    name: "Explorar Filmes",
    desc: "Descubra filmes com metadados ricos da OMDb. Busque por título, veja sinopses e capas.",
    tag: "Comece aqui",
    href: "/movies",
  },
  {
    icon: "⭐",
    name: "Avaliar e Comentar",
    desc: "Compartilhe sua opinião com avaliações de meia-estrela e comentários nomeados.",
    tag: "Novo usuário",
    href: "/movies",
  },
  {
    icon: "📋",
    name: "Criar Listas",
    desc: "Monte coleções temáticas, gerencie filmes e colabore com amigos.",
    tag: "Organize",
    href: "/lists",
  },
  {
    icon: "👥",
    name: "Conecte Amigos",
    desc: "Envie solicitações de amizade e construa sua rede de cinéfilos.",
    tag: "Social",
    href: "/friends",
  },
  {
    icon: "🍿",
    name: "Cinemas Cadastrados",
    desc: "Veja cinemas validados por CEP com endereços estruturados e sessões.",
    tag: "Locais",
    href: "/cinemas",
  },
  {
    icon: "🔔",
    name: "Receba Notificações",
    desc: "Adicione filmes à watchlist e receba alertas quando estiverem em sessão.",
    tag: "Em tempo real",
    href: "/watchlist",
  },
];

export function NearbyCinemasSection() {
  return (
    <SectionBlock
      id="comece"
      title="Comece a explorar agora"
      text="Conheça cada funcionalidade do Spectaculum e comece sua jornada como cinéfilo."
    >
      <StartGrid>
        {startItems.map((item) => (
          <StartCard key={item.name} href={item.href}>
            <CardIcon>{item.icon}</CardIcon>
            <CardName>{item.name}</CardName>
            <CardMeta>{item.desc}</CardMeta>
            <Tag>{item.tag}</Tag>
          </StartCard>
        ))}
      </StartGrid>
    </SectionBlock>
  );
}
