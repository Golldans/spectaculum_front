'use client';

import { useEffect, useState } from 'react';
import { api, Movie } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import Link from 'next/link';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Grid, Button, Input, Row, ErrorMsg } from '../components/shared/ui';

const MovieTitle = styled.h3`
    color: #f9f4e9;
    margin: 0 0 0.5rem;
    font-size: 1rem;
`;

export default function MoviesPage() {
    const { user } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [search, setSearch] = useState('');
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchMovies = async () => {
        try {
            const data = await api.movies.list(search || undefined);
            setMovies(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => { fetchMovies(); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMovies();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setLoading(true);
        try {
            const movie = await api.movies.create(newName.trim()) as Movie;
            setMovies(prev => [movie, ...prev]);
            setNewName('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.movies.remove(id);
            setMovies(prev => prev.filter(m => m.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Filmes</PageTitle>

            <form onSubmit={handleSearch}>
                <Row style={{ marginBottom: '1.5rem' }}>
                    <Input
                        placeholder="Buscar por nome..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ maxWidth: 300 }}
                    />
                    <Button type="submit" $variant="ghost">Buscar</Button>
                    <Button $variant="ghost" type="button" onClick={() => { setSearch(''); setTimeout(fetchMovies, 0); }}>
                        Limpar
                    </Button>
                </Row>
            </form>

            {user && (
                <form onSubmit={handleCreate}>
                    <Row style={{ marginBottom: '1.5rem' }}>
                        <Input
                            placeholder="Nome do novo filme..."
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            style={{ maxWidth: 300 }}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adicionando...' : '+ Adicionar Filme'}
                        </Button>
                    </Row>
                </form>
            )}

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <Grid>
                {movies.map(movie => (
                    <Card key={movie.id}>
                        <MovieTitle>
                            <Link href={`/movies/${movie.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {movie.name}
                            </Link>
                        </MovieTitle>
                        <Row>
                            <Link href={`/movies/${movie.id}`}>
                                <Button $variant="ghost" type="button" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                    Ver detalhes
                                </Button>
                            </Link>
                            {user && (
                                <Button $variant="danger" type="button" onClick={() => handleDelete(movie.id)}
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                    Remover
                                </Button>
                            )}
                        </Row>
                    </Card>
                ))}
            </Grid>

            {movies.length === 0 && (
                <p style={{ color: '#d2c9bb', marginTop: '2rem' }}>Nenhum filme encontrado.</p>
            )}
        </PageContainer>
    );
}
