import { Admin } from "../../../../db/schema";
import { register } from "@/instrumentation";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await register();

        const email = req.nextUrl.searchParams.get("email");
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const data = await Admin.findOne({ email });

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
