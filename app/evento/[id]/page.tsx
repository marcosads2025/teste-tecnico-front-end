"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Event, Participant } from "../../../types";

import {
    getEventById,
    getParticipantsByEvent,
    updateEventMetrics
} from "../../../services/api";

import ParticipantsTable from "../../components/ParticipantsTable";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

export default function EventDetails() {

    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);

    const [participants, setParticipants] =
        useState<Participant[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {

        async function loadData() {

            try {

                const [eventData, participantsData] =
                    await Promise.all([
                        getEventById(id),
                        getParticipantsByEvent(id)
                    ]);

                setEvent(eventData);
                setParticipants(participantsData);

            } catch (error) {

                console.error(error);

                setError(
                    "Não foi possível carregar os dados."
                );

            } finally {

                setLoading(false);
            }
        }

        if (id) {
            loadData();
        }

    }, [id]);

    // Atualiza métricas em tempo real
    const handleMetricsUpdate = async (
        newCheckins: number,
        newErrors: number
    ) => {

        if (!event) return;

        const taxa = (
            (newCheckins / event.expected_count) * 100
        ).toFixed(1);

        setEvent({
            ...event,
            checkin_count: newCheckins,
            error_count: newErrors,
            entry_rate: Number(taxa)
        });

        await updateEventMetrics(
            event.id,
            newCheckins,
            newErrors
        );
    };

    if (loading) {

        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="animate-pulse">
                    Carregando...
                </p>
            </main>
        );
    }

    if (error || !event) {

        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">
                    {error}
                </p>
            </main>
        );
    }

    // Dados do gráfico
    const chartData = [
        {
            name: "Sucesso",
            value: event.checkin_count,
            color: "#22c55e"
        },
        {
            name: "Erros",
            value: event.error_count,
            color: "#ef4444"
        }
    ];

    return (

        <main className="min-h-screen bg-gray-50 p-8">

            <div className="max-w-5xl mx-auto">

                <button
                    onClick={() => router.push("/")}
                    className="mb-6 text-gray-500 hover:text-gray-800"
                >
                    &larr; Voltar
                </button>

                <div className="mb-8 flex justify-between items-start">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            {event.name}
                        </h1>

                        <p className="text-gray-500">
                            {new Date(event.date)
                                .toLocaleDateString("pt-BR")}
                            {" • "}
                            {event.location}
                        </p>

                    </div>

                    <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                            event.status === "open"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {event.status.toUpperCase()}
                    </span>

                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Esperados
                        </p>

                        <p className="text-2xl font-bold">
                            {event.expected_count}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Check-ins
                        </p>

                        <p className="text-2xl font-bold text-blue-600">
                            {event.checkin_count}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Erros
                        </p>

                        <p className="text-2xl font-bold text-red-600">
                            {event.error_count}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-gray-500 text-sm">
                            Taxa de Entrada
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                            {event.entry_rate}%
                        </p>
                    </div>

                </div>

                {/* Tabela + gráfico */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">

                        <ParticipantsTable
                            event={event}
                            initialParticipants={participants}
                            onMetricsUpdate={handleMetricsUpdate}
                        />

                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center mt-8 h-[400px]">

                        <h3 className="font-semibold text-gray-700 mb-4">
                            Proporção de Sucesso/Erro
                        </h3>

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                >

                                    {chartData.map((entry, index) => (

                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />

                                    ))}

                                </Pie>

                                <Tooltip />
                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

        </main>
    );
}