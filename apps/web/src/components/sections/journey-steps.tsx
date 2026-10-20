import { Reveal } from "@/components/reveal";
import { getMessages } from "@/i18n/server";

type Step = { title: string; body: string };

/** Numbered onboarding steps ("How you join"). Hidden when there are none. */
export async function JourneySteps({ id, title, steps }: { id: string; title: string; steps: Step[] }) {
  if (!steps.length) return null;
  const { shared } = await getMessages();
  return (
    <section aria-labelledby={`${id}-title`} className="section section-soft journey-section" id={id}>
      <div className="site-shell">
        <Reveal className="section-heading centered-heading">
          <span className="eyebrow">{shared.gettingStarted}</span>
          <h2 id={`${id}-title`}>{title}</h2>
        </Reveal>
        <ol className="journey-steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true" className="journey-number">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
