import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it("converts a simple name to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes apostrophes", () => {
    expect(slugify("Stuart's Team")).toBe("stuarts-team");
  });

  it("collapses multiple spaces and special characters into single hyphens", () => {
    expect(slugify("Marketing   &&&   Team")).toBe("marketing-team");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("---hello---")).toBe("hello");
  });

  it("handles accented characters by removing the accents", () => {
    expect(slugify("Cafe Resume")).toBe("cafe-resume");
  });

  it("returns an empty string for input with only special characters", () => {
    expect(slugify("###")).toBe("");
  });

  it("lowercases everything", () => {
    expect(slugify("UPPERCASE")).toBe("uppercase");
  });
});

describe("uniqueSlug", () => {
  it("returns the base slug if it does not exist", async () => {
    const exists = async () => false;
    expect(await uniqueSlug("My Team", exists)).toBe("my-team");
  });

  it("appends a counter if the base slug exists", async () => {
    const existing = new Set(["my-team"]);
    const exists = async (candidate: string) => existing.has(candidate);
    expect(await uniqueSlug("My Team", exists)).toBe("my-team-2");
  });

  it("keeps incrementing until it finds a free slug", async () => {
    const existing = new Set(["my-team", "my-team-2", "my-team-3"]);
    const exists = async (candidate: string) => existing.has(candidate);
    expect(await uniqueSlug("My Team", exists)).toBe("my-team-4");
  });

  it("falls back to 'team' if the input produces an empty slug", async () => {
    const exists = async () => false;
    expect(await uniqueSlug("###", exists)).toBe("team");
  });
});