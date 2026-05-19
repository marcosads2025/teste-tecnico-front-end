"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Event } from "../types";
import { getEvents } from "../services/api";

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados dos Filtros
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (err) {
                setError("Erro ao carregar a lista de eventos. Verifique sua conexão.");
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);

    // Lógica combinada de Busca, Filtro e Ordenação
    const filteredEvents = events
        .filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
        .filter((event) => (statusFilter === "all" ? true : event.status === statusFilter))
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

    // Tradução visual de status
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">ABERTO</span>;
            case 'closed': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">ENCERRADO</span>;
            case 'cancelled': return <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">CANCELADO</span>;
            default: return null;
        }
    };

    if (loading) return <main className="min-h-screen flex justify-center items-center"><p className="animate-pulse text-lg text-gray-500">Buscando eventos...</p></main>;
    if (error) return <main className="min-h-screen flex justify-center items-center"><p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p></main>;

    return (
        <main className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel de Eventos</h1>
                    <p className="text-gray-500">Gerencie e acompanhe as métricas dos seus eventos.</p>
                </header>

                {/* BARRA DE FILTROS */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="open">Abertos</option>
                        <option value="closed">Encerrados</option>
                        <option value="cancelled">Cancelados</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="asc">Data (Mais próximos)</option>
                        <option value="desc">Data (Mais distantes)</option>
                    </select>
                </div>

                {/* LISTAGEM DE EVENTOS */}
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                        <p className="text-gray-500 text-lg">Nenhum evento encontrado com estes filtros.</p>
                        <button onClick={() => { setSearch(""); setStatusFilter("all"); }} className="mt-4 text-blue-600 hover:underline">
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <Link key={event.id} href={`/evento/${event.id}`} className="block group">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{event.name}</h2>
                                        {getStatusBadge(event.status)}
                                    </div>
                                    <div className="text-gray-600 text-sm space-y-2 mb-6 flex-1">
                                        <p>📅 {new Date(event.date).toLocaleDateString('pt-BR')}</p>
                                        <p>📍 {event.location}</p>
                                        <p>👥 {event.expected_count} esperados</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                                        <span className="text-blue-600 text-sm font-medium">Ver detalhes &rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}