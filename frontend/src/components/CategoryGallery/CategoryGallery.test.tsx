import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryGallery from "./CategoryGallery";
import { GALLERY_PHOTOS } from "@/data/gallery";

describe("CategoryGallery", () => {
  it("renders only the photos tagged with the given category", () => {
    render(
      <CategoryGallery category="special" categoryTitle="מצבות מיוחדות" />
    );
    const expectedCount = GALLERY_PHOTOS.filter(
      (photo) => photo.category === "special"
    ).length;
    expect(
      screen.getAllByRole("button", { name: /הגדלת תמונה/ })
    ).toHaveLength(expectedCount);
  });

  it("renders nothing for a category with no tagged photos", () => {
    const { container } = render(
      // @ts-expect-error — deliberately invalid category to exercise the empty case
      <CategoryGallery category="nonexistent" categoryTitle="ריק" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("opens a lightbox with the enlarged photo on click, and closes it", async () => {
    const user = userEvent.setup();
    render(
      <CategoryGallery category="granite" categoryTitle="מצבות אבן גרניט" />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const [firstThumb] = screen.getAllByRole("button", {
      name: /הגדלת תמונה/,
    });
    await user.click(firstThumb);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "סגירה" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
