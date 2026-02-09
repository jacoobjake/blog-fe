import ParallaxBanner from "@/components/ui/banners/parallax-banner";
import SectionContent from "@/components/ui/contents/section-content";
import ScrollTopButton from "@/components/ui/general/scroll-top-button";
import IntroBanner from "@/public/images/intro_banner.avif";
import Chapter1Banner from "@/public/images/chapter_1_banner.avif";
import Chapter2Banner from "@/public/images/chapter_2_banner.avif";
import Chapter3Banner from "@/public/images/chapter_3_banner.avif";
import Chapter4Banner from "@/public/images/chapter_4_banner.avif";
import Chapter5Banner from "@/public/images/chapter_5_banner.avif";
import Chapter6Banner from "@/public/images/chapter_6_banner.avif";
import Separator from "@/components/ui/general/separator";
import Link from "@/components/ui/general/link";

const ColoredText = {
  potato: <span className="text-[#E6D3A3]">potato</span>,
  olenji: <span className="text-orange-300">olenji</span>,
};

// Wrapper for multiple inline elements (replaces fragments)
const Line = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center">
        <ScrollTopButton />
        {/* Intro Section */}
        <ParallaxBanner
          isHero
          title="This is our story"
          subtitle="Where potato meets olenji..."
          src={IntroBanner}
          content={
            <p className="animate-scroll-prompt py-2 text-2xl font-bold">
              Scroll to begin
            </p>
          }
          bgPos="center 55%"
        />
        <SectionContent
          lines={[
            <Line key="intro-1">A {ColoredText.potato} 🥔</Line>,
            <Line key="intro-2">An {ColoredText.olenji} 🍊</Line>,
            "Somehow that was enough",
            "For the beginning of everything",
          ]}
        />

        {/* Chapter 1 */}
        <ParallaxBanner
          title="Before We Knew"
          subtitle="Where the stars quietly aligned"
          src={Chapter1Banner}
          bgPos="73% 60%"
        />

        <SectionContent
          lines={[
            <Line key="ch1-1">
              The {ColoredText.potato} joined the club out of curiosity
            </Line>,
            <Line key="ch1-2">
              The {ColoredText.olenji} led it out of responsibility
            </Line>,
            <Separator className="w-[60%] mx-auto my-6" />,
            "Together we built, fixed and carried things",
            "Having each other's support along the way",
            <Separator className="w-[60%] mx-auto my-6" />,
            "We called it friendship, because this is all we knew",
            "Unaware of what the future had planned for us",
          ]}
        />

        {/* Chapter 2 */}
        <ParallaxBanner
          title="When the world paused"
          subtitle="In uncertainty, we found each other"
          src={Chapter2Banner}
          bgPos="30% 25%"
        />
        <SectionContent
          lines={[
            "Our first official day together",
            "Happened to be the very first day of Malaysia's lockdown",
            <Separator className="w-[60%] mx-auto my-6" />,
            "The world had stopped, but we didn't",
            "We found ways to meet anyway",
            "Sneaking around IKEA while everyone else stayed home",
            <Separator className="w-[60%] mx-auto my-6" />,
            "Most days we were apart",
            "Seeing each other only on screens",
            "But somehow it still felt like we were side by side",
          ]}
        />

        {/* Chapter 3 */}
        <ParallaxBanner
          title="Without Doubt"
          subtitle="A promise already written"
          src={Chapter3Banner}
        />

        <SectionContent
          lines={[
            "When the proposal day arrived",
            "There was no doubt at all",
            <Separator className="w-[60%] mx-auto my-6" />,
            "I knew she was the one I wanted to spend my life with",
            "And she already knew it too",
            <Separator className="w-[60%] mx-auto my-6" />,
            "It wasn't about grand gestures or surprises",
            "Just a simple yes",
            "A promise for everything that was still to come",
          ]}
        />

        {/* Chapter 4 */}
        <ParallaxBanner
          title="Mr. & Mrs."
          subtitle="Where vows became a lifetime"
          src={Chapter4Banner}
          bgPos="center 60%"
        />

        <SectionContent
          lines={[
            "The day we made it official",
            "Was quiet, simple, and just ours",
            <Separator className="w-[60%] mx-auto my-6" />,
            "We exchanged vows",
            "Signed the papers",
            "And became husband and wife",
            <Separator className="w-[60%] mx-auto my-6" />,
            "In that moment",
            "All the little steps, the waiting, and the laughter",
            "Led us here",
            "Together, officially.",
          ]}
        />
        {/* Chapter 5 */}
        <ParallaxBanner
          title="The Wedding"
          subtitle="A celebration of love and promise"
          src={Chapter5Banner}
          bgPos="46% 80%"
        />
        <SectionContent
          lines={[
            "The day finally arrived",
            "Buzzing with laughter, color, and the warmth of family everywhere",
            <Separator className="w-[60%] mx-auto my-6" />,
            "From the traditions and rituals to the little joyful moments",
            "Every second felt full of life and meaning",
            <Separator className="w-[60%] mx-auto my-6" />,
            "Surrounded by the people who mattered most",
            "we celebrated, laughed, and soaked it all in",
            <Separator className="w-[60%] mx-auto my-6" />,
            "The start of our life together",
          ]}
        />

        {/* Chapter 6 */}
        <ParallaxBanner
          title="And Our Story Continues"
          subtitle="Now with Jimmy, and more to come"
          src={Chapter6Banner}
          bgPos="center 35%"
        />
        <SectionContent
          lines={[
            "Our story didn't stop there",
            "Since then, we've been learning, laughing, and loving every day",
            <Separator className="w-[60%] mx-auto my-6" />,
            "Jimmy has joined the chaos 🐾",
            "Making life even brighter, messier, and way more fun",
            <Separator className="w-[60%] mx-auto my-6" />,
            "And this is just the beginning",
            "Of many more adventures to come",
            <Link key="read-more" href="/blogs" className="text-xl">
              See more of our stories
            </Link>,
          ]}
        />
      </main>
    </div>
  );
}
