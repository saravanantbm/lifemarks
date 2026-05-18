import { useState } from 'react';

interface Props {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readonly = false, size = 28 }: Props) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{ fontSize: size }}
          className={`leading-none transition-transform duration-100 ${
            readonly ? 'cursor-default' : 'cursor-pointer active:scale-90'
          } select-none`}
        >
          {s <= active ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
