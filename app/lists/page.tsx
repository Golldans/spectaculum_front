'use client';

import { useEffect, useState } from 'react';
import { api, List, Movie } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Grid, Button, Input, Row, ErrorMsg, SmallText } from '../components/shared/ui';
import Link from 'next/link';

const ListName = styled.h3`
    color: #f9f4e9;
    margin: 0 0 0.4rem;
    font-size: 1rem;
`;

export default function ListsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [lists, setLists] = useState<List[]>([]);
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLists = async () => {
        try {
            const data = await api.lists.list(user?.id);
            setLists(data as List[]);
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
        if (!user || !newName.trim()) return;
        setLoading(true);
        try {
            const list = await api.lists.create(newName.trim(), user.id);
            setLists(prev => [list as List, ...prev]);
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
            setLists(prev => prev.filter(l => l.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Minhas Listas</PageTitle>

            <form onSubmit={handleCreate}>
                <Row style={{ marginBottom: '1.5rem' }}>
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

            <Grid>
                {lists.map(list => (
                    <Card key={list.id}>
                        <ListName>
                            <Link href={`/lists/${list.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {list.name}
                            </Link>
                        </ListName>
                        <SmallText>{list.movies?.length ?? 0} filme(s)</SmallText>
                        <Row style={{ marginTop: '0.75rem' }}>
                            <Link href={`/lists/${list.id}`}>
                                <Button $variant="ghost" type="button" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                                    Ver lista
                                </Button>
                            </Link>
                            <Button $variant="danger" type="button" onClick={() => handleDelete(list.id)}
                                style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                                Remover
                            </Button>
                        </Row>
                    </Card>
                ))}
            </Grid>

            {lists.length === 0 && <SmallText style={{ marginTop: '2rem' }}>Você ainda não tem listas.</SmallText>}
        </PageContainer>
    );
}
