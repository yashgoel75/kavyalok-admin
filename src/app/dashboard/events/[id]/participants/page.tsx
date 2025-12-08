"use client";
import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Participant {
  userId: string;
  chosenCategory: string;
  paidAmount: number;
  answers: Record<string, any>;
}

interface EventType {
  name: string;
  participants: Participant[];
  customQuestions: { label: string }[];
}

export default function ParticipantsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/competitions/${id}`)
      .then((res) => res.json())
      .then(setEvent)
      .catch(console.error);
  }, [id]);

  if (!event) return <div className="p-6">Loading...</div>;

  const { participants } = event;

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold">Participants for {event.name}</h1>

        {participants.length === 0 && (
          <p className="mt-4 text-gray-600">No participants yet.</p>
        )}

        <div className="mt-6 space-y-6">
          {participants.map((p, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold">
                Participant #{index + 1}
              </h2>

              <p className="mt-2">
                <span className="font-semibold">User ID:</span> {p.userId}
              </p>

              <p>
                <span className="font-semibold">Chosen Category:</span>{" "}
                {p.chosenCategory}
              </p>

              <p>
                <span className="font-semibold">Paid:</span> ₹{p.paidAmount}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold">Answers:</h3>
                <ul className="list-disc ml-6 mt-2">
                  {Object.entries(p.answers).map(
                    ([questionLabel, answer], i) => (
                      <li key={i}>
                        <strong>{questionLabel}: </strong>
                        {Array.isArray(answer)
                          ? answer.join(", ")
                          : answer.toString()}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navigation />
      <Footer />
    </>
  );
}
