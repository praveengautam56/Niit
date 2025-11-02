export interface Question {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation?: string;
}

export interface Quiz {
    id: number;
    image: string;
    title: string;
    description: string;
    attempts: number;
    questions?: Question[];
}

export interface Notification {
    id: string;
    message: string;
    timestamp: number;
}
