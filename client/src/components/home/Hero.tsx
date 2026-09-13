import Image from "../../assets/297624948_3355022438061510_1213355752055811695_n.jpg";

export function Hero() {
  return (
    <section className="relative">
      <div aria-hidden className="h-1.5 w-full bg-blue-deep" />

      <div
        className="relative flex h-[70vh] min-h-[420px] items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url("${Image}")`,
        }}
      >
        <div className="px-6 text-center">
          <div className="mt-3 w-fit">
            <div className="h-1 bg-blue-500 mb-[10px]" />
            <h1 className="font-display text-4xl font-semibold text-paper sm:text-6xl font-marker">
              Welcome to InstaMine
            </h1>
            <div className="h-1 bg-yellow-400 mt-[10px]" />
          </div>
          <p className="mx-auto mt-4 max-w-md text-balance text-sm text-paper/80 sm:text-base">
            Reconnect with your class, share where you've landed, and see what
            everyone's been building since graduation.
          </p>
        </div>
      </div>

      <div aria-hidden className="h-1.5 w-full bg-gold" />
    </section>
  );
}
