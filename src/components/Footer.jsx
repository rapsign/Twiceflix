"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
        <p className="text-xs text-neutral-400">
          Developed With ❤️ by{" "}
          <a
            href="https://rinaldi-a-prayuda.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium hover:underline"
          >
            RapSign
          </a>
        </p>
      </div>
    </footer>
  );
}
