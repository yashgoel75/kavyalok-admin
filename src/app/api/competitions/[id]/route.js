import { NextResponse } from "next/server";
import { register } from "@/instrumentation";
import { Competition } from "../../../../../db/schema";

export async function GET(req, context) {
  try {
    await register();

    const { id } = await context.params;
    const event = await Competition.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function PUT(req, context) {
  try {
    await register();

    const { id } = await context.params;
    const data = await req.json();

    const updated = await Competition.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(req, context) {
  try {
    await register();

    const { id } = await context.params;
    const deleted = await Competition.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
