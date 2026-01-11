export default interface Store {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    category: string | null;
    imageUrl: string | null;
    description: string | null;
}