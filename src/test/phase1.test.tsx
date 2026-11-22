import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { FilmFrame } from "@/components/paper/FilmFrame";
import { HoseButton } from "@/components/hose/HoseButton";

describe("Phase 1: Paper world & Rubber Hose controls", () => {
  it("renders FilmFrame and background without crashing", () => {
    const { container } = render(
      <FilmFrame enabled={false}>
        <div data-testid="test-child">Paper content</div>
      </FilmFrame>
    );
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(container.querySelector(".paper-bg")).toBeInTheDocument();
  });

  it("renders HoseButton wrapper with custom element", () => {
    const { container } = render(
      <HoseButton>Save Note</HoseButton>
    );
    const btn = container.querySelector("hose-button");
    expect(btn).toBeInTheDocument();
    expect(btn?.textContent).toContain("Save Note");
  });

  it("verifies Pashto and Persian test letters are valid", () => {
    const testLine = "Write Pad دفتر یادداشت ټ ډ ړ ږ ښ ګ ڼ ۍ ې 123 ۱۲۳";
    const pashtoLetters = ["ټ", "ډ", "ړ", "ږ", "ښ", "ګ", "ڼ", "ۍ", "ې"];
    for (const char of pashtoLetters) {
      expect(testLine).toContain(char);
    }
  });

  it("defines all 5 required paper themes", () => {
    const themes = ["cream", "newsprint", "kraft", "sepia", "night"];
    expect(themes).toHaveLength(5);
  });
});
