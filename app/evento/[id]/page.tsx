"use client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Event} from "../../../types";
import {getEventById} from "../../../services/api";

export default function EventDetails() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await getEventById(id);
                setEvent(data);
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar o evento.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            loadEvent();
        }
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 animate-pulse text-lg">Carregando detalhes...</p>
            </main>
        );
    }

    if (error || !event) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <p className="text-red-600 bg-red-50 p-4 rounded-md border border-red-200">{error || "Evento não encontrado."}</p>
                <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
                    &larr; Voltar para o início
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link href={`/evento/${event.id}`}
                      className="text-blue-600 font-medium text-sm hover:text-blue-800 hover:underline">
                    Ver detalhes &rarr;
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
                            <p className="text-gray-600">Data: {new Date(event.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                            event.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
              {event.status === 'open' ? 'Aberto' : 'Encerrado'}
            </span>
                    </div>

                    <div className="p-4 bg-blue-50 text-blue-800 rounded-xl mb-8">
                        <p className="font-medium text-lg">Capacidade do Evento</p>
                        <p className="text-3xl font-bold">{event.expectedParticipants} <span
                            className="text-sm font-normal">pessoas esperadas</span></p>
                    </div>

                    {/* O Dashboard e Tabela de Check-ins entrarão aqui na próxima etapa */}
                    <div className="border-t border-gray-100 pt-8 mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Área de Check-in</h2>
                        <p className="text-gray-500">O formulário de entrada será implementado aqui.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}