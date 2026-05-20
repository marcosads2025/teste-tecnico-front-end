import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        // Busca o arquivo db.json que está na raiz do seu projeto
        const filePath = path.join(process.cwd(), 'db.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const db = JSON.parse(jsonData);

        // Pega o caminho exato que o frontend chamou (ex: /api/data/events)
        const { pathname, searchParams } = new URL(request.url);

        // Se o frontend pediu eventos
        if (pathname.includes('/events')) {
            const segments = pathname.split('/');
            const id = segments[segments.length - 1];

            // Se pediu um ID específico (ex: /events/1)
            if (id && id !== 'events') {
                const event = db.events.find((e: any) => e.id === Number(id) || e.id === id);
                return NextResponse.json(event || { error: 'Not found' }, { status: event ? 200 : 404 });
            }
            return NextResponse.json(db.events);
        }

        // Se o frontend pediu participantes
        if (pathname.includes('/participants')) {
            const eventId = searchParams.get('event_id');
            if (eventId) {
                const filtered = db.participants.filter((p: any) => p.event_id === Number(eventId) || p.event_id === eventId);
                return NextResponse.json(filtered);
            }
            return NextResponse.json(db.participants);
        }

        return NextResponse.json(db);
    } catch (error) {
        return NextResponse.json({ error: 'Erro no servidor interno da Vercel' }, { status: 500 });
    }
}