"use client";

import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-[90%] m-auto my-5">
        <h1 className="font-bold text-2xl my-2">Privacy Policy</h1>

        <div className="text-lg text-justify space-y-4">
          <p>
            This Privacy Policy explains how Kavyalok (“we”, “our”, or “us”)
            collects, uses, stores, and protects your information when you
            access or use our platform.
          </p>

          <h2 className="font-semibold text-xl mt-4">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <b>Account Details:</b> Name, email address, username, and profile
              information.
            </li>
            <li>
              <b>User-Generated Content:</b> Posts, thoughts, poems, stories,
              comments, and uploaded media.
            </li>
            <li>
              <b>Usage Data:</b> Device information, browser type, IP address,
              pages visited, and interactions on the platform.
            </li>
            <li>
              <b>Payment Information:</b> When registering for competitions,
              payment is processed securely via our Payment Gateway Provider. We do not store card or
              bank details.
            </li>
          </ul>

          <h2 className="font-semibold text-xl mt-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To create and manage your account.</li>
            <li>To display your posts and profile to the community.</li>
            <li>To improve platform performance and user experience.</li>
            <li>To process competition registrations and payments.</li>
            <li>To send important updates, notifications, and alerts.</li>
          </ul>

          <h2 className="font-semibold text-xl mt-4">
            3. Sharing of Information
          </h2>
          <p>
            We do <b>not</b> sell or share your personal information with third
            parties for marketing. Information may be shared only with:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <b>Service providers</b> like PayU for payment processing.
            </li>
            <li>
              <b>Legal authorities</b> if required by law.
            </li>
          </ul>

          <h2 className="font-semibold text-xl mt-4">4. Data Security</h2>
          <p>
            We implement appropriate technical measures including encryption,
            secure storage, and caching mechanisms to protect your data.
            However, no digital platform can guarantee 100% security.
          </p>

          <h2 className="font-semibold text-xl mt-4">
            5. Cookies & Local Storage
          </h2>
          <p>
            We use local storage and cookies to enhance speed, remember your
            login state, and improve dashboard performance.
          </p>

          <h2 className="font-semibold text-xl mt-4">6. Your Rights</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Access or update your account information.</li>
            <li>Delete your posts or request account deletion.</li>
            <li>Opt out of non-essential notifications.</li>
          </ul>

          <h2 className="font-semibold text-xl mt-4">7. Children’s Privacy</h2>
          <p>
            Kavyalok is intended for users aged 13 and above. We do not
            knowingly collect data from children below this age.
          </p>

          <h2 className="font-semibold text-xl mt-4">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy as needed. Continued use of our
            platform after updates means you accept the revised policy.
          </p>

          <h2 className="font-semibold text-xl mt-4">9. Contact Us</h2>
          <p>
            For privacy-related questions, contact us at{" "}
            <b>support@kavyalok.in</b>.
          </p>
        </div>
      </main>
      <Navigation />
      <Footer />
    </>
  );
}
