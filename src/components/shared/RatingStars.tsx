import StarIcon from '../../assets/Star.svg?react';

type RatingStarsProps = {
  rating: number;
  count?: number;
  variant?: 'stars' | 'compact';
};

export function RatingStars({ rating, count, variant = 'stars' }: RatingStarsProps) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5">
          <StarIcon className="fill-accent text-accent h-6 w-6" />
          <span className="text-h3 text-text font-bold">{rating.toFixed(1)}</span>
        </div>
        {count !== undefined && (
          <span className="text-text-secondary text-xs">{count} оценок</span>
        )}
      </div>
    );
  }

  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={
              star <= rounded
                ? 'fill-accent text-accent h-5 w-5'
                : 'text-border h-5 w-5 fill-none'
            }
          />
        ))}
      </div>
      <span className="text-text-secondary text-sm">
        {rating.toFixed(1)}
        {count !== undefined ? ` · ${count} оценок` : ''}
      </span>
    </div>
  );
}
