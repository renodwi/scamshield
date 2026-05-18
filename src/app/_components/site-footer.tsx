export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2024 Scam Shield. Semua hak dilindungi.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#" className="hover:text-blue-600">
            Kebijakan Privasi
          </a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600">
            Syarat & Ketentuan
          </a>
        </div>
      </div>
    </footer>
  );
}
