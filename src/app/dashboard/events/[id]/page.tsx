"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import Link from "next/link";
import { getFirebaseToken } from "@/utils";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Clipboard,
  Edit,
  Trash2,
  Trophy,
  HelpCircle,
  CheckCircle2,
  Save,
  X,
  Plus,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";

import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("@/components/TestEditor"), {
  ssr: false,
});

interface ParticipationOption {
  label: string;
  price: number;
}

interface Question {
  _id?: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface Participant {
  _id: string;
  participantName: string;
  participantEmail: string;
  chosenParticipationOption: ParticipationOption;
  paidAmount: number;
  paymentStatus: string;
  status: string;
}

interface Competition {
  _id: string;
  owner?: string;
  name: string;
  about: string;
  coverPhoto?: string;
  dateStart?: string;
  dateEnd?: string;
  timeStart?: string;
  timeEnd?: string;
  registrationDeadline?: string;
  participantLimit?: number;
  mode?: string;
  venue?: string;
  participationOptions: ParticipationOption[];
  customQuestions: Question[];
  judgingCriteria: string[];
  prizePool: string[];
  participants: Participant[];
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [event, setEvent] = useState<Competition | null>(null);
  
  const [formData, setFormData] = useState<Competition | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/competitions/${id}`);
        const data = await res.json();
        setEvent(data);
        setFormData(data); 
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleCancelEdit = () => {
    setFormData(event); 
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      await fetch(`/api/competitions/${id}`, { method: "DELETE" });
      router.push("/dashboard/events");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete event.");
    }
  };

  
  const handleInputChange = (field: keyof Competition, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleCoverPhotoChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

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
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sigData.apiKey);
      form.append("timestamp", sigData.timestamp);
      form.append("signature", sigData.signature);
      form.append("folder", sigData.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: form }
      );

      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Cloudinary upload failed");

      setFormData((prev) => (prev ? { ...prev, coverPhoto: cloudData.secure_url } : null));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addCategory = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      participationOptions: [...formData.participationOptions, { label: "", price: 0 }],
    });
  };

  const updateCategory = (index: number, key: keyof ParticipationOption, value: any) => {
    if (!formData) return;
    const updated = [...formData.participationOptions];
    // @ts-ignore
    updated[index][key] = value;
    setFormData({ ...formData, participationOptions: updated });
  };

  const removeCategory = (index: number) => {
    if (!formData) return;
    const updated = formData.participationOptions.filter((_, i) => i !== index);
    setFormData({ ...formData, participationOptions: updated });
  };

  const addQuestion = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      customQuestions: [...formData.customQuestions, { label: "", type: "text", required: false, options: [] }],
    });
  };

  const updateQuestion = (index: number, key: keyof Question, value: any) => {
    if (!formData) return;
    const updated = [...formData.customQuestions];
    // @ts-ignore
    updated[index][key] = value;
    if (key === "type" && (value === "text" || value === "number")) {
      updated[index].options = [];
    }
    setFormData({ ...formData, customQuestions: updated });
  };

  const addOption = (qIndex: number) => {
    if (!formData) return;
    const updated = [...formData.customQuestions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options!.push("");
    setFormData({ ...formData, customQuestions: updated });
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    if (!formData) return;
    const updated = [...formData.customQuestions];
    if (updated[qIndex].options) {
      updated[qIndex].options![optIndex] = value;
      setFormData({ ...formData, customQuestions: updated });
    }
  };

  const removeQuestion = (index: number) => {
    if (!formData) return;
    const updated = formData.customQuestions.filter((_, i) => i !== index);
    setFormData({ ...formData, customQuestions: updated });
  };

  const updateSimpleArray = (field: 'judgingCriteria' | 'prizePool', index: number, value: string) => {
    if (!formData) return;
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addItemToSimpleArray = (field: 'judgingCriteria' | 'prizePool') => {
    if (!formData) return;
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeItemFromSimpleArray = (field: 'judgingCriteria' | 'prizePool', index: number) => {
    if (!formData) return;
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/competitions/${id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedEvent = await res.json();
      setEvent(updatedEvent); 
      setFormData(updatedEvent); 
      setIsEditing(false); 
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 animate-pulse">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading details...
      </div>
    );

  if (!event || !formData) return <p className="p-6 text-center">Event not found.</p>;

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12 min-h-[80vh]">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b pb-6">
          <div>
            {isEditing ? (
               <input 
                 className="text-4xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-indigo-600 outline-none w-full bg-transparent placeholder-gray-300"
                 value={formData.name}
                 onChange={(e) => handleInputChange("name", e.target.value)}
                 placeholder="Event Name"
               />
            ) : (
               <h1 className="text-4xl font-bold text-gray-900">{event.name}</h1>
            )}
            
            {!isEditing && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Reg. Deadline:{" "}
                  {event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : "N/A"}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="cursor-pointer flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                   Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploadingImage}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-yellow-600 transition shadow-sm"
                >
                  <Edit className="w-4 h-4" /> Edit Event
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-100 text-red-600 font-medium rounded-lg hover:bg-red-100 transition shadow-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="animate-fade-in space-y-8">
            
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
              <label className="font-semibold block mb-2 text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Cover Photo
              </label>
              <div className="flex gap-6 items-start">
                 {formData.coverPhoto && (
                   <img src={formData.coverPhoto} alt="Preview" className="object-cover rounded-lg shadow-sm bg-white" />
                 )}
                 <div className="flex-1">
                   <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverPhotoChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {isUploadingImage && <p className="text-sm mt-2 text-blue-600">Uploading...</p>}
                 </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700">About the Event</label>
              <QuillEditor
                value={formData.about}
                onChange={(html) => handleInputChange("about", html)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div>
                   <label className="font-semibold block mb-1 text-sm text-gray-600">Mode</label>
                   <input className="border p-2 w-full rounded" value={formData.mode} onChange={(e) => handleInputChange("mode", e.target.value)} />
                </div>
                <div>
                   <label className="font-semibold block mb-1 text-sm text-gray-600">Participant Limit</label>
                   <input type="number" className="border p-2 w-full rounded" value={formData.participantLimit} onChange={(e) => handleInputChange("participantLimit", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                   <label className="font-semibold block mb-1 text-sm text-gray-600">Venue</label>
                   <input className="border p-2 w-full rounded" value={formData.venue} onChange={(e) => handleInputChange("venue", e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-sm text-gray-600">Start Date</label>
                  <input type="date" className="border p-2 w-full rounded" value={formData.dateStart?.split('T')[0]} onChange={(e) => handleInputChange("dateStart", e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-sm text-gray-600">End Date</label>
                  <input type="date" className="border p-2 w-full rounded" value={formData.dateEnd?.split('T')[0]} onChange={(e) => handleInputChange("dateEnd", e.target.value)} />
                </div>
                <div>
                   <label className="font-semibold block mb-1 text-sm text-gray-600">Reg. Deadline</label>
                   <input type="date" className="border p-2 w-full rounded" value={formData.registrationDeadline?.split('T')[0]} onChange={(e) => handleInputChange("registrationDeadline", e.target.value)} />
                </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Clipboard className="w-4 h-4" /> Participation Packages</h3>
                  <button onClick={addCategory} className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">+ Add</button>
                </div>
                <div className="space-y-3">
                  {formData.participationOptions.map((opt, i) => (
                    <div key={i} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-500">Label</label>
                        <input className="border p-2 w-full rounded text-sm" value={opt.label} onChange={(e) => updateCategory(i, "label", e.target.value)} />
                      </div>
                      <div className="w-32">
                        <label className="text-xs font-semibold text-gray-500">Price</label>
                        <input type="number" className="border p-2 w-full rounded text-sm" value={opt.price} onChange={(e) => updateCategory(i, "price", e.target.value)} />
                      </div>
                      <button onClick={() => removeCategory(i)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Custom Questions</h3>
                  <button onClick={addQuestion} className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">+ Add</button>
                </div>
                <div className="space-y-4">
                  {formData.customQuestions.map((q, i) => (
                    <div key={i} className="p-4 border rounded-lg bg-gray-50 relative">
                       <button onClick={() => removeQuestion(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                       <div className="grid grid-cols-2 gap-3 mb-2">
                          <input className="border p-2 rounded text-sm" placeholder="Question" value={q.label} onChange={(e) => updateQuestion(i, "label", e.target.value)} />
                          <select className="border p-2 rounded text-sm" value={q.type} onChange={(e) => updateQuestion(i, "type", e.target.value)}>
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="select">Select</option>
                            <option value="radio">Radio</option>
                            <option value="checkbox">Checkbox</option>
                          </select>
                       </div>
                       {["select", "radio", "checkbox"].includes(q.type) && (
                         <div className="pl-4 border-l-2 border-gray-300 mt-2">
                           <p className="text-xs font-bold text-gray-500 mb-1">Options:</p>
                           {q.options?.map((opt, optIdx) => (
                             <input key={optIdx} className="border p-1 w-full rounded text-sm mb-1" value={opt} onChange={(e) => updateOption(i, optIdx, e.target.value)} />
                           ))}
                           <button onClick={() => addOption(i)} className="text-xs text-blue-600 hover:underline">+ Add Option</button>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </div>

               <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Judging Criteria</h3>
                      <button onClick={() => addItemToSimpleArray('judgingCriteria')} className="p-1 rounded bg-gray-100 hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2">
                      {formData.judgingCriteria.map((c, i) => (
                        <div key={i} className="flex gap-2">
                          <input className="border p-2 w-full rounded text-sm" value={c} onChange={(e) => updateSimpleArray('judgingCriteria', i, e.target.value)} />
                          <button onClick={() => removeItemFromSimpleArray('judgingCriteria', i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2"><Trophy className="w-4 h-4" /> Prize Pool</h3>
                      <button onClick={() => addItemToSimpleArray('prizePool')} className="p-1 rounded bg-gray-100 hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2">
                      {formData.prizePool.map((p, i) => (
                        <div key={i} className="flex gap-2">
                          <input className="border p-2 w-full rounded text-sm" value={p} onChange={(e) => updateSimpleArray('prizePool', i, e.target.value)} />
                          <button onClick={() => removeItemFromSimpleArray('prizePool', i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {event.coverPhoto && (
                <div className="relative w-full overflow-hidden rounded-xl shadow-md bg-gray-100">
                  <img src={event.coverPhoto} alt={event.name} className="w-full object-cover" />
                </div>
              )}

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">About the Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: event.about}}></p>
              </section>

              {event.participationOptions.length > 0 && (
                <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-gray-800"><Clipboard className="w-5 h-5 text-yellow-500" /><h2 className="text-xl font-semibold">Participation Packages</h2></div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {event.participationOptions.map((opt, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <span className="font-medium text-gray-700">{opt.label}</span>
                        <span className="font-bold text-gray-900">Rs {opt.price}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {event.judgingCriteria.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3 text-gray-800"><CheckCircle2 className="w-5 h-5 text-yellow-500" /><h2 className="text-xl font-semibold">Judging Criteria</h2></div>
                    <ul className="space-y-2 mt-2">{event.judgingCriteria.map((c, i) => (<li key={i} className="flex items-center gap-2 text-gray-700"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />{c}</li>))}</ul>
                  </section>
                )}
                {event.prizePool.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3 text-gray-800"><Trophy className="w-5 h-5 text-yellow-500" /><h2 className="text-xl font-semibold">Prize Pool</h2></div>
                    <ul className="space-y-2 mt-2">{event.prizePool.map((p, i) => (<li key={i} className="flex items-center gap-2 text-gray-700"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />{p}</li>))}</ul>
                  </section>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Event Details</h3>
                <div className="space-y-5 text-sm">
                  {event.dateStart && event.dateEnd && (
                    <div className="flex gap-3"><Calendar className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="font-medium text-gray-900">Date</p><p className="text-gray-600">{new Date(event.dateStart).toLocaleDateString()} – {new Date(event.dateEnd).toLocaleDateString()}</p></div></div>
                  )}
                  {event.mode && (
                    <div className="flex gap-3"><Clipboard className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="font-medium text-gray-900">Mode</p><p className="text-gray-600 capitalize">{event.mode}</p></div></div>
                  )}
                  {event.venue && (
                    <div className="flex gap-3"><MapPin className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="font-medium text-gray-900">Venue</p><p className="text-gray-600">{event.venue}</p></div></div>
                  )}
                  {event.participantLimit && (
                    <div className="flex gap-3"><Users className="w-5 h-5 text-gray-400 shrink-0" /><div><p className="font-medium text-gray-900">Capacity</p><p className="text-gray-600">{event.participantLimit} Participants</p></div></div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {!isEditing && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Participants ({event.participants?.length || 0})</h2>
            {(!event.participants || event.participants.length === 0) ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300"><Users className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No participants have registered yet.</p></div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Package</th><th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {event.participants.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{p.participantName}</td>
                          <td className="px-6 py-4 text-gray-600">{p.participantEmail}</td>
                          <td className="px-6 py-4 text-gray-600">{p.chosenParticipationOption?.label}</td>
                          <td className="px-6 py-4 capitalize">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Navigation />
      <Footer />
    </>
  );
}