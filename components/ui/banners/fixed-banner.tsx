import Image, { StaticImageData } from "next/image";

type FixedBannerProps = {
  title: string;
  src: string | StaticImageData;
  isHero?: boolean;
  subtitle?: string;
  bgPos?: string;
  content?: React.ReactNode;
};

export default function FixedBanner({
  title,
  src,
  isHero,
  subtitle,
  bgPos,
  content,
}: FixedBannerProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white/90 font-sans">
      <div
        className="absolute inset-0"
        style={{
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt={title}
          fill
          quality={75}
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
          loading={isHero ? "eager" : "lazy"}
          style={{
            objectPosition: bgPos || "center",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h2>
        {subtitle && <p className="text-2xl drop-shadow-lg">{subtitle}</p>}
        {content}
      </div>
    </div>
  );
}
