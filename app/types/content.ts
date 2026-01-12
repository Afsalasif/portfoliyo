export type ContentBlock =
    | { type: 'header'; level: 2 | 3 | 4; text: string }
    | { type: 'paragraph'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'code'; language: string; code: string; caption?: string }
    | { type: 'table'; headers: string[]; rows: string[][] };
