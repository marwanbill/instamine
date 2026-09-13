import { Hero } from "../components/home/Hero";
import { GalleryPreview } from "../components/home/GalleryPreview";
import { TalentsPreview } from "../components/home/TalentsPreview";

export function HomePage() {
  return (
    <>
      <Hero />
      <GalleryPreview />
      <TalentsPreview />
    </>
  );
}
