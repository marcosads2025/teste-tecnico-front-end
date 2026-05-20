import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Definindo as interfaces corretas para substituir o 'any'
interface EventItem {
    id: string | number;
    [key: string]: unknown; // Permite outras propriedades dinâmicas do evento
}

interface ParticipantItem {
    id: string | number;
    event_id: string | number;
    [key: string]: unknown; // Permite outras propriedades dinâmicas do participante
}

interface DbStructure {
    events: EventItem[];
    participants: ParticipantItem[];
}

export async function GET(request: Request) {
    try {
        const filePath = path.join(process.cwd(), 'db.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const db: DbStructure = JSON.parse(jsonData);

        const { pathname, searchParams } = new URL(request.url);

        // Se o frontend pediu eventos
        if (pathname.includes('/events')) {
            const segments = pathname.split('/');
            const id = segments[segments.length - 1];

            if (id && id !== 'events') {
                // Tipagem corrigida de 'any' para 'EventItem'
                const event = db.events.find((e: EventItem) => e.id === Number(id) || e.id === id);
                return NextResponse.json(event || { error: 'Not found' }, { status: event ? 200 : 404 });
            }
            return NextResponse.json(db.events);
        }

        // Se o frontend pediu participantes
        if (pathname.includes('/participants')) {
            const eventId = searchParams.get('event_id');
            if (eventId) {
                // Tipagem corrigida de 'any' para 'ParticipantItem'
                const filtered = db.participants.filter(
                    (p: ParticipantItem) => p.event_id === Number(eventId) || p.event_id === eventId
                );
                return NextResponse.json(filtered);
            }
            return NextResponse.json(db.participants);
        }

        return NextResponse.json(db);
    } catch {
        // CORREÇÃO: Removemos a variável 'error' que não estava sendo usada
        return NextResponse.json({ error: 'Erro no servidor interno da Vercel' }, { status: 500 });
    }
}