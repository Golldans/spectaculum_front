'use client';

import { useEffect, useState } from 'react';
import { api, List } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Grid, Button, Input, Row, ErrorMsg, SmallText } from '../components/shared/ui';
import Link from 'next/link';

const SectionTitle = styled.h2`
    color: #f5b44a;
    font-size: 1.1rem;
    margin: 2rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(245,180,74,0.2);
`;

const ListName = styled.h3`
    color: #f9f4e9;
    margin: 0 0 0.25rem;
    font-size: 1rem;
`;

const AuthorText = styled.p`
    color: #8f84a0;
    font-size: 0.78rem;
    margin: 0 0 0.4rem;
`;

function ListCard({
    list,
    onDelete,
}: {
    list: List;
    onDelete?: () => void;
}) {
    return (
        <Card>
            <ListName>
                <Link href={`/lists/${list.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {list.name}
                </Link>
            </ListName>
            <AuthorText>por {list.user?.username ?? `Usuário #${list.userId}`}</AuthorText>
            <SmallText>{list.movies?.length ?? 0} filme(s)</SmallText>

            <Row style={{ marginTop: '0.75rem' }}>
                <Link href={`/lists/${list.id}`}>
                    <Button $variant="ghost" type="button" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                        Ver lista
                    </Button>
                </Link>
                {onDelete && (
                    <Button $variant="danger" type="button" onClick={onDelete}
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                        Remover
                    </Button>
                )}
            </Row>
        </Card>
    );
}

export default function ListsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [myLists, setMyLists] = useState<List[]>([]);
    const [otherLists, setOtherLists] = useState<List[]>([]);
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLists = async () => {
        if (!user) return;
        try {
            const all = await api.lists.list() as List[];
            setMyLists(all.filter(l => l.userId === user.id));
            setOtherLists(all.filter(l => l.userId !== user.id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        fetchLists();
    }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!user) return;
        const name = newName.trim();
        if (!name) { setError('Digite um nome para a lista.'); return; }
        setLoading(true);
        try {
            const list = await api.lists.create(name, user.id) as List;
            setMyLists(prev => [list, ...prev]);
            setNewName('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.lists.remove(id);
            setMyLists(prev => prev.filter(l => l.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Listas</PageTitle>

            <SectionTitle>Minhas Listas</SectionTitle>

            <form onSubmit={handleCreate}>
                <Row style={{ marginBottom: '1.25rem' }}>
                    <Input
                        placeholder="Nome da nova lista..."
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        style={{ maxWidth: 300 }}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Criando...' : '+ Nova Lista'}
                    </Button>
                </Row>
            </form>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            {myLists.length === 0
                ? <SmallText>Você ainda não tem listas.</SmallText>
                : (
                    <Grid>
                        {myLists.map(list => (
                            <ListCard
                                key={list.id}
                                list={list}
                                onDelete={() => handleDelete(list.id)}
                            />
                        ))}
                    </Grid>
                )
            }

            <SectionTitle>Listas da Comunidade</SectionTitle>

            {otherLists.length === 0
                ? <SmallText>Nenhuma lista de outros usuários ainda.</SmallText>
                : (
                    <Grid>
                        {otherLists.map(list => (
                            <ListCard
                                key={list.id}
                                list={list}
                            />
                        ))}
                    </Grid>
                )
            }
        </PageContainer>
    );
}
