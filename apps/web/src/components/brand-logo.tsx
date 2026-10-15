type BrandLogoProps = {
  variant?: "default" | "white";
  className?: string;
};

/**
 * Horizontal Sky Voice lockup. Uses tightly cropped, transparent web derivatives
 * of the original brand SVGs (see design/visual-assets/generate_assets.py), so
 * the white variant no longer paints its navy artboard behind the footer.
 */
export function BrandLogo({
  variant = "default",
  className = "",
}: BrandLogoProps) {
  const source =
    variant === "white"
      ? "/assets/generated/brand/skyvoice-horizontal-white-transparent.svg"
      : "/assets/generated/brand/skyvoice-horizontal-cropped.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG logo; next/image adds nothing here
    <img
      alt="Sky Voice Languages"
      className={`brand-logo ${className}`}
      height={220}
      src={source}
      width={810}
    />
  );
}
