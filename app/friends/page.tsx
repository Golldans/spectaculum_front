'use client';

import { useEffect, useState } from 'react';
import { api, User } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Button, Input, Row, ErrorMsg, SmallText, Tag } from '../components/shared/ui';

const UserName = styled.span`
    color: #f9f4e9;
    font-weight: 500;
`;

const ItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export default function FriendsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [friends, setFriends] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { router.push('/login'); return; }

        const load = async () => {
            try {
                const [f, all] = await Promise.all([
                    api.users.friends(user.id),
                    api.users.list(),
                ]);
                setFriends(f as User[]);
                setAllUsers((all as User[]).filter(u => u.id !== user.id));
            } catch (err: any) {
                setError(err.message);
            }
        };
        load();
    }, [user]);

    const handleAdd = async (friendId: number) => {
        if (!user) return;
        try {
            await api.users.addFriend(user.id, friendId);
            const newFriend = allUsers.find(u => u.id === friendId);
            if (newFriend) setFriends(prev => [...prev, newFriend]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRemove = async (friendId: number) => {
        if (!user) return;
        try {
            await api.users.removeFriend(user.id, friendId);
            setFriends(prev => prev.filter(f => f.id !== friendId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const friendIds = new Set(friends.map(f => f.id));
    const notFriends = allUsers.filter(u => !friendIds.has(u.id));

    return (
        <PageContainer>
            <PageTitle>Amigos</PageTitle>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#f5b44a', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Meus Amigos ({friends.length})
                </h2>
                {friends.map(friend => (
                    <Card key={friend.id}>
                        <ItemRow>
                            <div>
                                <UserName>{friend.username}</UserName>
                                <SmallText>{friend.email}</SmallText>
                            </div>
                            <Button $variant="danger" type="button" onClick={() => handleRemove(friend.id)}
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                Remover
                            </Button>
                        </ItemRow>
                    </Card>
                ))}
                {friends.length === 0 && <SmallText>Você ainda não tem amigos adicionados.</SmallText>}
            </section>

            <section>
                <h2 style={{ color: '#f5b44a', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Adicionar Amigos
                </h2>
                {notFriends.map(u => (
                    <Card key={u.id}>
                        <ItemRow>
                            <div>
                                <UserName>{u.username}</UserName>
                                <SmallText>{u.email}</SmallText>
                            </div>
                            <Button type="button" onClick={() => handleAdd(u.id)}
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                + Adicionar
                            </Button>
                        </ItemRow>
                    </Card>
                ))}
                {notFriends.length === 0 && <SmallText>Nenhum usuário disponível para adicionar.</SmallText>}
            </section>
        </PageContainer>
    );
}
