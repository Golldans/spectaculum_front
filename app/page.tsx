import { LandingPage } from "./components/landing";

export default function Home() {
  return <LandingPage />;
}
/*
"use client";

import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const sweep = keyframes`
  from {
    transform: translateX(-120%);
  }
  to {
    transform: translateX(120%);
  }
`;

const Page = styled.div`
  --bg-main: #09050f;
  --bg-surface: #181025;
  --bg-soft: #241b35;
  --text-main: #f9f4e9;
  --text-muted: #d2c9bb;
  --primary: #e64b2f;
  --primary-soft: #ff7b4d;
  --accent: #f5b44a;
  --stroke: rgba(245, 180, 74, 0.22);

  min-height: 100dvh;
  color: var(--text-main);
  background:
    radial-gradient(circle at 12% 12%, rgba(230, 75, 47, 0.33), transparent 44%),
    radial-gradient(circle at 88% 8%, rgba(245, 180, 74, 0.2), transparent 38%),
    linear-gradient(170deg, #05020a 0%, #120a1d 58%, #09050f 100%);
  font-family: var(--font-geist-sans), "Segoe UI", sans-serif;
`;

const Container = styled.div`
  width: min(1120px, calc(100% - 2.5rem));
  margin: 0 auto;
`;

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
  animation: ${fadeInUp} 0.6s ease-out both;
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
  animation: ${fadeInUp} 0.7s ease-out both;
`;

const HeroText = styled.p`
  margin: 1rem 0 0;
  color: var(--text-muted);
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  line-height: 1.6;
  max-width: 52ch;
  animation: ${fadeInUp} 0.8s ease-out both;
`;

const CtaRow = styled.div`
  margin-top: 1.7rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  animation: ${fadeInUp} 0.9s ease-out both;
`;

const PrimaryButton = styled.a`
  padding: 0.9rem 1.35rem;
  border-radius: 999px;
  font-weight: 700;
  color: #1a0f06;
  background: linear-gradient(145deg, var(--accent), var(--primary-soft));
  box-shadow: 0 10px 28px rgba(245, 180, 74, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 34px rgba(245, 180, 74, 0.38);
  }

  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 3px;
  }
`;

const GhostButton = styled.a`
  padding: 0.9rem 1.35rem;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  color: var(--text-main);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(245, 180, 74, 0.48);
  }

  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: 3px;
  }
`;

const HeroCard = styled.aside`
  border: 1px solid var(--stroke);
  border-radius: 1.2rem;
  background: linear-gradient(160deg, rgba(29, 20, 44, 0.9), rgba(13, 9, 21, 0.95));
  padding: 1.15rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease-out both;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 30%, rgba(245, 180, 74, 0.16), transparent 70%);
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

const Section = styled.section`
  padding: 2.2rem 0;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 2.25rem);
`;

const SectionText = styled.p`
  margin: 0.6rem 0 0;
  color: var(--text-muted);
  max-width: 62ch;
  line-height: 1.55;
`;

const Features = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.9rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  border: 1px solid var(--stroke);
  border-radius: 1rem;
  padding: 1rem;
  background: linear-gradient(165deg, rgba(31, 21, 47, 0.88), rgba(13, 8, 19, 0.94));
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

const FeatureTitle = styled.h3`
  margin: 0.8rem 0 0;
  font-size: 1.05rem;
`;

const FeatureText = styled.p`
  margin: 0.52rem 0 0;
  color: var(--text-muted);
  line-height: 1.45;
`;

const BenefitGrid = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.9rem;

  @media (max-width: 740px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.article`
  border-radius: 1rem;
  padding: 1rem;
  background: linear-gradient(150deg, rgba(39, 24, 23, 0.75), rgba(21, 13, 35, 0.9));
  border: 1px solid rgba(230, 75, 47, 0.35);
`;

const BenefitTitle = styled.h3`
  margin: 0;
  font-size: 1.02rem;
`;

const BenefitText = styled.p`
  margin: 0.45rem 0 0;
  color: var(--text-muted);
  line-height: 1.45;
`;

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

const Footer = styled.footer`
  border-top: 1px solid var(--stroke);
  margin-top: 1.8rem;
  padding: 1.4rem 0 2rem;
`;

const FooterInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  color: var(--text-muted);
`;

const FooterLinks = styled.nav`
  display: flex;
  gap: 1rem;
`;

const FooterLink = styled.a`
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-main);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
    border-radius: 0.3rem;
  }
`;

export default function Home() {
  const cinemas = [
    { name: "Cine Aurora", distance: "1.2 km", city: "Centro", sessions: "14:10, 16:40, 19:30" },
    { name: "Mirage IMAX", distance: "2.8 km", city: "Zona Norte", sessions: "13:20, 18:00, 21:15" },
    { name: "Sala Horizonte", distance: "3.6 km", city: "Bela Vista", sessions: "15:00, 17:45, 20:50" },
  ];

  return (
    <Page>
      <Container>
        <Hero>
          <Eyebrow>● Seu radar de cinema local</Eyebrow>
          <HeroGrid>
            <div>
              <HeroTitle>Encontre cinemas perto de voce em segundos.</HeroTitle>
              <HeroText>
                O Spectaculum ajuda voce a definir um alcance na sua regiao e descobrir
                opcoes de cinema por proximidade, horario e tipo de sala.
              </HeroText>
              <CtaRow>
                <PrimaryButton href="#cinemas">Encontrar cinemas proximos</PrimaryButton>
                <GhostButton href="#como-funciona">Ver como funciona</GhostButton>
              </CtaRow>
            </div>

            <HeroCard aria-label="preview de cinemas proximos">
              <HeroCardBody>
                <CardTitle>Preview na sua regiao</CardTitle>
                <DotLine />
                <CinemaList>
                  {cinemas.map((cinema) => (
                    <CinemaItem key={cinema.name}>
                      <CinemaName>{cinema.name}</CinemaName>
                      <Distance>{cinema.distance}</Distance>
                    </CinemaItem>
                  ))}
                </CinemaList>
              </HeroCardBody>
            </HeroCard>
          </HeroGrid>
        </Hero>

        <Section id="como-funciona">
          <SectionTitle>Como funciona</SectionTitle>
          <SectionText>
            Em tres passos voce configura sua area e recebe uma lista objetiva de cinemas
            disponiveis por perto.
          </SectionText>
          <Features>
            <FeatureCard>
              <FeatureStep>1</FeatureStep>
              <FeatureTitle>Escolha o alcance</FeatureTitle>
              <FeatureText>
                Defina um raio de busca em torno da sua regiao para filtrar opcoes realmente proximas.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureStep>2</FeatureStep>
              <FeatureTitle>Veja cinemas elegiveis</FeatureTitle>
              <FeatureText>
                O sistema lista salas ativas com distancia estimada e horarios de sessao em destaque.
              </FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureStep>3</FeatureStep>
              <FeatureTitle>Escolha sua proxima sessao</FeatureTitle>
              <FeatureText>
                Compare rapidamente e tome a decisao com base em tempo, local e formato de exibicao.
              </FeatureText>
            </FeatureCard>
          </Features>
        </Section>

        <Section>
          <SectionTitle>Por que usar o Spectaculum</SectionTitle>
          <SectionText>
            Uma camada de descoberta pensada para quem quer menos busca manual e mais tempo para curtir o filme.
          </SectionText>
          <BenefitGrid>
            <BenefitCard>
              <BenefitTitle>Busca orientada por proximidade</BenefitTitle>
              <BenefitText>
                Resultados focados em distancia real para evitar deslocamentos longos.
              </BenefitText>
            </BenefitCard>
            <BenefitCard>
              <BenefitTitle>Leitura rapida de disponibilidade</BenefitTitle>
              <BenefitText>
                Horarios e detalhes essenciais em primeiro plano, sem tela poluida.
              </BenefitText>
            </BenefitCard>
            <BenefitCard>
              <BenefitTitle>Base pronta para API de mapas</BenefitTitle>
              <BenefitText>
                Estrutura da interface preparada para integrar dados de localizacao na proxima etapa.
              </BenefitText>
            </BenefitCard>
            <BenefitCard>
              <BenefitTitle>Experiencia clara no celular</BenefitTitle>
              <BenefitText>
                Layout responsivo desde o inicio para consulta rapida na rua ou em casa.
              </BenefitText>
            </BenefitCard>
          </BenefitGrid>
        </Section>

        <Section id="cinemas">
          <SectionTitle>Mock de cinemas proximos</SectionTitle>
          <SectionText>
            Exemplo visual inicial de como os cinemas podem aparecer quando a busca por regiao estiver ativa.
          </SectionText>
          <NearbyGrid>
            <NearbyCard>
              <NearbyTop>
                <NearbyName>Cine Aurora</NearbyName>
                <Distance>1.2 km</Distance>
              </NearbyTop>
              <NearbyMeta>Centro • Salas 2D e 3D • Sessoes: 14:10, 16:40, 19:30</NearbyMeta>
              <Tag>Mais proximo</Tag>
            </NearbyCard>
            <NearbyCard>
              <NearbyTop>
                <NearbyName>Mirage IMAX</NearbyName>
                <Distance>2.8 km</Distance>
              </NearbyTop>
              <NearbyMeta>Zona Norte • IMAX • Sessoes: 13:20, 18:00, 21:15</NearbyMeta>
              <Tag>Alta demanda</Tag>
            </NearbyCard>
            <NearbyCard>
              <NearbyTop>
                <NearbyName>Sala Horizonte</NearbyName>
                <Distance>3.6 km</Distance>
              </NearbyTop>
              <NearbyMeta>Bela Vista • VIP • Sessoes: 15:00, 17:45, 20:50</NearbyMeta>
              <Tag>Conforto premium</Tag>
            </NearbyCard>
          </NearbyGrid>
        </Section>

        <Section>
          <SectionTitle>FAQ rapido</SectionTitle>
          <FaqGrid>
            <FaqCard>
              <FaqQuestion>Ja usa geolocalizacao real?</FaqQuestion>
              <FaqAnswer>
                Ainda nao. Esta landing apresenta o conceito e o fluxo visual inicial da plataforma.
              </FaqAnswer>
            </FaqCard>
            <FaqCard>
              <FaqQuestion>Posso escolher o raio de busca?</FaqQuestion>
              <FaqAnswer>
                Sim. O produto foi pensado exatamente para definir o alcance da regiao e filtrar os cinemas.
              </FaqAnswer>
            </FaqCard>
            <FaqCard>
              <FaqQuestion>Vai integrar com API do Google?</FaqQuestion>
              <FaqAnswer>
                Sim, esta na proxima fase do projeto para alimentar os resultados com dados reais.
              </FaqAnswer>
            </FaqCard>
            <FaqCard>
              <FaqQuestion>Funciona no celular?</FaqQuestion>
              <FaqAnswer>
                O layout atual ja foi estruturado para adaptar em mobile e desktop sem perda de leitura.
              </FaqAnswer>
            </FaqCard>
          </FaqGrid>
        </Section>

        <Footer>
          <FooterInner>
            <span>2026 Spectaculum. Descubra seu proximo cinema.</span>
            <FooterLinks aria-label="links de rodape">
              <FooterLink href="#">Sobre</FooterLink>
              <FooterLink href="#">Contato</FooterLink>
              <FooterLink href="#">Privacidade</FooterLink>
            </FooterLinks>
          </FooterInner>
        </Footer>
      </Container>
    </Page>
  );
}
*/
