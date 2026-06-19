import { useState, type ReactNode } from 'react';

interface AvatarProps {
  /** Path under /public, e.g. "assets/linley-avatar.png". */
  imageSrc: string;
  alt: string;
  /** The SVG fallback rendered when no custom image is present. */
  children: ReactNode;
  className?: string;
}

/**
 * Renders the SVG portrait by default and transparently fades in a custom image
 * if one exists at the given path. To upgrade the art later, just drop a PNG at
 * `public/assets/linley-avatar.png` (or andrew-avatar.png) — no code change.
 *
 * The image starts at opacity 0, so a missing file never flashes a broken icon.
 */
export function Avatar({ imageSrc, alt, children, className = '' }: AvatarProps) {
  const [state, setState] = useState<'idle' | 'loaded' | 'error'>('idle');
  const src = `${import.meta.env.BASE_URL}${imageSrc}`;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`h-full w-full transition-opacity duration-500 ${
          state === 'loaded' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
