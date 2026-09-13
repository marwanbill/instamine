import Image_1 from "../../assets/297095925_3355023354728085_3963284498959187569_n.jpg";
export function GalleryHero() {
  return (
    <section
      className="relative flex h-64 items-center justify-center bg-cover bg-center sm:h-72"
      style={{
        backgroundImage:
          `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url("${Image_1}")`,
      }}
    >
      <div className="px-6 text-center">
        <h1 className="font-display text-3xl font-semibold text-paper sm:text-5xl">
          Welcome to Gallery
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-paper/80 sm:text-base">
          Photos shared by alumni — reunions, throwbacks, and everything in between.
        </p>
      </div>
    </section>
  );
}