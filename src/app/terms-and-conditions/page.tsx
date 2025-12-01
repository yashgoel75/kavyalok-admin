"use client";

import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";

export default function TermsAndConditions() {
  return (
    <>
      <Header />

      <main className="min-h-screen w-[90%] m-auto my-5">
        <h1 className="font-bold text-2xl my-2">Terms & Conditions</h1>

        <div className="text-lg text-justify space-y-5">
          <section>
            <h2 className="font-semibold text-xl mb-2">1. Introduction</h2>
            <p>
              Welcome to <b>Kavyalok</b>. By accessing or using our platform,
              you agree to follow these Terms & Conditions. If you do not agree,
              you should not use the platform or participate in competitions.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">
              2. User Responsibilities
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                You must provide accurate information while creating an account.
              </li>
              <li>
                You are responsible for the content you post, including poems,
                stories, or any submissions.
              </li>
              <li>
                You agree not to post harmful, abusive, or plagiarized content.
              </li>
              <li>
                Any misuse of features or attempts to manipulate results may
                lead to account suspension.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">3. Competition Rules</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                By registering for a competition, you agree to follow all
                competition-specific rules.
              </li>
              <li>Entries must be original and created by the participant.</li>
              <li>
                Violation of rules may result in disqualification without
                refund.
              </li>
              <li>
                Kavyalok retains the right to remove entries that violate
                guidelines.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">4. Payments</h2>
            <p>
              All payments for competition registrations are processed securely
              through our Payment Gateway Provider. Once paid, registration fees are{" "}
              <b>non-refundable</b>, except in cases where the event is
              cancelled by us. For detailed rules, refer to our
              <span className="font-semibold">
                {" "}
                Refund & Cancellation Policy
              </span>
              .
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">5. Content Ownership</h2>
            <p>
              You retain full ownership of the content you publish on Kavyalok.
              However, by posting, you grant us limited permission to display
              your content within the platform for user engagement and
              competitions.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">6. Platform Rights</h2>
            <p>
              Kavyalok may modify features, update rules, or suspend accounts
              that violate community guidelines. We may also remove content that
              is inappropriate or harmful to the community experience.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">
              7. Limitation of Liability
            </h2>
            <p>
              Kavyalok shall not be held responsible for technical issues,
              internet failures, or user errors during submissions or payments.
              Users are expected to maintain stable connectivity while
              participating.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">8. Changes to Terms</h2>
            <p>
              We may update these Terms & Conditions at any time. Continued use
              of the platform means you accept the updated version.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">9. Contact</h2>
            <p>
              For questions regarding these Terms & Conditions, reach out to us
              at
              <span className="font-semibold"> support@kavyalok.in</span>.
            </p>
          </section>
        </div>
      </main>

      <Navigation />
      <Footer />
    </>
  );
}
