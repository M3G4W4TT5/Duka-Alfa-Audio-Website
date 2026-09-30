import { getImage } from "astro:assets";
import type { BrowserPhoto, Photo } from "../data/types";

export async function browserPhoto(photo: Photo): Promise<BrowserPhoto> {
  const widths = [480, 960, 1440, 1920].filter(
    (width) => width <= photo.image.width,
  );
  if (!widths.includes(photo.image.width) && photo.image.width < 1920)
    widths.push(photo.image.width);
  const images = await Promise.all(
    widths.map((width) =>
      getImage({ src: photo.image, width, format: "webp", quality: 82 }),
    ),
  );
  return {
    src: images.at(-1)!.src,
    srcSet: images
      .map((image, index) => `${image.src} ${widths[index]}w`)
      .join(", "),
    width: photo.image.width,
    height: photo.image.height,
    alt: photo.alt,
    position: photo.position,
  };
}
