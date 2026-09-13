export function Footer() {
  return (
    <footer className="border-t border-line bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:flex sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-deep text-xs font-semibold text-gold">
              IM
            </span>
            <span className="font-display text-base font-semibold text-blue-deep">InstaMine</span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-ink/60">
            Built by alumni, for alumni — a place to stay in touch with the school community.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 sm:mt-0 sm:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-ink">Explore</p>
            <ul className="mt-2 space-y-1 text-sm text-ink/60">
              <li><a href="/gallery" className="hover:text-blue-mid">EnimGallery</a></li>
              <li><a href="/talents" className="hover:text-blue-mid">EnimTalents</a></li>
              <li><a href="/cv" className="hover:text-blue-mid">Cv</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">About</p>
            <ul className="mt-2 space-y-1 text-sm text-ink/60">
              <li><a href="/about" className="hover:text-blue-mid">The school</a></li>
              <li><a href="/contact" className="hover:text-blue-mid">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line py-4 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} InstaMine. Not an official school website.
      </div>
    </footer>
  );
}
