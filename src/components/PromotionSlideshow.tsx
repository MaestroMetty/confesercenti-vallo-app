'use client';

import React, { useState, useMemo } from 'react';
import ImageSlideshow from './ImageSlideshow';
import PromotionModal from './Promotions/PromotionModal';
import type Promotion from '@/types/Promotion';

interface PromotionSlideshowClientProps {
  promotions: Promotion[];
  onImagesLoaded?: () => void;
}

export default function PromotionSlideshow({ promotions, onImagesLoaded }: PromotionSlideshowClientProps) {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  // Filter out expired promotions and transform to slideshow format - memoize to prevent infinite re-renders
  const slideshowImages = useMemo(() => {
    const now = new Date();
    // Filter out expired promotions
    const activePromotions = promotions.filter(promo => {
      if (!promo.endDate) return true; // No end date means always active
      const endDate = new Date(promo.endDate);
      // Check if endDate is in the future (not expired)
      return endDate > now;
    });
    
    // Transform to slideshow format
    return activePromotions.map((promotion: Promotion) => ({
      id: promotion.id.toString(),
      src: promotion.imageUrl || '/next.svg',
      alt: promotion.name,
      title: promotion.name,
      subtitle: promotion.description || 'Special Offer'
    }));
  }, [promotions]);

  const handleImageClick = (id: string) => {
    const promotionId = parseInt(id);
    const promotion = promotions.find(p => p.id === promotionId);
    if (promotion) {
      setSelectedPromotion(promotion);
    }
  };

  // If no promotions, show default slideshow
  if (slideshowImages.length === 0) {
    const defaultImages = [
      {
        id: '1',
        src: '/imgs/energy-team-promotion.png',
        alt: 'No promotions available',
        title: 'Qui trovi le promozioni attive',
        subtitle: 'Controlla più tardi'
      }
    ];
    return <ImageSlideshow 
      images={defaultImages} 
      autoScrollInterval={5000} 
    />;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <ImageSlideshow 
        images={slideshowImages} 
        autoScrollInterval={5000} 
        onImageClick={handleImageClick}
      />
      {selectedPromotion && (
        <PromotionModal
          promotion={selectedPromotion}
          onClose={() => setSelectedPromotion(null)}
          showStoreButton={true}
        />
      )}
    </div>
  );
}
