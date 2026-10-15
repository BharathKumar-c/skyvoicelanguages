import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkillSignal } from "../skill-signal";

describe("SkillSignal", () => {
  it("renders the validated module and state asset with a useful default label", () => {
    render(<SkillSignal module="writing" state="active" />);

    const image = screen.getByRole("img", {
      name: "Writing skill signal, active state",
    });

    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("writing-active.png"),
    );
  });

  it("can be hidden when nearby text already communicates the module", () => {
    const { container } = render(
      <SkillSignal decorative module="listening" state="idle" />,
    );

    const image = container.querySelector("img");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the same fixed registration for every state", () => {
    const { rerender } = render(
      <SkillSignal module="speaking" size={96} state="idle" />,
    );
    const image = screen.getByRole("img", {
      name: "Speaking skill signal, idle state",
    });
    expect(image).toHaveAttribute("width", "96");
    expect(image).toHaveAttribute("height", "96");

    rerender(<SkillSignal module="speaking" size={96} state="success" />);
    const successImage = screen.getByRole("img", {
      name: "Speaking skill signal, success state",
    });
    expect(successImage).toHaveAttribute("width", "96");
    expect(successImage).toHaveAttribute("height", "96");
  });
});
