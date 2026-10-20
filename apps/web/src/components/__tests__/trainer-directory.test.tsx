import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Trainer } from "@/content/about";
import { renderWithI18n as render } from "@/i18n/test-utils";

import { TrainerDirectory } from "../trainer-directory";

// Fixture data for component behaviour only; never shipped as page content.
// jsdom trims text around the visually hidden span, so names match loosely;
// real browsers compute "View profile of <name>" (covered by the e2e run).
const trainers: Trainer[] = [
  {
    bio: "Fixture biography.",
    designation: "Lead IELTS Trainer",
    expertise: ["Writing Task 2", "Speaking Part 3"],
    experienceYears: 8,
    id: "fixture-one",
    name: "Fixture Trainer",
    photo: null,
    qualifications: ["MA English", "CELTA", "DELTA", "Extra"],
    video: null,
  },
  {
    bio: "Second fixture.",
    designation: "Speaking Coach",
    expertise: [],
    experienceYears: null,
    id: "fixture-two",
    name: "Second Fixture",
    photo: null,
    qualifications: [],
    video: null,
  },
];

describe("TrainerDirectory", () => {
  afterEach(cleanup);

  it("renders one card per trainer with key details", () => {
    render(<TrainerDirectory trainers={trainers} />);

    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("heading", { name: "Fixture Trainer" })).toBeInTheDocument();
    expect(screen.getByText("Lead IELTS Trainer")).toBeInTheDocument();
    expect(screen.getByText("8+ years of teaching")).toBeInTheDocument();
    // Cards show at most three qualifications; the profile shows them all.
    expect(screen.queryByText("Extra")).not.toBeInTheDocument();
  });

  it("opens the full profile in an accessible dialog and closes on Escape", () => {
    render(<TrainerDirectory trainers={trainers} />);

    fireEvent.click(screen.getByRole("button", { name: /View profile.*Fixture Trainer/ }));
    const dialog = screen.getByRole("dialog", { name: "Fixture Trainer" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Extra")).toBeInTheDocument();
    expect(screen.getByText("Meet Fixture Trainer: video coming soon.")).toBeInTheDocument();
    expect(document.activeElement).toHaveAccessibleName("Close Fixture Trainer's profile");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not offer playback when a trainer has no video yet", () => {
    render(<TrainerDirectory trainers={trainers} />);
    fireEvent.click(screen.getByRole("button", { name: /View profile.*Second Fixture/ }));

    expect(screen.queryByRole("button", { name: /Play video/ })).not.toBeInTheDocument();
    expect(screen.getAllByText("Video coming soon").length).toBeGreaterThan(0);
  });
});
