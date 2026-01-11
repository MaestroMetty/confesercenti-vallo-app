import { getPromotions } from '@/db/db';
import Promotion from "@/types/Promotion";
import Image from "next/image";

export default async function PromotionList() {
    const promotions: Promotion[] = await getPromotions();
    
    if (promotions.length === 0) {
        return <div>No promotions found</div>;
    }
    return (
        <div>
            <h2>Promotions</h2>
            <ul>
                {promotions.map((promotion: Promotion) => (
                    <li key={promotion.id} className="bg-white p-2 rounded-md text-black">
                        {promotion.name}
                        {promotion.imageUrl && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                {/* Blurred background */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center blur-md brightness-50 scale-110"
                                    style={{ backgroundImage: `url(${promotion.imageUrl})` }}
                                />
                                {/* Main image */}
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image 
                                        src={promotion.imageUrl} 
                                        alt={promotion.name} 
                                        width={100} 
                                        height={100}
                                        className="object-contain max-w-full max-h-full"
                                    />
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}