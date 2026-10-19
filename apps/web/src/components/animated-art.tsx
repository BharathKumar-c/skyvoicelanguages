type AnimatedArtProps = {
  /** Animated SVG (self-contained CSS keyframes). */
  src: string;
  /** Static twin served when the visitor prefers reduced motion. */
  staticSrc: string;
  width: number;
  height: number;
  className?: string;
  loading?: "eager" | "lazy";
};

/**
 * Decorative animated SVG with a reduced-motion fallback.
 *
 * A prefers-reduced-motion rule inside an SVG loaded as <img> is not reliable,
 * so the static twin is selected by <picture> instead.
 */
export function AnimatedArt({
  src,
  staticSrc,
  width,
  height,
  className,
  loading = "eager",
}: AnimatedArtProps) {
  return (
    <picture className={className}>
      <source media="(prefers-reduced-motion: reduce)" srcSet={staticSrc} />
      <img
        alt=""
        aria-hidden="true"
        decoding="async"
        height={height}
        loading={loading}
        src={src}
        width={width}
      />
    </picture>
  );
}
