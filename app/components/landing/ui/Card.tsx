"use client";

import styled from "styled-components";

export const BaseCard = styled.article`
  border-radius: 1rem;
  border: 1px solid var(--stroke);
  background: linear-gradient(165deg, rgba(31, 21, 47, 0.88), rgba(13, 8, 19, 0.94));
  padding: 1rem;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
`;

export const CardText = styled.p`
  margin: 0.52rem 0 0;
  color: var(--text-muted);
  line-height: 1.45;
`;
