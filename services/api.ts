import { Event } from "../types";

const API_URL = "http://localhost:3001";

export async function getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_URL}/events`);

    if (!response.ok) {
        throw new Error("Erro ao buscar os eventos na API.");
    }

    return response.json();
}

export async function getEventById(id: string): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${id}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar os detalhes do evento.");
    }

    return response.json();
}