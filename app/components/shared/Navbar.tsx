'use client';

import Link from 'next/link';
import { useAuth } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Nav = styled.nav`
    background: rgba(20, 20, 24, 0.9);
    border-bottom: 1px solid var(--stroke);
    backdrop-filter: blur(8px);
    padding: 0 2rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
`;

const Brand = styled(Link)`
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary-soft);
    text-decoration: none;
`;

const Links = styled.div`
    display: flex;
    gap: 1.5rem;
    align-items: center;
`;

const NavLink = styled(Link)`
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    &:hover { color: var(--text-main); }
`;

const Button = styled.button`
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    &:hover { background: var(--primary-soft); }
`;

const UserBadge = styled.span`
    color: var(--primary-soft);
    font-size: 0.85rem;
`;

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <Nav>
            <Brand href="/">Spectaculum</Brand>
            <Links>
                <NavLink href="/movies">Filmes</NavLink>
                <NavLink href="/cinemas">Cinemas</NavLink>
                {user && (
                    <>
                        <NavLink href="/lists">Listas</NavLink>
                        <NavLink href="/watchlist">Watchlist</NavLink>
                        <NavLink href="/friends">Amigos</NavLink>
                        <UserBadge>Olá, {user.username}</UserBadge>
                        <Button onClick={handleLogout}>Sair</Button>
                    </>
                )}
                {!user && (
                    <>
                        <NavLink href="/login">Entrar</NavLink>
                        <Button onClick={() => router.push('/register')}>Cadastrar</Button>
                    </>
                )}
            </Links>
        </Nav>
    );
}
