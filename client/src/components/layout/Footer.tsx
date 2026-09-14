export function Footer() {
  return (
    <footer className="border-t border-line bg-white/60">
      <div className="border-t border-line py-4 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} Made with love
      </div>
    </footer>
  );
}
