"use client";

import { BenefitsSection } from "./sections/BenefitsSection";
import { FaqSection } from "./sections/FaqSection";
import { HeroSection } from "./sections/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { NearbyCinemasSection } from "./sections/NearbyCinemasSection";
import { Container, Footer, FooterInner, FooterLink, FooterLinks, Page } from "./styles";

export function LandingPage() {
  return (
    <Page>
      <Container>
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <NearbyCinemasSection />
        <FaqSection />
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
