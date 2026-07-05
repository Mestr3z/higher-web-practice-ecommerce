import { useState } from 'react';

import StarIcon from '../../assets/Star.svg?react';

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function RatingInput({ value, onChange, disabled = false }: RatingInputProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`Оценка ${star}`}
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange(star)}
          className="disabled:cursor-not-allowed"
        >
          <StarIcon
            className={
              (hover || value) >= star
                ? 'fill-accent text-accent h-8 w-8'
                : 'text-accent h-8 w-8 fill-none'
            }
          />
        </button>
      ))}
    </div>
  );
}
