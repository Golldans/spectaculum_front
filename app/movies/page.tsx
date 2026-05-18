'use client';

import { useEffect, useState } from 'react';
import { api, Movie, WatchlistItem } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import Link from 'next/link';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Grid, Button, Input, Row, ErrorMsg } from '../components/shared/ui';

const MovieTitle = styled.h3`
    color: #f9f4e9;
    margin: 0 0 0.5rem;
    font-size: 1rem;
`;

const MovieCover = styled.img`
    display: block;
    width: 100%;
    max-width: 180px;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    margin: 0 auto 0.75rem;
`;

const EmptyPoster = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 180px;
    aspect-ratio: 2 / 3;
    border-radius: 8px;
    border: 1px dashed rgba(255, 255, 255, 0.16);
    margin: 0 auto 0.75rem;
    color: #a89f92;
    font-size: 0.78rem;
`;

const YearBadge = styled.span`
    display: inline-block;
    font-size: 0.72rem;
    color: #f5b44a;
    margin-bottom: 0.5rem;
`;

export default function MoviesPage() {
    const { user } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [watchlistByMovie, setWatchlistByMovie] = useState<Record<number, number>>({});
    const [watchlistLoadingMovieId, setWatchlistLoadingMovieId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    const fetchMovies = async () => {
        try {
            const data = await api.movies.list(search || undefined);
            setMovies(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => { fetchMovies(); }, []);

    useEffect(() => {
        if (!user) {
            setWatchlistByMovie({});
            return;
        }

        api.watchlist.get(user.id)
            .then((items) => {
                const mapped = (items as WatchlistItem[]).reduce<Record<number, number>>((acc, item) => {
                    acc[item.movieId] = item.id;
                    return acc;
                }, {});
                setWatchlistByMovie(mapped);
            })
            .catch(() => setWatchlistByMovie({}));
    }, [user]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMovies();
    };

    const handleDelete = async (id: number) => {
        try {
            await api.movies.remove(id);
            setMovies(prev => prev.filter(m => m.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleQuickWatchlist = async (movieId: number) => {
        if (!user || watchlistLoadingMovieId === movieId) return;

        setWatchlistLoadingMovieId(movieId);
        try {
            const existingItemId = watchlistByMovie[movieId];
            if (existingItemId) {
                await api.watchlist.remove(existingItemId);
                setWatchlistByMovie((prev) => {
                    const updated = { ...prev };
                    delete updated[movieId];
                    return updated;
                });
            } else {
                const created = await api.watchlist.add(user.id, movieId);
                const item = created as WatchlistItem;
                setWatchlistByMovie((prev) => ({ ...prev, [movieId]: item.id }));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setWatchlistLoadingMovieId(null);
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
                    {user && (
                        <Link href="/movies/new">
                            <Button type="button">+ Novo Filme</Button>
                        </Link>
                    )}
                </Row>
            </form>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <Grid>
                {movies.map(movie => (
                    <Card key={movie.id}>
                        {movie.coverUrl && (
                            <MovieCover src={movie.coverUrl} alt={`Capa de ${movie.name}`} />
                        )}
                        {!movie.coverUrl && <EmptyPoster>Sem capa</EmptyPoster>}
                        <MovieTitle>
                            <Link href={`/movies/${movie.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                {movie.name}
                            </Link>
                        </MovieTitle>
                        {movie.year && <YearBadge>{movie.year}</YearBadge>}
                        <Row>
                            <Link href={`/movies/${movie.id}`}>
                                <Button $variant="ghost" type="button" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                    Ver detalhes
                                </Button>
                            </Link>
                            {user && (
                                <Button
                                    $variant={watchlistByMovie[movie.id] ? 'ghost' : 'primary'}
                                    type="button"
                                    onClick={() => handleQuickWatchlist(movie.id)}
                                    disabled={watchlistLoadingMovieId === movie.id}
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                                >
                                    {watchlistLoadingMovieId === movie.id
                                        ? '...'
                                        : watchlistByMovie[movie.id]
                                            ? '✓ Watchlist'
                                            : '+ Watchlist'}
                                </Button>
                            )}
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
