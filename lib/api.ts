const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(error.message ?? 'Erro na requisição');
    }

    if (res.status === 204) return undefined as T;
    return res.json();
}

export interface MovieInput {
    name: string;
    coverUrl?: string;
    year?: string;
    plot?: string;
    imdbId?: string;
}

export interface ScreeningInput {
    movieId: number;
    cinemaId: number;
    exhibitionAt: string;
}

// Auth
export const api = {
    auth: {
        register: (data: { username: string; email: string; password: string }) =>
            request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        login: (data: { email: string; password: string }) =>
            request<{ access_token: string; user: { id: number; username: string; email: string } }>(
                '/auth/login', { method: 'POST', body: JSON.stringify(data) }
            ),
    },
    movies: {
        list: (name?: string) => request<Movie[]>(`/movie${name ? `?name=${encodeURIComponent(name)}` : ''}`),
        get: (id: number) => request<Movie>(`/movie/${id}`),
        create: (data: MovieInput) =>
            request<Movie>('/movie', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: number, data: MovieInput) =>
            request<Movie>(`/movie/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        coverSuggestions: (name: string, year?: string) => {
            const params = new URLSearchParams({ name });
            if (year?.trim()) params.set('year', year.trim());
            return request<MovieCoverSuggestion[]>(`/movie/cover-suggestions/search?${params.toString()}`);
        },
        remove: (id: number) => request(`/movie/${id}`, { method: 'DELETE' }),
    },
    cinemas: {
        list: (name?: string, location?: string) => {
            const params = new URLSearchParams();
            if (name) params.set('name', name);
            if (location) params.set('location', location);
            return request<Cinema[]>(`/cinema${params.toString() ? `?${params}` : ''}`);
        },
        get: (id: number) => request<Cinema>(`/cinema/${id}`),
        create: (data: Omit<Cinema, 'id' | 'createdAt' | 'updatedAt'>) =>
            request<Cinema>('/cinema', { method: 'POST', body: JSON.stringify(data) }),
        remove: (id: number) => request(`/cinema/${id}`, { method: 'DELETE' }),
    },
    screenings: {
        byCinema: (cinemaId: number) => request<Screening[]>(`/screening/cinema/${cinemaId}`),
        create: (data: ScreeningInput) =>
            request<Screening>('/screening', { method: 'POST', body: JSON.stringify(data) }),
        notifications: () => request<ScreeningNotification[]>('/screening/notifications'),
    },
    lists: {
        list: (userId?: number) => request<List[]>(`/list${userId ? `?userId=${userId}` : ''}`),
        get: (id: number) => request<List>(`/list/${id}`),
        create: (name: string, userId: number) =>
            request<List>('/list', { method: 'POST', body: JSON.stringify({ name, userId }) }),
        update: (id: number, name: string) =>
            request<List>(`/list/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
        addMovie: (listId: number, movieId: number) =>
            request<List>(`/list/${listId}/movies`, { method: 'POST', body: JSON.stringify({ movieId }) }),
        removeMovie: (listId: number, movieId: number) =>
            request(`/list/${listId}/movies/${movieId}`, { method: 'DELETE' }),
        remove: (id: number) => request(`/list/${id}`, { method: 'DELETE' }),
    },
    watchlist: {
        get: (userId: number) => request<WatchlistItem[]>(`/watchlist?userId=${userId}`),
        add: (userId: number, movieId: number) =>
            request<WatchlistItem>('/watchlist', { method: 'POST', body: JSON.stringify({ userId, movieId }) }),
        remove: (id: number) => request(`/watchlist/${id}`, { method: 'DELETE' }),
    },
    comments: {
        byMovie: (movieId: number) => request<Comment[]>(`/comment/movie/${movieId}`),
        create: (content: string, movieId: number) =>
            request<Comment>('/comment', { method: 'POST', body: JSON.stringify({ content, movieId }) }),
        remove: (id: number) => request(`/comment/${id}`, { method: 'DELETE' }),
    },
    ratings: {
        byMovie: (movieId: number) => request<Rating[]>(`/rating/movie/${movieId}`),
        rate: (userId: number, movieId: number, score: number) =>
            request<Rating>('/rating', { method: 'POST', body: JSON.stringify({ userId, movieId, score }) }),
        remove: (id: number) => request(`/rating/${id}`, { method: 'DELETE' }),
    },
    users: {
        list: () => request<User[]>('/users'),
        get: (id: number) => request<User>(`/users/${id}`),
        friends: (id: number) => request<User[]>(`/users/${id}/friends`),
        addFriend: (id: number, friendId: number) =>
            request(`/users/${id}/friends/${friendId}`, { method: 'POST' }),
        removeFriend: (id: number, friendId: number) =>
            request(`/users/${id}/friends/${friendId}`, { method: 'DELETE' }),
    },
};

// Types
export interface Movie {
    id: number;
    name: string;
    coverUrl?: string;
    year?: string;
    plot?: string;
    imdbId?: string;
    createdAt?: string;
}
export interface MovieCoverSuggestion {
    title: string;
    year?: string;
    plot?: string;
    imdbId: string;
    coverUrl: string;
}
export interface Cinema { id: number; name: string; location: string; startTime: string; endTime: string; }
export interface Screening { id: number; movieId: number; cinemaId: number; exhibitionAt: string; }
export interface ScreeningNotification {
    id: number;
    movieId: number;
    movieName: string;
    cinemaId: number;
    cinemaName: string;
    cinemaLocation: string;
    exhibitionAt: string;
}
export interface List { id: number; name: string; userId: number; movies?: Movie[]; }
export interface WatchlistItem { id: number; userId: number; movieId: number; createdAt?: string; }
export interface Comment {
    id: number;
    content: string;
    userId: number;
    movieId: number;
    createdAt?: string;
    user?: { id: number; username: string };
}
export interface Rating { id: number; score: number; userId: number; movieId: number; }
export interface User { id: number; username: string; email: string; friends?: User[]; }
