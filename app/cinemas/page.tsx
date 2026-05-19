'use client';

import { useEffect, useState } from 'react';
import { api, Cinema, Movie, Screening } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Grid, Button, Input, Row, ErrorMsg, SmallText, Tag } from '../components/shared/ui';

const CinemaName = styled.h3`
    color: #f9f4e9;
    margin: 0 0 0.4rem;
    font-size: 1rem;
`;

const FormGrid = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding: 1.2rem;
    background: #181025;
    border: 1px solid rgba(245,180,74,0.22);
    border-radius: 10px;
`;

const Select = styled.select`
    background: var(--bg-soft);
    border: 1px solid var(--stroke);
    border-radius: 6px;
    padding: 0.6rem 1rem;
    color: var(--text-main);
    font-size: 0.9rem;
    width: 100%;
`;

const SessionList = styled.ul`
    margin: 0.6rem 0 0;
    padding-left: 1rem;
    color: #d9cfbf;
    font-size: 0.82rem;
`;

const FormLoadingOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(24, 16, 37, 0.72);
    border-radius: 10px;
    z-index: 2;
`;

const Spinner = styled.div`
    width: 28px;
    height: 28px;
    border: 3px solid rgba(245, 180, 74, 0.25);
    border-top-color: #f5b44a;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

export default function CinemasPage() {
    const { user } = useAuth();
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviesLoading, setMoviesLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [sessionsByCinema, setSessionsByCinema] = useState<Record<number, Screening[]>>({});
    const [sessionFormByCinema, setSessionFormByCinema] = useState<Record<number, { movieId: string; exhibitionAt: string }>>({});
    const [isLookingUpCep, setIsLookingUpCep] = useState(false);
    const [form, setForm] = useState({
        name: '',
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        complement: '',
    });

    const formatCepInput = (value: string): string => {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    };

    const fetchCinemas = async () => {
        try {
            const data = await api.cinemas.list(search || undefined);
            setCinemas(data as Cinema[]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchMovies = async () => {
        if (!user) return;
        try {
            setMoviesLoading(true);
            const data = await api.movies.list();
            setMovies(data as Movie[]);
        } catch {
            setMovies([]);
        } finally {
            setMoviesLoading(false);
        }
    };

    useEffect(() => { fetchCinemas(); }, []);

    useEffect(() => {
        fetchMovies();
    }, [user]);

    useEffect(() => {
        if (!cinemas.length) return;

        Promise.all(
            cinemas.map(async (cinema) => {
                const sessions = await api.screenings.byCinema(cinema.id);
                return [cinema.id, sessions as Screening[]] as const;
            }),
        )
            .then((entries) => setSessionsByCinema(Object.fromEntries(entries)))
            .catch(() => {});
    }, [cinemas]);

    useEffect(() => {
        const cepDigits = form.cep.replace(/\D/g, '');
        if (cepDigits.length !== 8) return;

        let cancelled = false;
        const timeout = setTimeout(async () => {
            try {
                setIsLookingUpCep(true);
                const data = await api.cinemas.lookupCep(cepDigits);
                if (cancelled) return;

                setForm((prev) => {
                    const currentCepDigits = prev.cep.replace(/\D/g, '');
                    if (currentCepDigits !== cepDigits) return prev;
                    return {
                        ...prev,
                        cep: data.cep,
                        street: data.street,
                        neighborhood: data.neighborhood,
                        city: data.city,
                        state: data.state,
                    };
                });
                setError('');
            } catch (err: any) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setIsLookingUpCep(false);
            }
        }, 1000);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [form.cep]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLookingUpCep) return;
        try {
            const cinema = await api.cinemas.create({
                name: form.name,
                location: '',
                cep: form.cep,
                street: form.street,
                number: form.number,
                neighborhood: form.neighborhood,
                city: form.city,
                state: form.state,
                complement: form.complement,
            });
            const createdCinema = cinema as Cinema;
            setCinemas(prev => [createdCinema, ...prev]);
            setSessionsByCinema(prev => ({
                ...prev,
                [createdCinema.id]: [],
            }));
            setSessionFormByCinema(prev => ({
                ...prev,
                [createdCinema.id]: { movieId: '', exhibitionAt: '' },
            }));

            if (!movies.length) {
                await fetchMovies();
            }

            setForm({
                name: '',
                cep: '',
                street: '',
                number: '',
                neighborhood: '',
                city: '',
                state: '',
                complement: '',
            });
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

    const handleSessionChange = (cinemaId: number, field: 'movieId' | 'exhibitionAt', value: string) => {
        setSessionFormByCinema((prev) => ({
            ...prev,
            [cinemaId]: {
                movieId: prev[cinemaId]?.movieId ?? '',
                exhibitionAt: prev[cinemaId]?.exhibitionAt ?? '',
                [field]: value,
            },
        }));
    };

    const handleSchedule = async (cinemaId: number) => {
        const formState = sessionFormByCinema[cinemaId];
        if (!formState?.movieId || !formState.exhibitionAt) return;

        try {
            const created = await api.screenings.create({
                cinemaId,
                movieId: Number(formState.movieId),
                exhibitionAt: new Date(formState.exhibitionAt).toISOString(),
            });

            setSessionsByCinema((prev) => ({
                ...prev,
                [cinemaId]: [...(prev[cinemaId] ?? []), created as Screening]
                    .sort((a, b) => new Date(a.exhibitionAt).getTime() - new Date(b.exhibitionAt).getTime()),
            }));

            setSessionFormByCinema((prev) => ({
                ...prev,
                [cinemaId]: { movieId: '', exhibitionAt: '' },
            }));
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
                        {isLookingUpCep && (
                            <FormLoadingOverlay>
                                <Spinner />
                            </FormLoadingOverlay>
                        )}
                        <Input disabled={isLookingUpCep} placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                        <Input
                            disabled={isLookingUpCep}
                            placeholder="CEP"
                            value={form.cep}
                            onChange={e => setForm(f => ({ ...f, cep: formatCepInput(e.target.value) }))}
                            required
                        />
                        <Input disabled={isLookingUpCep} placeholder="Logradouro" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} required />
                        <Input disabled={isLookingUpCep} placeholder="Número" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} required />
                        <Input disabled={isLookingUpCep} placeholder="Complemento (opcional)" value={form.complement} onChange={e => setForm(f => ({ ...f, complement: e.target.value }))} />
                        <Input disabled={isLookingUpCep} placeholder="Bairro" value={form.neighborhood} onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))} required />
                        <Input disabled={isLookingUpCep} placeholder="Cidade" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                        <Input disabled={isLookingUpCep} placeholder="UF" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))} required />
                    </FormGrid>
                    <Button type="submit" disabled={isLookingUpCep}>Criar Cinema</Button>
                </form>
            )}

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <Grid style={{ marginTop: '1.5rem' }}>
                {cinemas.map(cinema => (
                    <Card key={cinema.id}>
                        <CinemaName>{cinema.name}</CinemaName>
                        <Tag>📍 {cinema.location || [cinema.street, cinema.number, cinema.city].filter(Boolean).join(', ')}</Tag>
                        {user && (
                            <>
                                <Row style={{ marginTop: '0.85rem' }}>
                                    <Select
                                        value={sessionFormByCinema[cinema.id]?.movieId ?? ''}
                                        onChange={(e) => handleSessionChange(cinema.id, 'movieId', e.target.value)}
                                        disabled={moviesLoading || movies.length === 0}
                                    >
                                        <option value="">Filme em sessão...</option>
                                        {moviesLoading && <option value="" disabled>Carregando filmes...</option>}
                                        {!moviesLoading && movies.length === 0 && <option value="" disabled>Nenhum filme cadastrado</option>}
                                        {!moviesLoading && movies.map((movie) => (
                                            <option key={movie.id} value={movie.id}>{movie.name}</option>
                                        ))}
                                    </Select>
                                    <Input
                                        type="datetime-local"
                                        value={sessionFormByCinema[cinema.id]?.exhibitionAt ?? ''}
                                        onChange={(e) => handleSessionChange(cinema.id, 'exhibitionAt', e.target.value)}
                                    />
                                    <Button type="button" onClick={() => handleSchedule(cinema.id)} disabled={moviesLoading || movies.length === 0}>
                                        Agendar sessão
                                    </Button>
                                </Row>

                                {(sessionsByCinema[cinema.id]?.length ?? 0) > 0 && (
                                    <SessionList>
                                        {sessionsByCinema[cinema.id].map((session) => {
                                            const movieName = movies.find((movie) => movie.id === session.movieId)?.name ?? `Filme #${session.movieId}`;
                                            return (
                                                <li key={session.id}>
                                                    {movieName} em {new Date(session.exhibitionAt).toLocaleString('pt-BR')}
                                                </li>
                                            );
                                        })}
                                    </SessionList>
                                )}
                            </>
                        )}
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
