"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Users, MapPin, Clipboard } from "lucide-react";

import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";

interface Competition {
  _id: string;
  name: string;
  about: string;
  coverPhoto?: string;
  dateStart?: string;
  dateEnd?: string;
  registrationDeadline?: string;
  participantLimit?: number;
  mode?: string;
  venue?: string;
}

export default function Events() {
  const [events, setEvents] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/competitions");
        const data = await res.json();
        setEvents(data || []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  const filteredEvents = events.filter((ev) =>
    ev.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const now = new Date();

  const upcoming = filteredEvents.filter(
    (ev) => ev.dateStart && new Date(ev.dateStart) > now
  );
  const ongoing = filteredEvents.filter(
    (ev) =>
      ev.dateStart &&
      ev.dateEnd &&
      new Date(ev.dateStart) <= now &&
      new Date(ev.dateEnd) >= now
  );
  const past = filteredEvents.filter(
    (ev) => ev.dateEnd && new Date(ev.dateEnd) < now
  );

  const renderEventCard = (ev: Competition) => (
    <Link key={ev._id} href={`/dashboard/events/${ev._id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow transition cursor-pointer">
        {ev.coverPhoto && (
          <img
            src={ev.coverPhoto}
            alt={ev.name}
            className="w-full h-48 object-cover object-center"
          />
        )}
        <div className="p-5">
          <h3 className="text-xl font-semibold">{ev.name}</h3>
          <p
            className="mt-2 text-gray-600"
            dangerouslySetInnerHTML={{ __html: truncateText(ev.about, 120) }}
          ></p>

          <div className="mt-4 text-gray-700 text-sm space-y-2">
            {ev.dateStart && ev.dateEnd && (
              <p className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />{" "}
                {new Date(ev.dateStart).toLocaleDateString()} -{" "}
                {new Date(ev.dateEnd).toLocaleDateString()}
              </p>
            )}
            {ev.registrationDeadline && (
              <p className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Registration Deadline:{" "}
                {new Date(ev.registrationDeadline).toLocaleDateString()}
              </p>
            )}
            {ev.participantLimit && (
              <p className="flex items-center gap-1">
                <Users className="w-4 h-4" /> Participant Limit:{" "}
                {ev.participantLimit}
              </p>
            )}
            {ev.mode && (
              <p className="flex items-center gap-1">
                <Clipboard className="w-4 h-4" /> Mode: {ev.mode}
              </p>
            )}
            {ev.venue && (
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Venue: {ev.venue}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <>
      <Header />

      <div className="p-6 md:p-12 min-h-screen space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Events</h2>
          <Link
            href="/dashboard/events/create"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            + Create Event
          </Link>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search events by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading && <p className="text-gray-600 mt-4">Loading events...</p>}
        {!loading && filteredEvents.length === 0 && (
          <p className="text-gray-600 mt-4">No events found.</p>
        )}

        {upcoming.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-3">Upcoming Events</h3>
            <div className="grid md:grid-cols-1 gap-6">
              {upcoming.map(renderEventCard)}
            </div>
          </div>
        )}

        {ongoing.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-3">Ongoing Events</h3>
            <div className="grid md:grid-cols-1 gap-6">
              {ongoing.map(renderEventCard)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-3">Past Events</h3>
            <div className="grid md:grid-cols-1 gap-6">
              {past.map(renderEventCard)}
            </div>
          </div>
        )}
      </div>

      <Navigation />
      <Footer />
    </>
  );
}
