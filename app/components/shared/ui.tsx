import styled, { css } from 'styled-components';

export const PageContainer = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    color: var(--text-main);
`;

export const PageTitle = styled.h1`
    font-size: 1.8rem;
    color: var(--primary-soft);
    margin-bottom: 1.5rem;
`;

export const Card = styled.div`
    background: var(--bg-surface);
    border: 1px solid var(--stroke);
    border-radius: 10px;
    padding: 1.2rem;
    margin-bottom: 1rem;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'ghost' }>`
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    ${({ $variant = 'primary' }) => {
        if ($variant === 'danger') return css`background: #8f1d19; color: #fff; &:hover { background: #b3241f; }`;
        if ($variant === 'ghost') return css`background: transparent; color: var(--text-muted); border: 1px solid var(--stroke); &:hover { border-color: var(--primary-soft); color: var(--text-main); }`;
        return css`background: var(--primary); color: #fff; &:hover { background: var(--primary-soft); }`;
    }}
`;

export const Input = styled.input`
    background: var(--bg-soft);
    border: 1px solid var(--stroke);
    border-radius: 6px;
    padding: 0.6rem 1rem;
    color: var(--text-main);
    font-size: 0.9rem;
    width: 100%;
    &:focus { outline: none; border-color: var(--primary-soft); }
    &::placeholder { color: #777784; }
`;

export const Row = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
`;

export const Tag = styled.span`
    background: rgba(255, 90, 69, 0.16);
    color: var(--primary-soft);
    border-radius: 4px;
    padding: 0.2rem 0.6rem;
    font-size: 0.78rem;
`;

export const ErrorMsg = styled.p`
    color: var(--primary-soft);
    font-size: 0.85rem;
    margin-top: 0.4rem;
`;

export const SmallText = styled.p`
    color: var(--text-muted);
    font-size: 0.85rem;
`;
