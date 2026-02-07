import FixedBanner from "@/components/ui/banners/fixed-banner";
import { Separator } from "@heroui/react";

function SectionContent({ content }: { content: React.ReactNode }) {
  return (
    <div className="relative z-10 w-full bg-background/95 py-16 px-8">
      <div className="max-w-4xl mx-auto space-y-4 text-center text-lg text-foreground">
        {content}
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <main className="flex w-full flex-col items-center">
        {/* Intro Section */}
        <FixedBanner
          title="This is our story"
          subtitle="Where potato meets olenji..."
          bgImage="/images/intro_banner.jpg"
          content={
            <p className="animate-scroll-prompt py-2 text-2xl font-bold">
              Scroll to begin
            </p>
          }
          bgPos="center 55%"
        />
        <SectionContent
          content={
            <>
              <p>
                A <span className="text-[#E6D3A3]">potato</span> 🥔
              </p>
              <p>
                An <span className="text-orange-300">olenji</span> 🍊
              </p>
              <p>Somehow that was enough</p>
              <p>For the beginning of everything</p>
            </>
          }
        />

        {/* Chapter 1 */}
        <FixedBanner
          title="Before We Knew"
          subtitle="Where the stars quietly aligned"
          bgImage="/images/chapter_1_banner.jpg"
          bgPos="center 45%"
        />

        <SectionContent
          content={
            <>
              <p>
                The <span className="text-[#E6D3A3]">potato</span> joined the
                club out of curiosity
              </p>
              <p>
                The <span className="text-orange-300">olenji</span> led it out
                of responsibility
              </p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>Together we built, fixed and carried things</p>
              <p>Having each other's support along the way</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>We called it friendship, because this is all we knew</p>
              <p>Unaware of what the future had planned for us</p>
            </>
          }
        />

        {/* Chapter 2 */}
        <FixedBanner
          title="When the world paused"
          subtitle="In uncertainty, we found each other"
          bgImage="/images/chapter_2_banner.jpeg"
          bgPos="center 25%"
        />
        <SectionContent
          content={
            <>
              <p>Our first official day together</p>
              <p>Happened to be the very first day of Malaysia's lockdown</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>The world had stopped, but we didn't</p>
              <p>We found ways to meet anyway</p>
              <p>Sneaking around IKEA while everyone else stayed home</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>Most days we were apart</p>
              <p>Seeing each other only on screens</p>
              <p>But somehow it still felt like we were side by side</p>
            </>
          }
        />

        {/* Chapter 3 */}
        <FixedBanner
          title="Without Doubt"
          subtitle="A promise already written"
          bgImage="/images/chapter_3_banner.jpg"
        />

        <SectionContent
          content={
            <>
              <p>When the proposal day arrived</p>
              <p>There was no doubt at all</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>I knew she was the one I wanted to spend my life with</p>
              <p>And she already knew it too</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>It wasn't about grand gestures or surprises</p>
              <p>Just a simple yes</p>
              <p>A promise for everything that was still to come</p>
            </>
          }
        />

        {/* Chapter 4 */}
        <FixedBanner
          title="Mr. & Mrs."
          subtitle="Where vows became a lifetime"
          bgImage="/images/chapter_4_banner.jpg"
          bgPos="center 60%"
        />

        <SectionContent
          content={
            <>
              <p>The day we made it official</p>
              <p>Was quiet, simple, and just ours</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>We exchanged vows</p>
              <p>Signed the papers</p>
              <p>And became husband and wife</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>In that moment</p>
              <p>All the little steps, the waiting, and the laughter</p>
              <p>Led us here</p>
              <p>Together, officially.</p>
            </>
          }
        />
        {/* Chapter 5 */}
        <FixedBanner
          title="The Wedding"
          subtitle="A celebration of love and promise"
          bgImage="/images/chapter_5_banner.jpg"
          bgPos="center 80%"
        />
        <SectionContent
          content={
            <>
              <p>The day finally arrived</p>
              <p>
                Buzzing with laughter, color, and the warmth of family
                everywhere
              </p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>
                From the traditions and rituals to the little joyful moments
              </p>
              <p>Every second felt full of life and meaning</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>Surrounded by the people who mattered most</p>
              <p>we celebrated, laughed, and soaked it all in</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>The start of our life together</p>
            </>
          }
        />

        {/* Chapter 6 */}
        <FixedBanner
          title="And Our Story Continues"
          subtitle="Now with Jimmy, and more to come"
          bgImage="/images/main_banner_4.jpg"
          bgPos="center 80%"
        />
        <SectionContent
          content={
            <>
              <p>Our story didn't stop there</p>
              <p>
                Since then, we've been learning, laughing, and loving every day
              </p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>Jimmy has joined the chaos 🐾</p>
              <p>Making life even brighter, messier, and way more fun</p>
              <Separator className="w-[60%] mx-auto my-6" />
              <p>And this is just the beginning</p>
              <p>Of many more adventures to come</p>
            </>
          }
        />
      </main>
    </div>
  );
}
