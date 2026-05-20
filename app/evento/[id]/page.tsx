"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getEventById, getParticipantsByEvent, updateEventMetrics } from '../../../services/api';
import { Event, Participant } from '../../../types';
import ParticipantsTable from '../../components/ParticipantsTable';

export default function EventoDetalhePage() {
    const router = useRouter();
    // Utilizamos useParams para garantir que o ID é lido corretamente no navegador
    const params = useParams();
    const eventId = params?.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!eventId) return; // Segurança extra

            try {
                setLoading(true);
                const [eventData, participantsData] = await Promise.all([
                    getEventById(eventId),
                    getParticipantsByEvent(eventId)
                ]);

                setEvent(eventData);
                setParticipants(participantsData);
            } catch (err) {
                setError("Erro ao carregar os dados do evento.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            loadData();
        }
    }, [eventId]);

    const handleMetricsUpdate = async (newCheckins: number, newErrors: number) => {
        if (!event) return;

        try {
            setEvent({
                ...event,
                checkin_count: newCheckins,
                error_count: newErrors,
            });

            await updateEventMetrics(event.id, newCheckins, newErrors);
        } catch (error) {
            console.error("Erro ao atualizar métricas no servidor", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-semibold">A carregar dados...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;
    if (!event) return <div className="p-8 text-center text-gray-500 font-semibold">Evento não encontrado.</div>;

    const expected = event.expected_count || 0;
    const checkins = event.checkin_count || 0;
    const errors = event.error_count || 0;

    const entryRate = expected > 0 ? Math.round((checkins / expected) * 100) : 0;
    const totalAttempts = checkins + errors;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <button
                onClick={() => router.push('/')}
                className="mb-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 font-medium"
            >
                ← Voltar
            </button>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                    <p className="text-gray-500 mt-1">{event.date} • {event.location || 'Local não definido'}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                    event.status === 'open' ? 'bg-green-100 text-green-700' :
                        event.status === 'closed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-200 text-gray-600'
                }`}>
                    {event.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Esperados</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{expected}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Check-ins</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{checkins}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Erros</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{errors}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-medium">Taxa de Entrada</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{entryRate}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ParticipantsTable
                        event={event}
                        initialParticipants={participants}
                        onMetricsUpdate={handleMetricsUpdate}
                    />
                </div>

                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full min-h-[300px]">
                        <h3 className="font-semibold text-gray-700 mb-4">Proporção de Sucesso/Erro</h3>

                        <div className="flex flex-col h-48 justify-end gap-4 mt-8">
                            <div className="flex items-end gap-4 h-full border-b border-gray-200 pb-2">
                                <div className="w-1/2 bg-green-500 rounded-t-md transition-all duration-500"
                                     style={{ height: `${totalAttempts === 0 ? 5 : (checkins / totalAttempts) * 100}%` }}>
                                </div>
                                <div className="w-1/2 bg-red-500 rounded-t-md transition-all duration-500"
                                     style={{ height: `${totalAttempts === 0 ? 5 : (errors / totalAttempts) * 100}%` }}>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 text-sm font-medium">
                            <span className="text-green-600 flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Sucesso</span>
                            <span className="text-red-600 flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Erros</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}