'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Input, Button, ErrorMsg } from '../components/shared/ui';

const Wrap = styled.div`
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
`;

const Box = styled.div`
    background: var(--bg-surface);
    border: 1px solid var(--stroke);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h2`
    color: var(--primary-soft);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Link = styled.a`
    color: var(--primary-soft);
    font-size: 0.85rem;
    text-align: center;
    cursor: pointer;
    &:hover { text-decoration: underline; }
`;

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(username, email, password);
            router.push('/movies');
        } catch (err: any) {
            setError(err.message ?? 'Erro ao cadastrar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrap>
            <Box>
                <Title>Criar Conta</Title>
                <Form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Nome de usuário"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Senha (mín. 6 caracteres)"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    {error && <ErrorMsg>{error}</ErrorMsg>}
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Criar Conta'}
                    </Button>
                </Form>
                <br />
                <Link onClick={() => router.push('/login')}>Já tem conta? Entre aqui</Link>
            </Box>
        </Wrap>
    );
}
