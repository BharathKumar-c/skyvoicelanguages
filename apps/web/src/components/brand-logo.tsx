type BrandLogoProps = {
  variant?: "default" | "white";
  className?: string;
};

export function BrandLogo({
  variant = "default",
  className = "",
}: BrandLogoProps) {
  const source =
    variant === "white"
      ? "/brand/skyvoice-horizontal-white.svg"
      : "/brand/skyvoice-horizontal.svg";

  return (
    <svg
      aria-label="Sky Voice Languages"
      className={`brand-logo ${className}`}
      role="img"
      viewBox="135 430 810 220"
    >
      <image height="1080" href={source} width="1080" x="0" y="0" />
    </svg>
  );
}
