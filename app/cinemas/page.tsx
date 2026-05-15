'use client';

import { useEffect, useState } from 'react';
import { api, Cinema } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Grid, Button, Input, Row, ErrorMsg, SmallText, Tag } from '../components/shared/ui';

const CinemaName = styled.h3`
    color: #f9f4e9;
    margin: 0 0 0.4rem;
    font-size: 1rem;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding: 1.2rem;
    background: #181025;
    border: 1px solid rgba(245,180,74,0.22);
    border-radius: 10px;
`;

export default function CinemasPage() {
    const { user } = useAuth();
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', location: '', startTime: '', endTime: '' });

    const fetchCinemas = async () => {
        try {
            const data = await api.cinemas.list(search || undefined);
            setCinemas(data as Cinema[]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => { fetchCinemas(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const cinema = await api.cinemas.create({
                name: form.name,
                location: form.location,
                startTime: form.startTime,
                endTime: form.endTime,
            });
            setCinemas(prev => [cinema as Cinema, ...prev]);
            setForm({ name: '', location: '', startTime: '', endTime: '' });
            setShowForm(false);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.cinemas.remove(id);
            setCinemas(prev => prev.filter(c => c.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Cinemas</PageTitle>

            <Row style={{ marginBottom: '1.5rem' }}>
                <Input
                    placeholder="Buscar por nome ou local..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth: 300 }}
                    onKeyDown={e => e.key === 'Enter' && fetchCinemas()}
                />
                <Button $variant="ghost" onClick={fetchCinemas} type="button">Buscar</Button>
                {user && (
                    <Button onClick={() => setShowForm(v => !v)} type="button">
                        {showForm ? 'Cancelar' : '+ Novo Cinema'}
                    </Button>
                )}
            </Row>

            {showForm && (
                <form onSubmit={handleCreate}>
                    <FormGrid>
                        <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                        <Input placeholder="Localização" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
                        <div>
                            <SmallText>Início das sessões</SmallText>
                            <Input type="datetime-local" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required />
                        </div>
                        <div>
                            <SmallText>Fim das sessões</SmallText>
                            <Input type="datetime-local" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required />
                        </div>
                    </FormGrid>
                    <Button type="submit">Criar Cinema</Button>
                </form>
            )}

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <Grid style={{ marginTop: '1.5rem' }}>
                {cinemas.map(cinema => (
                    <Card key={cinema.id}>
                        <CinemaName>{cinema.name}</CinemaName>
                        <Tag>📍 {cinema.location}</Tag>
                        <SmallText style={{ marginTop: '0.5rem' }}>
                            {new Date(cinema.startTime).toLocaleString('pt-BR')} — {new Date(cinema.endTime).toLocaleString('pt-BR')}
                        </SmallText>
                        {user && (
                            <Row style={{ marginTop: '0.75rem' }}>
                                <Button $variant="danger" type="button" onClick={() => handleDelete(cinema.id)}
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                    Remover
                                </Button>
                            </Row>
                        )}
                    </Card>
                ))}
            </Grid>

            {cinemas.length === 0 && <SmallText style={{ marginTop: '2rem' }}>Nenhum cinema cadastrado.</SmallText>}
        </PageContainer>
    );
}
