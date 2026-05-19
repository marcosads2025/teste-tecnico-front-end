"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Event } from "../types";
import { getEvents } from "../services/api";

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar os eventos. Verifique se a API está rodando.");
            } finally {
                setLoading(false);
            }
        }

        loadEvents();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 animate-pulse text-lg">Carregando eventos...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-600 bg-red-50 p-4 rounded-md border border-red-200">{error}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel de Eventos</h1>

                {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">Nenhum evento encontrado no momento.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.name}</h2>
                                <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
                                    <p>Data: {new Date(event.date).toLocaleDateString('pt-BR')}</p>
                                    <p>Capacidade: {event.expectedParticipants} pessoas</p>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {event.status === 'open' ? 'Aberto' : 'Encerrado'}
                  </span>

                                    <Link href={`/evento/${event.id}`} className="text-blue-600 font-medium text-sm hover:text-blue-800 hover:underline">
                                        Ver detalhes &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}