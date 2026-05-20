import {useState} from 'react';
import {Event, Participant} from '../../types';
import {registerCheckinHistory, updateParticipantStatus} from '../../services/api';

interface Props {
    event: Event;
    initialParticipants: Participant[];
    onMetricsUpdate: (newCheckins: number, newErrors: number) => void;
}

export default function ParticipantsTable({ event, initialParticipants, onMetricsUpdate }: Props) {
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleCheckIn = async (participant: Participant) => {
        if (event.status === 'closed') {
            setFeedback({message: 'Ação desabilitada, evento encerrado.', type: 'error'});
            return;
        }

        if (participant.type === 'normal' && participant.checkin_count >= 1) {
            setFeedback({message: 'Mensagem: participante já realizou check-in', type: 'error'});

            await registerCheckinHistory({
                event_id: event.id,
                participant_id: participant.id,
                timestamp: new Date().toISOString(),
                success: false,
                action: 'entry',
                error_reason: 'already_checked_in'
            });

            onMetricsUpdate(event.checkin_count, event.error_count + 1);
            return;
        }

        const isEntering = participant.status === 'outside';
        const newStatus = isEntering ? 'inside' : 'outside';
        const actionType = isEntering ? 'entry' : 'exit';

        try {
            await updateParticipantStatus(participant.id, newStatus, participant.checkin_count + 1);

            await registerCheckinHistory({
                event_id: event.id,
                participant_id: participant.id,
                timestamp: new Date().toISOString(),
                success: true,
                action: actionType,
                error_reason: null
            });

            setParticipants(prev =>
                prev.map(p => p.id === participant.id
                    ? {...p, status: newStatus, checkin_count: p.checkin_count + 1}
                    : p
                )
            );

            if (isEntering) {
                onMetricsUpdate(event.checkin_count + 1, event.error_count);
                if (participant.type === 'vip') {
                    setFeedback({message: 'Entrada registrada, status atualizado para inside', type: 'success'});
                } else {
                    setFeedback({message: 'Check-in registrado, sem possibilidade de repetir', type: 'success'});
                }
            } else {
                setFeedback({message: 'Status atualizado para outside, pode entrar novamente', type: 'success'});
            }

        } catch (error) {
            setFeedback({message: 'Erro de conexão ao processar ação.', type: 'error'});
            console.error(error);
        }
    };

    return (
        <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Lista de Participantes</h3>
            </div>

            {feedback && (
                <div className={`p-4 text-sm font-medium ${feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {feedback.message}
                </div>
            )}

            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b">
                    <th className="p-4">Nome</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ação</th>
                </tr>
                </thead>
                <tbody>
                {participants.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">{p.name}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${p.type === 'vip' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                {p.type.toUpperCase()}
                            </span>
                        </td>
                        <td className="p-4">
                            <span className={`flex items-center gap-2 ${p.status === 'inside' ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${p.status === 'inside' ? 'bg-green-500' : 'bg-gray-300'}`}/>
                                {p.status === 'inside' ? 'Dentro' : 'Fora'}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <button
                                onClick={() => handleCheckIn(p)}
                                disabled={event.status === 'closed'}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {p.status === 'inside' && p.type === 'vip' ? 'Registrar Saída' : 'Fazer Check-in'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}