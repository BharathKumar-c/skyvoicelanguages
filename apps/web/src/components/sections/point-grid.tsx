import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

type Point = { title: string; body: string };

/** Icon cards for short title + text points (reasons, subjects, learning style). */
export function PointGrid({ points, icons = [] }: { points: Point[]; icons?: LucideIcon[] }) {
  return (
    <ul className="audience-grid point-grid">
      {points.map((point, index) => {
        const Icon = icons[index % (icons.length || 1)] ?? CheckCircle2;
        return (
          <li className="audience-card" key={point.title}>
            <Icon aria-hidden="true" />
            <div>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
