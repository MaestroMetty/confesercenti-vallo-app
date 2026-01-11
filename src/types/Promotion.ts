export default interface Promotion {
    id: number;
    storeId: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    startDate: Date | null;
    endDate: Date | null;
    priority: number | null;
}