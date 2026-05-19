export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    status: 'open' | 'closed' | 'cancelled';
    description: string;
    expected_count: number;
    checkin_count: number;
    error_count: number;
    entry_rate: number;
}

export interface Participant {
    id: string;
    event_id: string;
    name: string;
    type: 'vip' | 'normal';
    status: 'inside' | 'outside';
    checkin_count: number;
}