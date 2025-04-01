export interface PostModel {
    id: number;
    categoryId: number;
    tagIds: number[];
    title: string;
    content: string;
    createdAt: number; // unix timestamp
}