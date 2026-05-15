'use client';

import { useEffect, useState } from 'react';
import { api, WatchlistItem, Movie } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Button, Row, ErrorMsg, SmallText } from '../components/shared/ui';

const MovieName = styled.span`
    color: #f9f4e9;
    font-weight: 500;
`;

const ItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export default function WatchlistPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [movieMap, setMovieMap] = useState<Record<number, Movie>>({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { router.push('/login'); return; }

        const load = async () => {
            try {
                const wl = await api.watchlist.get(user.id) as WatchlistItem[];
                setItems(wl);
                if (wl.length > 0) {
                    const movies = await api.movies.list() as Movie[];
                    const map: Record<number, Movie> = {};
                    movies.forEach(m => { map[m.id] = m; });
                    setMovieMap(map);
                }
            } catch (err: any) {
                setError(err.message);
            }
        };
        load();
    }, [user]);

    const handleRemove = async (id: number) => {
        try {
            await api.watchlist.remove(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Minha Watchlist</PageTitle>
            <SmallText style={{ marginBottom: '1.5rem' }}>Filmes que você quer assistir</SmallText>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            {items.map(item => {
                const movie = movieMap[item.movieId];
                return (
                    <Card key={item.id}>
                        <ItemRow>
                            <Link href={`/movies/${item.movieId}`} style={{ textDecoration: 'none' }}>
                                <MovieName>{movie?.name ?? `Filme #${item.movieId}`}</MovieName>
                            </Link>
                            <Row>
                                <Link href={`/movies/${item.movieId}`}>
                                    <Button $variant="ghost" type="button"
                                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                        Ver
                                    </Button>
                                </Link>
                                <Button $variant="danger" type="button" onClick={() => handleRemove(item.id)}
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                    Remover
                                </Button>
                            </Row>
                        </ItemRow>
                    </Card>
                );
            })}

            {items.length === 0 && (
                <SmallText style={{ marginTop: '2rem' }}>
                    Sua watchlist está vazia. Explore <Link href="/movies" style={{ color: '#f5b44a' }}>os filmes</Link> e adicione!
                </SmallText>
            )}
        </PageContainer>
    );
}
