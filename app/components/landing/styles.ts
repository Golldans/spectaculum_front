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

export const sweep = keyframes`
  from {
    transform: translateX(-120%);
  }
  to {
    transform: translateX(120%);
  }
`;

export const Page = styled.div`
  --bg-main: #0b0b0d;
  --bg-surface: #141418;
  --bg-soft: #1d1d24;
  --text-main: #f5f5f7;
  --text-muted: #a8a8b3;
  --primary: #d7352a;
  --primary-soft: #ff5a45;
  --accent: #ff7b63;
  --stroke: rgba(255, 90, 69, 0.28);

  min-height: 100dvh;
  color: var(--text-main);
  background:
    radial-gradient(circle at 12% 12%, rgba(215, 53, 42, 0.33), transparent 44%),
    radial-gradient(circle at 88% 8%, rgba(255, 90, 69, 0.18), transparent 38%),
    linear-gradient(170deg, #08080a 0%, #131318 58%, #0b0b0d 100%);
  font-family: var(--font-geist-sans), "Segoe UI", sans-serif;
`;

export const Container = styled.div`
  width: min(1120px, calc(100% - 2.5rem));
  margin: 0 auto;
`;

export const Section = styled.section`
  padding: 2.2rem 0;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 2.25rem);
`;

export const SectionText = styled.p`
  margin: 0.6rem 0 0;
  color: var(--text-muted);
  max-width: 62ch;
  line-height: 1.55;
`;

export const FadeInBlock = styled.div`
  animation: ${fadeInUp} 0.8s ease-out both;
`;

export const Footer = styled.footer`
  border-top: 1px solid var(--stroke);
  margin-top: 1.8rem;
  padding: 1.4rem 0 2rem;
`;

export const FooterInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  color: var(--text-muted);
`;

export const FooterLinks = styled.nav`
  display: flex;
  gap: 1rem;
`;

export const FooterLink = styled.a`
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
