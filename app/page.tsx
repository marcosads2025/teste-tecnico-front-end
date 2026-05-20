"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvents } from '../services/api';
import { Event } from '../types';

export default function DashboardPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para os filtros e ordenação
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('asc'); // asc = Mais próximos

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (err) {
                setError("Erro ao carregar os eventos da API.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Lógica combinada: Busca + Filtro + Ordenação
    let processedEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
        processedEvents = processedEvents.filter(event => event.status === statusFilter);
    }

    processedEvents.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    if (loading) return <div className="p-8 text-center text-gray-500 font-semibold">Carregando painel...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;

    // Função auxiliar para traduzir e colorir o status
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'open': return { text: 'ABERTO', classes: 'bg-green-100 text-green-700' };
            case 'closed': return { text: 'ENCERRADO', classes: 'bg-red-100 text-red-700' };
            case 'cancelled': return { text: 'CANCELADO', classes: 'bg-orange-100 text-orange-700' };
            default: return { text: status.toUpperCase(), classes: 'bg-gray-100 text-gray-700' };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Painel de Eventos</h1>
                <p className="text-gray-500 mt-1 text-sm">Gerencie e acompanhe as métricas dos seus eventos.</p>
            </div>

            {/* Barra de Controles (Busca, Status e Data) */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    className="p-2.5 border border-gray-300 rounded-lg flex-grow shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Todos os Status</option>
                    <option value="open">Abertos</option>
                    <option value="closed">Encerrados</option>
                    <option value="cancelled">Cancelados</option>
                </select>

                <select
                    className="p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Data (Mais próximos)</option>
                    <option value="desc">Data (Mais distantes)</option>
                </select>
            </div>

            {/* Grid de Cards */}
            {processedEvents.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">Nenhum evento encontrado para estes filtros.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {processedEvents.map(event => {
                        const statusBadge = getStatusStyle(event.status);
                        return (
                            <div key={event.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex justify-between items-start mb-4 gap-2">
                                        <h3 className="font-bold text-[1.05rem] text-gray-900 leading-tight">{event.name}</h3>
                                        <span className={`text-[0.65rem] px-2 py-1 rounded font-bold tracking-wider ${statusBadge.classes}`}>
                                            {statusBadge.text}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                            <span className="text-blue-500 text-base">🗓️</span> {event.date}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                            <span className="text-red-500 text-base">📍</span> {event.location || 'Local a definir'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                        <span className="text-purple-500 text-base">👥</span> {event.expected_count || 0} esperados
                                    </div>
                                    <Link
                                        href={`/evento/${event.id}`}
                                        className="text-blue-600 font-semibold text-xs hover:underline"
                                    >
                                        Ver detalhes →
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}