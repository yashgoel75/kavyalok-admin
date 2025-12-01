"use client";

import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";

export default function RefundPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-[90%] m-auto my-5">
        <h1 className="font-bold text-2xl my-2">
          Refund & Cancellation Policy
        </h1>

        <div className="text-lg text-justify space-y-5">
          <section>
            <h2 className="font-semibold text-xl mb-2">
              Competition Registrations
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Registration fees for competitions are non-refundable once paid.
              </li>
              <li>
                Users must ensure they meet eligibility and understand the
                submission rules before registering.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">Cancellation by User</h2>
            <p>
              Users may choose not to submit an entry after registering, but the
              registration fee will not be refunded.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">
              Event Cancellation by Us
            </h2>
            <p>
              If Kavyalok cancels a competition due to technical issues or
              unavoidable circumstances:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                All registered users will receive a 100% refund of their
                registration fee.
              </li>
              <li>
                Refunds will be processed to the same payment method used.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">Payment Processing</h2>
            <p>
              Payments are handled securely through our Payment Gateway Provider. Refunds, if
              applicable, may take
              <span className="font-semibold"> 3–7 business days </span>
              to reflect, depending on the bank.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl mb-2">Contact</h2>
            <p>
              For refund-related questions, email us at
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
