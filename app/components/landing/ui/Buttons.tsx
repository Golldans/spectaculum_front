"use client";

import styled from "styled-components";

export const PrimaryButton = styled.a`
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

export const GhostButton = styled.a`
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
