'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { api, ScreeningNotification } from '../../../lib/api';

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

const BellButton = styled.button`
    position: relative;
    background: transparent;
    color: var(--text-main);
    border: 1px solid var(--stroke);
    border-radius: 8px;
    width: 38px;
    height: 38px;
    cursor: pointer;
`;

const BellBadge = styled.span`
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 999px;
    background: #ff6e40;
    color: white;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const NotificationWrap = styled.div`
    position: relative;
`;

const NotificationMenu = styled.div`
    position: absolute;
    right: 0;
    top: 46px;
    width: 360px;
    max-height: 360px;
    overflow: auto;
    background: #17141d;
    border: 1px solid var(--stroke);
    border-radius: 10px;
    padding: 0.5rem;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
`;

const NotificationItem = styled.div`
    padding: 0.6rem 0.55rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    &:last-child { border-bottom: none; }
`;

const NotificationText = styled.p`
    color: #e8dfd0;
    font-size: 0.8rem;
    margin: 0;
    line-height: 1.4;
`;

const EmptyText = styled.p`
    color: #b8ad9b;
    font-size: 0.8rem;
    margin: 0.5rem;
`;

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<ScreeningNotification[]>([]);
    const [openNotifications, setOpenNotifications] = useState(false);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        const loadNotifications = async () => {
            try {
                const data = await api.screenings.notifications();
                setNotifications(data as ScreeningNotification[]);
            } catch {
                setNotifications([]);
            }
        };

        loadNotifications();
        const intervalId = setInterval(loadNotifications, 60000);
        return () => clearInterval(intervalId);
    }, [user]);

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
                        <NavLink href="/movies/new">Novo Filme</NavLink>
                        <NavLink href="/watchlist">Watchlist</NavLink>
                        <NavLink href="/friends">Amigos</NavLink>
                        <NotificationWrap>
                            <BellButton type="button" onClick={() => setOpenNotifications((value) => !value)} title="Notificações">
                                🔔
                                {notifications.length > 0 && <BellBadge>{notifications.length > 9 ? '9+' : notifications.length}</BellBadge>}
                            </BellButton>
                            {openNotifications && (
                                <NotificationMenu>
                                    {notifications.length === 0 && <EmptyText>Nenhuma sessão nova para sua watchlist.</EmptyText>}
                                    {notifications.map((notification) => (
                                        <NotificationItem key={notification.id}>
                                            <NotificationText>
                                                {notification.movieName} sera exibido em {new Date(notification.exhibitionAt).toLocaleString('pt-BR')} no cinema {notification.cinemaName} ({notification.cinemaLocation}).
                                            </NotificationText>
                                        </NotificationItem>
                                    ))}
                                </NotificationMenu>
                            )}
                        </NotificationWrap>
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
