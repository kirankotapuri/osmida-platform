import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#095054] text-white select-none px-6">
      {/* Brand Splash Container */}
      <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Centered Wordmark */}
        <div className="relative h-14 sm:h-16 w-56 sm:w-64">
          <Image
            src="/assets/branding/osmida-wordmark-white.png"
            alt="Osmida"
            width={256}
            height={66}
            className="h-full w-auto object-contain mx-auto drop-shadow-md"
            priority
          />
        </div>

        {/* Tagline / Subtitle */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wider text-teal-100">
          <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>NELLORE&apos;S RESIDENTIAL HOME SERVICES</span>
        </div>

        {/* Minimalist Animated Loading Dots */}
        <div className="flex items-center space-x-2 pt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FB7D28] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" />
        </div>
      </div>
    </div>
  );
}
