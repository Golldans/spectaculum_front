'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { api, MovieCoverSuggestion } from '../../../lib/api';
import { useAuth } from '../../../lib/auth';
import { PageContainer, PageTitle, Card, Button, Input, Row, ErrorMsg } from '../../components/shared/ui';

const SuggestionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.85rem;
`;

const SuggestionCard = styled.button<{ $active: boolean }>`
    border: 1px solid ${({ $active }) => ($active ? 'var(--primary-soft)' : 'var(--stroke)')};
    background: var(--bg-surface);
    border-radius: 10px;
    cursor: pointer;
    padding: 0.65rem;
    text-align: left;
    transition: border-color 0.2s, transform 0.2s;
    &:hover { transform: translateY(-2px); }
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

const SuggestionTitle = styled.p`
    margin: 0.4rem 0 0;
    color: var(--text-muted);
    font-size: 0.8rem;
    line-height: 1.2;
`;

const SuggestionMeta = styled.p`
    margin: 0.25rem 0 0;
    color: #b7ad9e;
    font-size: 0.72rem;
    line-height: 1.3;
`;

const SuggestionPlot = styled.p`
    margin: 0.35rem 0 0;
    color: #dad0bf;
    font-size: 0.74rem;
    line-height: 1.35;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.75rem;
    margin: 0.75rem 0 1rem;
`;

const PlotInput = styled.textarea`
    background: var(--bg-soft);
    border: 1px solid var(--stroke);
    border-radius: 6px;
    padding: 0.6rem 1rem;
    color: var(--text-main);
    font-size: 0.9rem;
    width: 100%;
    min-height: 90px;
    resize: vertical;
    &:focus { outline: none; border-color: var(--primary-soft); }
    &::placeholder { color: #777784; }
`;

export default function NewMoviePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [newName, setNewName] = useState('');
    const [newCoverUrl, setNewCoverUrl] = useState('');
    const [newYear, setNewYear] = useState('');
    const [newPlot, setNewPlot] = useState('');
    const [newImdbId, setNewImdbId] = useState('');
    const [coverSuggestions, setCoverSuggestions] = useState<MovieCoverSuggestion[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) router.replace('/login');
    }, [user, router]);

    useEffect(() => {
        const name = newName.trim();
        if (name.length < 2) {
            setCoverSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoadingSuggestions(true);
            try {
                const suggestions = await api.movies.coverSuggestions(name, newYear.trim() || undefined);
                setCoverSuggestions(suggestions as MovieCoverSuggestion[]);
            } catch {
                setCoverSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        }, 450);

        return () => clearTimeout(timeoutId);
    }, [newName, newYear]);

    const chooseSuggestion = (suggestion: MovieCoverSuggestion) => {
        setNewName(suggestion.title || newName);
        setNewCoverUrl(suggestion.coverUrl || '');
        setNewYear(suggestion.year || '');
        setNewPlot(suggestion.plot || '');
        setNewImdbId(suggestion.imdbId || '');
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setLoading(true);
        setError('');
        try {
            await api.movies.create({
                name: newName.trim(),
                coverUrl: newCoverUrl.trim() || undefined,
                year: newYear.trim() || undefined,
                plot: newPlot.trim() || undefined,
                imdbId: newImdbId.trim() || undefined,
            });
            router.push('/movies');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <PageContainer>
            <Row style={{ justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <PageTitle>Novo Filme</PageTitle>
                <Link href="/movies">
                    <Button type="button" $variant="ghost">Voltar para filmes</Button>
                </Link>
            </Row>

            <Card>
                <form onSubmit={handleCreate}>
                    <FormGrid>
                        <Input
                            placeholder="Nome do filme..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <Input
                            placeholder="Ano (opcional)..."
                            value={newYear}
                            onChange={(e) => setNewYear(e.target.value)}
                        />
                        <Input
                            placeholder="IMDb ID (opcional)..."
                            value={newImdbId}
                            onChange={(e) => setNewImdbId(e.target.value)}
                        />
                        <Input
                            placeholder="URL da capa (opcional)..."
                            value={newCoverUrl}
                            onChange={(e) => setNewCoverUrl(e.target.value)}
                        />
                    </FormGrid>

                    <PlotInput
                        placeholder="Sinopse (opcional)..."
                        value={newPlot}
                        onChange={(e) => setNewPlot(e.target.value)}
                    />

                    <Row style={{ marginTop: '0.9rem', marginBottom: '0.3rem' }}>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Filme'}
                        </Button>
                    </Row>

                    {error && <ErrorMsg>{error}</ErrorMsg>}
                </form>
            </Card>

            <Card>
                <h3 style={{ marginTop: 0, color: 'var(--primary-soft)' }}>Sugestoes OMDb</h3>
                {loadingSuggestions && <p style={{ color: '#d2c9bb' }}>Buscando sugestoes...</p>}
                {!loadingSuggestions && coverSuggestions.length === 0 && (
                    <p style={{ color: '#d2c9bb' }}>Digite pelo menos 2 letras no nome para ver sugestoes.</p>
                )}
                {!loadingSuggestions && coverSuggestions.length > 0 && (
                    <SuggestionsGrid>
                        {coverSuggestions.map((suggestion) => (
                            <SuggestionCard
                                key={suggestion.imdbId}
                                type="button"
                                $active={newImdbId === suggestion.imdbId}
                                onClick={() => chooseSuggestion(suggestion)}
                            >
                                {suggestion.coverUrl ? (
                                    <MovieCover src={suggestion.coverUrl} alt={suggestion.title} />
                                ) : (
                                    <EmptyPoster>Sem poster</EmptyPoster>
                                )}
                                <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                                <SuggestionMeta>{suggestion.year || 'Ano desconhecido'} • {suggestion.imdbId}</SuggestionMeta>
                                {suggestion.plot && <SuggestionPlot>{suggestion.plot}</SuggestionPlot>}
                            </SuggestionCard>
                        ))}
                    </SuggestionsGrid>
                )}
            </Card>
        </PageContainer>
    );
}
