export interface Event {
    id: string;
    name: string;
    status: "open" | "closed";
    date: string;
    expectedParticipants: number;
}

export interface Participant {
    id: string;
    eventId: string;
    name: string;
    type: "normal" | "vip";
    status: "outside" | "inside";
}