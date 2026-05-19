import { Event, Participant } from "../types";

const API_URL = "http://localhost:3001";

export async function getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error("Erro ao buscar os eventos na API.");
    return response.json();
}

export async function getEventById(id: string): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar detalhes do evento.");
    return response.json();
}

export async function getParticipantsByEvent(eventId: string): Promise<Participant[]> {
    const res = await fetch(`${API_URL}/participants?event_id=${eventId}`);
    if (!res.ok) throw new Error("Erro ao buscar participantes");
    return res.json();
}

export async function updateParticipantStatus(id: string, newStatus: 'inside' | 'outside', currentCount: number): Promise<void> {
    const res = await fetch(`${API_URL}/participants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: newStatus,
            checkin_count: currentCount + 1
        }),
    });
    if (!res.ok) throw new Error("Erro ao atualizar participante");
}

export async function updateEventMetrics(eventId: string, checkins: number, errors: number): Promise<void> {
    await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkin_count: checkins, error_count: errors }),
    });
}