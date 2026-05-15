'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, List, Movie } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import Link from 'next/link';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Button, Input, Row, ErrorMsg, SmallText, Tag } from '../../components/shared/ui';

const MovieRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export default function ListDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string);
    const { user } = useAuth();
    const [list, setList] = useState<List | null>(null);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');
    const [error, setError] = useState('');

    const loadList = async () => {
        try {
            const data = await api.lists.get(id);
            setList(data as List);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadList();
        api.movies.list().then(movies => setAllMovies(movies as Movie[])).catch(() => {});
    }, [id]);

    const handleAddMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMovieId) return;
        try {
            const updated = await api.lists.addMovie(id, parseInt(selectedMovieId));
            setList(updated as List);
            setSelectedMovieId('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRemoveMovie = async (movieId: number) => {
        try {
            const updated = await api.lists.removeMovie(id, movieId);
            setList(updated as List);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!list) return <PageContainer><SmallText>Carregando...</SmallText></PageContainer>;

    const moviesInList = list.movies ?? [];
    const moviesNotInList = allMovies.filter(m => !moviesInList.some(lm => lm.id === m.id));

    return (
        <PageContainer>
            <PageTitle>{list.name}</PageTitle>
            <Tag>{moviesInList.length} filme(s)</Tag>

            {error && <ErrorMsg style={{ marginTop: '1rem' }}>{error}</ErrorMsg>}

            {user && (
                <form onSubmit={handleAddMovie}>
                    <Row style={{ margin: '1.5rem 0' }}>
                        <select
                            value={selectedMovieId}
                            onChange={e => setSelectedMovieId(e.target.value)}
                            style={{
                                background: 'var(--bg-soft)',
                                border: '1px solid var(--stroke)',
                                borderRadius: 6,
                                padding: '0.6rem 1rem',
                                color: 'var(--text-main)',
                                fontSize: '0.9rem',
                                minWidth: 200,
                            }}
                        >
                            <option value="">Selecionar filme...</option>
                            {moviesNotInList.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <Button type="submit" disabled={!selectedMovieId}>+ Adicionar</Button>
                    </Row>
                </form>
            )}

            {moviesInList.map(movie => (
                <Card key={movie.id}>
                    <MovieRow>
                        <Link href={`/movies/${movie.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>
                            {movie.name}
                        </Link>
                        {user && (
                            <Button $variant="danger" type="button" onClick={() => handleRemoveMovie(movie.id)}
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                                Remover
                            </Button>
                        )}
                    </MovieRow>
                </Card>
            ))}

            {moviesInList.length === 0 && <SmallText style={{ marginTop: '1rem' }}>Nenhum filme nesta lista.</SmallText>}
        </PageContainer>
    );
}
