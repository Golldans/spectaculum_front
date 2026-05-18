'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api, List, Movie, ListComment, Rating } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import Link from 'next/link';
import styled from 'styled-components';
import { PageContainer, PageTitle, Card, Button, Input, Row, ErrorMsg, SmallText, Tag } from '../../components/shared/ui';

const MovieRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
`;

const MovieInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const RatingLine = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
`;

const RatingLabel = styled.span`
    color: #8f84a0;
    font-size: 0.78rem;
    min-width: 132px;
`;

const StarsWrap = styled.div`
    display: inline-flex;
    gap: 0.1rem;
`;

const StarGlyph = styled.span<{ $fill: number }>`
    font-size: 0.95rem;
    line-height: 1;
    background: linear-gradient(
        90deg,
        #f5b44a ${({ $fill }) => $fill}%,
        #4a3f5c ${({ $fill }) => $fill}%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const RatingValue = styled.span`
    color: #8f84a0;
    font-size: 0.75rem;
`;

const SectionTitle = styled.h2`
    color: #f5b44a;
    font-size: 1.1rem;
    margin: 2rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(245,180,74,0.2);
`;

const CommentCard = styled.div`
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 0.6rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
`;

const CommentMeta = styled.p`
    color: #8f84a0;
    font-size: 0.78rem;
    margin: 0 0 0.25rem;
`;

interface MovieScoreInfo {
    ownerScore: number | null;
    averageScore: number | null;
    totalRatings: number;
}

function roundToHalf(value: number): number {
    return Math.round(value * 2) / 2;
}

function RatingStars({ value }: { value: number | null }) {
    if (value === null) return <RatingValue>-</RatingValue>;

    const normalized = Math.min(5, Math.max(0, value));
    const rounded = roundToHalf(normalized);

    return (
        <>
            <StarsWrap>
                {[0, 1, 2, 3, 4].map((index) => {
                    const rawFill = rounded - index;
                    const fill = Math.max(0, Math.min(1, rawFill)) * 100;
                    return (
                        <StarGlyph key={index} $fill={fill}>★</StarGlyph>
                    );
                })}
            </StarsWrap>
            <RatingValue>{rounded.toFixed(1)}</RatingValue>
        </>
    );
}

export default function ListDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string);
    const { user } = useAuth();
    const [list, setList] = useState<List | null>(null);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');
    const [comments, setComments] = useState<ListComment[]>([]);
    const [movieScores, setMovieScores] = useState<Record<number, MovieScoreInfo>>({});
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');

    const loadList = async () => {
        try {
            const data = await api.lists.get(id);
            setList(data as List);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const loadComments = async () => {
        const c = await api.lists.getComments(id).catch(() => []);
        setComments(c as ListComment[]);
    };

    const loadMovieScores = async (movies: Movie[], ownerId: number) => {
        if (!movies.length) {
            setMovieScores({});
            return;
        }

        const entries = await Promise.all(
            movies.map(async (movie) => {
                const ratings = await api.ratings.byMovie(movie.id).catch(() => []) as Rating[];
                const totalRatings = ratings.length;
                const ownerScore = ratings.find(r => r.userId === ownerId)?.score ?? null;
                const averageScore = totalRatings
                    ? ratings.reduce((sum, rating) => sum + rating.score, 0) / totalRatings
                    : null;

                return [movie.id, { ownerScore, averageScore, totalRatings }] as const;
            }),
        );

        setMovieScores(Object.fromEntries(entries));
    };

    useEffect(() => {
        loadList();
        loadComments();
        api.movies.list().then(movies => setAllMovies(movies as Movie[])).catch(() => {});
    }, [id]);

    useEffect(() => {
        if (!list) return;
        loadMovieScores(list.movies ?? [], list.userId);
    }, [list]);

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

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        try {
            const c = await api.lists.addComment(id, newComment.trim()) as ListComment;
            setComments(prev => [c, ...prev]);
            setNewComment('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await api.lists.removeComment(id, commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
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
            <SmallText style={{ marginBottom: '0.5rem' }}>
                por {list.user?.username ?? `Usuário #${list.userId}`}
            </SmallText>

            <Row style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                <Tag>{moviesInList.length} filme(s)</Tag>
            </Row>

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
                        <MovieInfo>
                            <Link href={`/movies/${movie.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>
                                {movie.name}
                            </Link>
                            <RatingLine>
                                <RatingLabel>Dono da lista</RatingLabel>
                                <RatingStars value={movieScores[movie.id]?.ownerScore ?? null} />
                            </RatingLine>
                            <RatingLine>
                                <RatingLabel>Média do filme</RatingLabel>
                                <RatingStars value={movieScores[movie.id]?.averageScore ?? null} />
                                <RatingValue>
                                    {movieScores[movie.id]?.totalRatings ? `(${movieScores[movie.id].totalRatings} avaliações)` : '(sem avaliações)'}
                                </RatingValue>
                            </RatingLine>
                        </MovieInfo>
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

            {/* Comments */}
            <SectionTitle>Comentários ({comments.length})</SectionTitle>

            {user && (
                <form onSubmit={handleComment}>
                    <Row style={{ marginBottom: '1rem' }}>
                        <Input
                            placeholder="Deixe um comentário sobre esta lista..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <Button type="submit" disabled={!newComment.trim()}>Enviar</Button>
                    </Row>
                </form>
            )}

            {comments.map(c => (
                <CommentCard key={c.id}>
                    <div style={{ flex: 1 }}>
                        <CommentMeta>{c.user?.username ?? `Usuário #${c.userId}`}</CommentMeta>
                        <p style={{ margin: 0, color: '#d3cab9', lineHeight: 1.5 }}>{c.content}</p>
                    </div>
                    {user && user.id === c.userId && (
                        <Button $variant="danger" type="button" onClick={() => handleDeleteComment(c.id)}
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', flexShrink: 0 }}>
                            ✕
                        </Button>
                    )}
                </CommentCard>
            ))}

            {comments.length === 0 && <SmallText>Nenhum comentário ainda. Seja o primeiro!</SmallText>}
        </PageContainer>
    );
}
