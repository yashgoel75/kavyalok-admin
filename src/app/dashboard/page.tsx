"use client"

import { getAuth, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function Dashboard() {

    const router = useRouter();

      const [user, setUser] = useState<FirebaseUser | null>(null);
    
    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      if (user.emailVerified) {
        router.replace("/dashboard");
        return;
      }
      setUser(user);

      await auth.signOut();
    });

    return () => unsubscribe();
    }, [router]);
    
    const handleLogout = async () => {
        try {
            await signOut(getAuth());
            router.replace("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <>
            Hello
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}