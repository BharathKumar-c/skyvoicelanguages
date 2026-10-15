import Image from "next/image";

export type SkillSignalModule =
  | "listening"
  | "reading"
  | "writing"
  | "speaking";

export type SkillSignalState = "idle" | "active" | "success";

interface SkillSignalProps {
  module: SkillSignalModule;
  state?: SkillSignalState;
  size?: number;
  className?: string;
  decorative?: boolean;
  alt?: string;
}

const MODULE_LABELS: Record<SkillSignalModule, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

/**
 * A validated Piece 2 Skill Signal. The fixed 420 px registration means every
 * module/state can swap without shifting the surrounding interface.
 */
export function SkillSignal({
  module,
  state = "idle",
  size = 152,
  className,
  decorative = false,
  alt,
}: SkillSignalProps) {
  const label = alt ?? `${MODULE_LABELS[module]} skill signal, ${state} state`;

  return (
    <Image
      alt={decorative ? "" : label}
      aria-hidden={decorative || undefined}
      className={className}
      height={size}
      src={`/mascot/skill-signals/${module}-${state}.png`}
      width={size}
    />
  );
}
