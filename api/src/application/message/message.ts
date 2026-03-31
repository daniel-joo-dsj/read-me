export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'agent';
    content: string;
    created_at: string;
}
