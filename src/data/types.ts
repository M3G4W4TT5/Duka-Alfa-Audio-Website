import type { ImageMetadata } from "astro";

export interface Photo {
  image: ImageMetadata;
  alt: string;
  position?: string;
}
export interface Slide extends Photo {
  id: string;
  durationMs?: number;
}
export interface BrowserPhoto {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  position?: string;
}
export interface Service {
  slug: string;
  title: string;
  summary: string;
  photo?: Photo;
  parent?: string;
}
export interface Story {
  slug: string;
  title: string;
  introduction: string;
  tags: string[];
  photo: Photo;
  gallery?: Photo[];
  contribution?: string;
}
export interface Partner {
  slug: string;
  name: string;
  logo: string;
  description?: string;
}
export interface EquipmentGroup {
  id: string;
  title: string;
  summary: string;
  items: { name: string; description: string; photo?: Photo }[];
}
