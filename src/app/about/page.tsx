"use client";

import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";
import Link from "next/link";
import GradientText from "@/components/GradientText";

export default function About() {
  return (
    <>
      <Header />

      <main className="min-h-screen w-[90%] m-auto py-10">
        <GradientText
          colors={[
            "#9a6f0bff",
            "#bd9864ff",
            "#dbb56aff",
            "#7f7464ff",
            "#e9e99dff",
          ]}
          animationSpeed={5}
          showBorder={false}
          className="custom-class text-[35px] md:text-[65px] mb-6"
        >
          Kavyalok
        </GradientText>

        <p className="text-lg md:text-xl text-neutral-700 leading-relaxed m-auto max-w-4xl">
          A creative space crafted for writers, poets, and storytellers — where
          every voice is heard, every idea is welcomed, and every story finds
          its home.
        </p>

        <section className="mt-10 m-auto space-y-8 max-w-4xl text-neutral-800 text-[16.5px] leading-[1.75]">
          <hr></hr>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Our Vision
            </h2>
            <p>
              Kavyalok was built with a simple belief — creativity deserves a
              place that respects it, celebrates it, and nurtures it. We wanted
              a corner of the internet where writers could express themselves
              freely without noise, pressure, or algorithms deciding their
              worth.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Why We Exist
            </h2>
            <p className="">
              From poems and stories to micro-tales and expressive thoughts,
              Kavyalok brings together passionate minds who love literature. Our
              aim is to create one of India’s warmest writing communities — a
              place that inspires beginners and uplifts seasoned creators alike.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              What We Offer
            </h2>
            <ul className="list-disc ml-6 space-y-3">
              <li>
                <strong>Writing Competitions</strong> — frequent themed contests
                with fair judging, certificates, recognition, and prizes.
              </li>
              <li>
                <strong>Creative Community</strong> — a space that welcomes
                expression, originality, and authentic storytelling.
              </li>
              <li>
                <strong>Smooth & Minimal Platform</strong> — built with a clean
                aesthetic and a clutter-free experience.
              </li>
              <li>
                <strong>Feedback & Support</strong> — responsive assistance to
                help you grow and feel valued.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Our Promise
            </h2>
            <p>
              Kavyalok will always stay true to its purpose — to honour
              creativity. No spam. No distractions. No unnecessary complexity.
              Just pure expression, community, and growth.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
              Join the Journey
            </h2>
            <p>
              If you love writing, storytelling, or sharing thoughts — welcome
              home. Explore competitions, connect with creators, and let your
              words create something meaningful.
            </p>

            <Link
              href="/dashboard"
              className="inline-block m-auto mt-4 px-6 py-1 mt-2 bg-[#bd9864] text-white rounded-lg shadow-md hover:opacity-90 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </section>
      </main>

      <Navigation />
      <Footer />
    </>
  );
}
