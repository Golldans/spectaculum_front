'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, Movie, Comment, Rating, WatchlistItem } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Button, Input, Row, ErrorMsg, SmallText, Tag } from '../../components/shared/ui';

const Stars = styled.div`
    display: flex;
    gap: 0.3rem;
    margin: 0.5rem 0;
`;

const Star = styled.button<{ $active: boolean }>`
    background: none;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
    color: ${({ $active }) => ($active ? '#f5b44a' : '#4a3f5c')};
    padding: 0;
    line-height: 1;
`;

const Section = styled.section`
    margin-top: 2rem;
`;

const SectionTitle = styled.h2`
    color: #f5b44a;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(245,180,74,0.2);
`;

const CommentRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
`;

const HeroSection = styled.section`
    margin-top: 1rem;
    display: grid;
    grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
    gap: 1.25rem;
    align-items: start;

    @media (max-width: 760px) {
        grid-template-columns: 1fr;
    }
`;

const MovieCover = styled.img`
    width: 100%;
    max-width: 260px;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.16);
`;

const HeroContent = styled.div`
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 10px;
    padding: 1rem;
`;

const MetaText = styled.p`
    color: #d3cab9;
    margin: 0.4rem 0;
    line-height: 1.45;
`;

export default function MovieDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string);
    const { user } = useAuth();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [watchlistItem, setWatchlistItem] = useState<WatchlistItem | null>(null);
    const [newComment, setNewComment] = useState('');
    const [hoverStar, setHoverStar] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [error, setError] = useState('');

    const loadAll = async () => {
        try {
            const [m, c, r] = await Promise.all([
                api.movies.get(id),
                api.comments.byMovie(id),
                api.ratings.byMovie(id),
            ]);
            setMovie(m as Movie);
            setComments(c as Comment[]);
            setRatings(r as Rating[]);

            if (user) {
                const existing = (r as Rating[]).find(rt => rt.userId === user.id);
                if (existing) setUserRating(existing.score);

                const wl = await api.watchlist.get(user.id);
                const wlItem = (wl as WatchlistItem[]).find(w => w.movieId === id);
                if (wlItem) setWatchlistItem(wlItem);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => { loadAll(); }, [id, user]);

    const avgRating = ratings.length > 0
        ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)
        : null;

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        try {
            const c = await api.comments.create(newComment.trim(), id);
            setComments(prev => [c as Comment, ...prev]);
            setNewComment('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await api.comments.remove(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRate = async (score: number) => {
        if (!user) return;
        try {
            await api.ratings.rate(user.id, id, score);
            setUserRating(score);
            const r = await api.ratings.byMovie(id);
            setRatings(r as Rating[]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleWatchlist = async () => {
        if (!user) return;
        try {
            if (watchlistItem) {
                await api.watchlist.remove(watchlistItem.id);
                setWatchlistItem(null);
            } else {
                const item = await api.watchlist.add(user.id, id);
                setWatchlistItem(item as WatchlistItem);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!movie) return <PageContainer><SmallText>Carregando...</SmallText></PageContainer>;

    return (
        <PageContainer>
            <PageTitle>{movie.name}</PageTitle>

            <HeroSection>
                {movie.coverUrl && (
                    <MovieCover src={movie.coverUrl} alt={`Capa de ${movie.name}`} />
                )}

                <HeroContent>
                    {movie.year && <MetaText>Ano: {movie.year}</MetaText>}
                    {movie.imdbId && <MetaText>IMDb: {movie.imdbId}</MetaText>}
                    {movie.plot && <MetaText>{movie.plot}</MetaText>}
                    {!movie.plot && <MetaText>Sem descricao disponível para este filme.</MetaText>}
                </HeroContent>
            </HeroSection>

            <Row>
                {avgRating && <Tag>⭐ {avgRating} ({ratings.length} avaliações)</Tag>}
                {user && (
                    <Button
                        $variant={watchlistItem ? 'ghost' : 'primary'}
                        onClick={handleWatchlist}
                        type="button"
                    >
                        {watchlistItem ? '✓ Na Watchlist' : '+ Watchlist'}
                    </Button>
                )}
            </Row>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            {user && (
                <Section>
                    <SectionTitle>Sua Avaliação</SectionTitle>
                    <Stars>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star
                                key={s}
                                $active={s <= (hoverStar || userRating)}
                                onMouseEnter={() => setHoverStar(s)}
                                onMouseLeave={() => setHoverStar(0)}
                                onClick={() => handleRate(s)}
                                type="button"
                            >
                                ★
                            </Star>
                        ))}
                    </Stars>
                    {userRating > 0 && <SmallText>Você avaliou: {userRating}/5</SmallText>}
                </Section>
            )}

            <Section>
                <SectionTitle>Comentários ({comments.length})</SectionTitle>
                {user && (
                    <form onSubmit={handleComment}>
                        <Row style={{ marginBottom: '1rem' }}>
                            <Input
                                placeholder="Escreva um comentário..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                            />
                            <Button type="submit">Comentar</Button>
                        </Row>
                    </form>
                )}
                {comments.map(c => (
                    <Card key={c.id}>
                        <CommentRow>
                            <div>
                                <SmallText style={{ color: '#f5b44a', marginBottom: '0.25rem' }}>
                                    {c.user?.username ?? `Usuário #${c.userId}`}
                                </SmallText>
                                <p style={{ margin: 0, color: '#f9f4e9' }}>{c.content}</p>
                            </div>
                            {user && user.id === c.userId && (
                                <Button $variant="danger" type="button"
                                    onClick={() => handleDeleteComment(c.id)}
                                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                                    Remover
                                </Button>
                            )}
                        </CommentRow>
                    </Card>
                ))}
                {comments.length === 0 && <SmallText>Nenhum comentário ainda.</SmallText>}
            </Section>
        </PageContainer>
    );
}
