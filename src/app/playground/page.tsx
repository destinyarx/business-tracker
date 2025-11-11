'use client'
import { useState } from 'react';

export default function Playground() {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    async function callApi() {
        try {
        const res = await fetch("http://localhost:3000/customers/4", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setResult(data);
        setError(null);

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setResult(null);
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Test NestJS API</h1>
            <button onClick={callApi}>Call API</button>

            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
            {error && <p style={{ color: "red" }}>❌ {error}</p>}
        </div>
    )
}