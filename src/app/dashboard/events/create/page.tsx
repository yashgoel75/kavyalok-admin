"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFirebaseToken } from "@/utils";

import axios from "axios";

import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";
import dynamic from "next/dynamic";

import {
  ParticipationOption,
  Question,
  QuestionType,
  CreateCompetitionPayload,
} from "@/types/competition";

const QuillEditor = dynamic(() => import("@/components/TestEditor"), {
  ssr: false,
});

interface Admin {
  name: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

export default function CreateCompetitionPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [eventData, setEventData] = useState<CreateCompetitionPayload>({
    owner: "",

    name: "",
    about: "",
    coverPhoto: "",

    participationOptions: [],
    customQuestions: [],

    participantLimit: 0,
    mode: "",
    venue: "",

    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",

    registrationDeadline: "",

    judgingCriteria: [],
    prizePool: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        fetchAdminDetails(user);
      }
    });
    return () => unsubscribe();
  }, []);

  async function fetchAdminDetails(u: User) {
    const res = axios.get(`/api/admin?email=${u.email}`);
    const data = (await res).data;
    setAdmin(data.data);
    setEventData((prev) => ({ ...prev, owner: data.data._id }));
  }

  const handleCoverPhotoChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !firebaseUser) return;

    setIsUploadingImage(true);
    try {
      const token = await getFirebaseToken();

      const sigRes = await fetch("/api/signCompetitionCovers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folder: "competitionCovers" }),
      });

      const sigData = await sigRes.json();
      const { timestamp, signature, apiKey, folder } = sigData;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", timestamp);
      form.append("signature", signature);
      form.append("folder", folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: form }
      );

      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Cloudinary upload failed");

      setEventData((prev) => ({ ...prev, coverPhoto: cloudData.secure_url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addCategory = () => {
    setEventData((prev) => ({
      ...prev,
      participationOptions: [
        ...prev.participationOptions,
        { label: "", price: 0 },
      ],
    }));
  };

  const updateCategory = (
    index: number,
    key: keyof ParticipationOption,
    value: string | number
  ) => {
    setEventData((prev) => {
      const updated = [...prev.participationOptions];
      updated[index][key] = value as never;
      return { ...prev, participationOptions: updated };
    });
  };

  const addQuestion = () => {
    setEventData((prev) => ({
      ...prev,
      customQuestions: [
        ...prev.customQuestions,
        { label: "", type: "text", options: [] },
      ],
    }));
  };

  const updateQuestion = (
    index: number,
    key: keyof Question,
    value: string | QuestionType
  ) => {
    setEventData((prev) => {
      const updated = [...prev.customQuestions];

      if (key === "type" && (value === "text" || value === "number")) {
        updated[index].options = [];
      }

      updated[index][key] = value as never;
      return { ...prev, customQuestions: updated };
    });
  };

  const addOption = (qIndex: number) => {
    setEventData((prev) => {
      const updated = [...prev.customQuestions];
      updated[qIndex].options.push("");
      return { ...prev, customQuestions: updated };
    });
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setEventData((prev) => {
      const updated = [...prev.customQuestions];
      updated[qIndex].options[optIndex] = value;
      return { ...prev, customQuestions: updated };
    });
  };

  const createCompetition = async () => {
    if (!eventData.name) {
      alert("Please enter a competition name");
      return;
    }

    const payload = {
      ...eventData,
      participantLimit: Number(eventData.participantLimit || 0),
    };

    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/dashboard/events");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto mb-20">
        <h1 className="text-3xl font-bold mb-6">Create Competition</h1>

        <div className="mb-6">
          <label className="font-semibold block mb-2">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          {isUploadingImage && (
            <p className="text-sm mt-1 text-blue-600">Uploading...</p>
          )}
          {eventData.coverPhoto && (
            <img
              src={eventData.coverPhoto}
              alt="Cover"
              className="w-full h-52 object-cover rounded border mt-4"
            />
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="font-semibold block mb-1">Name</label>
            <input
              className="border p-2 w-full rounded focus:ring-2 ring-indigo-500 outline-none"
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">About</label>
            <QuillEditor
              value={eventData.about}
              onChange={(html) => setEventData({ ...eventData, about: html })}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold block mb-1">
              Participant Limit
            </label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              value={eventData.participantLimit}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  participantLimit: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Mode</label>
            <input
              className="border p-2 w-full rounded"
              value={eventData.mode}
              onChange={(e) =>
                setEventData({ ...eventData, mode: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Venue</label>
            <input
              className="border p-2 w-full rounded"
              value={eventData.venue}
              onChange={(e) =>
                setEventData({ ...eventData, venue: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-6 mb-2 grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold block mb-1">Start Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={eventData.dateStart}
              onChange={(e) =>
                setEventData({ ...eventData, dateStart: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">End Date</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={eventData.dateEnd}
              onChange={(e) =>
                setEventData({ ...eventData, dateEnd: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Start Time</label>
            <input
              type="time"
              className="border p-2 w-full rounded"
              value={eventData.timeStart}
              onChange={(e) =>
                setEventData({ ...eventData, timeStart: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">End Time</label>
            <input
              type="time"
              className="border p-2 w-full rounded"
              value={eventData.timeEnd}
              onChange={(e) =>
                setEventData({ ...eventData, timeEnd: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-6 mb-2 gap-4">
          <label className="font-semibold block my-1">
            Registration Deadline
          </label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={eventData.registrationDeadline}
            onChange={(e) =>
              setEventData({
                ...eventData,
                registrationDeadline: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-10 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Participation Options</h2>
            <button
              onClick={addCategory}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              + Add Option
            </button>
          </div>

          {eventData.participationOptions.length === 0 && (
            <p className="text-gray-500 italic">
              No participation options added.
            </p>
          )}

          {eventData.participationOptions.map((opt, index) => (
            <div key={index} className="mt-4 p-4 border rounded bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Label
                  </label>
                  <input
                    className="border p-2 w-full rounded mt-1"
                    placeholder="e.g. Solo, Group, Open Mic"
                    value={opt.label}
                    onChange={(e) =>
                      updateCategory(index, "label", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Price
                  </label>
                  <input
                    type="number"
                    className="border p-2 w-full rounded mt-1"
                    placeholder="0"
                    value={opt.price}
                    onChange={(e) =>
                      updateCategory(index, "price", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Custom Questions</h2>
            <button
              onClick={addQuestion}
              className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
            >
              + Add Question
            </button>
          </div>

          {eventData.customQuestions.length === 0 && (
            <p className="text-gray-500 italic">No custom questions added.</p>
          )}

          {eventData.customQuestions.map((q, index) => (
            <div key={index} className="mt-4 p-4 border rounded bg-gray-50">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Question Label"
                    value={q.label}
                    onChange={(e) =>
                      updateQuestion(index, "label", e.target.value)
                    }
                  />
                </div>
                <div className="w-1/3">
                  <select
                    className="border p-2 w-full rounded"
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(
                        index,
                        "type",
                        e.target.value as QuestionType
                      )
                    }
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select Dropdown</option>
                    <option value="radio">Radio Button</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>
              </div>

              {["select", "radio", "checkbox"].includes(q.type) && (
                <div className="mt-3 pl-4 border-l-2 border-gray-300">
                  <p className="text-sm font-semibold mb-2">Options</p>
                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      className="border p-2 w-full rounded mt-1 mb-1 text-sm"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) =>
                        updateOption(index, optIndex, e.target.value)
                      }
                    />
                  ))}
                  <button
                    onClick={() => addOption(index)}
                    className="text-sm text-blue-600 hover:underline mt-1"
                  >
                    + Add another option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t">
          <h2 className="text-xl font-bold mb-4">Judging Criteria</h2>

          {eventData.judgingCriteria?.length === 0 && (
            <p className="text-gray-500 italic mb-2">
              No judging criteria added.
            </p>
          )}

          {eventData.judgingCriteria?.map((crit, index) => (
            <input
              key={index}
              className="border p-2 w-full rounded mb-2"
              placeholder={`Criteria ${index + 1}`}
              value={crit}
              onChange={(e) => {
                const updated = [...(eventData.judgingCriteria || [])];
                updated[index] = e.target.value;
                setEventData({ ...eventData, judgingCriteria: updated });
              }}
            />
          ))}

          <button
            onClick={() =>
              setEventData({
                ...eventData,
                judgingCriteria: [...(eventData.judgingCriteria || []), ""],
              })
            }
            className="px-4 py-2 mt-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
          >
            + Add Criteria
          </button>
        </div>

        <div className="mt-10 pt-6 border-t">
          <h2 className="text-xl font-bold mb-4">Prize Pool</h2>

          {eventData.prizePool?.length === 0 && (
            <p className="text-gray-500 italic mb-2">No prizes added.</p>
          )}

          {eventData.prizePool?.map((prize, index) => (
            <input
              key={index}
              className="border p-2 w-full rounded mb-2"
              placeholder={`Prize ${index + 1}`}
              value={prize}
              onChange={(e) => {
                const updated = [...(eventData.prizePool || [])];
                updated[index] = e.target.value;
                setEventData({ ...eventData, prizePool: updated });
              }}
            />
          ))}

          <button
            onClick={() =>
              setEventData({
                ...eventData,
                prizePool: [...(eventData.prizePool || []), ""],
              })
            }
            className="px-4 py-2 mt-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
          >
            + Add Prize
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={createCompetition}
            disabled={isUploadingImage}
            className={`px-8 py-2 bg-yellow-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-yellow-700 transition ${
              isUploadingImage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploadingImage ? "Uploading..." : "Create Competition"}
          </button>
        </div>
      </div>

      <Navigation />
      <Footer />
    </>
  );
}
