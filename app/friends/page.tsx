'use client';

import { useEffect, useState } from 'react';
import { api, FriendRequest, User } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Button, ErrorMsg, SmallText } from '../components/shared/ui';

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
    const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { router.push('/login'); return; }

        const load = async () => {
            try {
                const [f, all, incoming, outgoing] = await Promise.all([
                    api.users.friends(user.id),
                    api.users.list(),
                    api.users.incomingFriendRequests(user.id),
                    api.users.outgoingFriendRequests(user.id),
                ]);
                setFriends(f as User[]);
                setAllUsers((all as User[]).filter(u => u.id !== user.id));
                setIncomingRequests(incoming as FriendRequest[]);
                setOutgoingRequests(outgoing as FriendRequest[]);
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
            const targetUser = allUsers.find(u => u.id === friendId);
            if (targetUser) {
                setOutgoingRequests(prev => [
                    {
                        id: Date.now(),
                        requesterId: user.id,
                        receiverId: friendId,
                        status: 'pending',
                        createdAt: new Date().toISOString(),
                        receiver: { id: targetUser.id, username: targetUser.username },
                    },
                    ...prev,
                ]);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        if (!user) return;
        try {
            await api.users.acceptFriendRequest(user.id, requestId);
            const accepted = incomingRequests.find(request => request.id === requestId);
            if (accepted?.requester) {
                const requesterUser = allUsers.find(existingUser => existingUser.id === accepted.requester!.id);
                if (requesterUser) {
                    setFriends(prev => [...prev, requesterUser]);
                }
            }
            setIncomingRequests(prev => prev.filter(request => request.id !== requestId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        if (!user) return;
        try {
            await api.users.rejectFriendRequest(user.id, requestId);
            setIncomingRequests(prev => prev.filter(request => request.id !== requestId));
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
    const incomingUserIds = new Set(incomingRequests.map(request => request.requesterId));
    const outgoingUserIds = new Set(outgoingRequests.map(request => request.receiverId));
    const notFriends = allUsers.filter(
        existingUser =>
            !friendIds.has(existingUser.id) &&
            !incomingUserIds.has(existingUser.id) &&
            !outgoingUserIds.has(existingUser.id),
    );

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

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#f5b44a', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Solicitações Recebidas ({incomingRequests.length})
                </h2>
                {incomingRequests.map(request => (
                    <Card key={request.id}>
                        <ItemRow>
                            <div>
                                <UserName>{request.requester?.username ?? `Usuário #${request.requesterId}`}</UserName>
                                <SmallText>quer ser seu amigo</SmallText>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button type="button" onClick={() => handleAcceptRequest(request.id)}
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                    Aceitar
                                </Button>
                                <Button $variant="danger" type="button" onClick={() => handleRejectRequest(request.id)}
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                    Recusar
                                </Button>
                            </div>
                        </ItemRow>
                    </Card>
                ))}
                {incomingRequests.length === 0 && <SmallText>Você não recebeu solicitações.</SmallText>}
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#f5b44a', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Solicitações Enviadas ({outgoingRequests.length})
                </h2>
                {outgoingRequests.map(request => (
                    <Card key={request.id}>
                        <ItemRow>
                            <div>
                                <UserName>{request.receiver?.username ?? `Usuário #${request.receiverId}`}</UserName>
                                <SmallText>aguardando confirmação</SmallText>
                            </div>
                        </ItemRow>
                    </Card>
                ))}
                {outgoingRequests.length === 0 && <SmallText>Você não enviou solicitações.</SmallText>}
            </section>

            <section>
                <h2 style={{ color: '#f5b44a', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    Encontrar Pessoas
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
