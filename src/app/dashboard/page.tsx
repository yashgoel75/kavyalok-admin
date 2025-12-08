"use client";

import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/page";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";
import axios from "axios";

interface Admin {
  name: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/");
        return;
      }
      if (!u.emailVerified) {
        auth.signOut();
        router.replace("/");
        return;
      }
      setUser(u);
      fetchAdminDetails(u);
    });
  }, []);

  async function fetchAdminDetails(u: User) {
    const res = axios.get(`/api/admin?email=${u.email}`);
    const data = (await res).data;
    setAdmin(data.data);
  }

  if (!user) return <div>Loading...</div>;

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const goTo = (path: string) => router.push(`/dashboard/${path}`);

  return (
    <>
      <Header />

      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-xl text-gray-800">
          Welcome back, {admin?.name} 👋 - Here's what's happening today!
        </p>

        <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2">
  {[
    {
      label: "Create a new event or competition",
      action: "events/create",
      button: "Create",
    },
    {
      label: "Manage an existing event or competition",
      action: "events",
      button: "Manage",
    },
  ].map((item) => (
    <div
      key={item.action}
      className="w-full rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm hover:shadow transition"
    >
      <span className="text-lg font-medium">{item.label}</span>
      <button
        onClick={() => goTo(item.action)}
        className="px-6 py-2 mt-4 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 transition"
      >
        {item.button}
      </button>
    </div>
  ))}
</div>

      </div>
      <Navigation />
      <Footer />
    </>
  );
}
