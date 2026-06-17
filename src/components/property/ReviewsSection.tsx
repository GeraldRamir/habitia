"use client";

import type { Review } from "@/lib/types";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { addReview } from "@/lib/storage";
import { useApp } from "@/context/AppContext";

interface ReviewsSectionProps {
  propertyId: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

export function ReviewsSection({ propertyId, reviews, onReviewAdded }: ReviewsSectionProps) {
  const { user, addToast } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Debes iniciar sesión para dejar una reseña", "warning");
      return;
    }
    if (!comment.trim()) {
      addToast("Escribe un comentario", "warning");
      return;
    }
    addReview({
      propertyId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment: comment.trim(),
    });
    setComment("");
    setRating(5);
    addToast("Reseña publicada");
    onReviewAdded();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-semibold text-title">Reseñas</h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1">
            <Star size={18} className="text-warning fill-warning" />
            <span className="font-semibold">{avg.toFixed(1)}</span>
            <span className="text-muted text-sm">({reviews.length})</span>
          </div>
        )}
      </div>

      {user && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-title block mb-2">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      className={n <= rating ? "text-warning fill-warning" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Comentario"
              placeholder="Comparte tu experiencia..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit">Publicar reseña</Button>
          </form>
        </Card>
      )}

      {reviews.length === 0 ? (
        <p className="text-muted text-center py-8">Aún no hay reseñas. ¡Sé el primero!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="!p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-title">{review.userName}</span>
                <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? "text-warning fill-warning" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-sm text-muted">{review.comment}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
