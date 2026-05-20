import { Event, Participant } from "../types";

// CORREÇÃO AQUI: Apontando para a porta onde o json-server deve rodar
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

export async function updateParticipantStatus(id: string, newStatus: 'inside' | 'outside', newCount: number): Promise<void> {
    const res = await fetch(`${API_URL}/participants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: newStatus,
            checkin_count: newCount
        }),
    });
    if (!res.ok) throw new Error("Erro ao atualizar participante");
}

export async function updateEventMetrics(eventId: string, checkins: number, errors: number): Promise<void> {
    const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkin_count: checkins, error_count: errors }),
    });
    if (!res.ok) throw new Error("Erro ao atualizar métricas do evento");
}

export interface CheckinPayload {
    event_id: string;
    participant_id: string;
    timestamp: string;
    success: boolean;
    action: 'entry' | 'exit';
    error_reason: 'already_checked_in' | 'event_closed' | null;
}

export async function registerCheckinHistory(checkinData: CheckinPayload): Promise<void> {
    const response = await fetch(`${API_URL}/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkinData),
    });
    if (!response.ok) throw new Error("Erro ao registrar histórico");
}