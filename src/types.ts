export interface StoryChapter {
    id: string;
    title: string;
    content: string;
}

export interface Story {
    id: string;
    title: string;
    excerpt?: string;
    content?: string;
    tags: string[];
    type?: 'episode' | 'story';
    chapters?: StoryChapter[];
}