import { Competition } from "../../../../db/schema";
import { register } from "@/instrumentation";
import { NextResponse } from "next/server";
import { CreateCompetitionPayload } from "@/types/competition";

export async function GET() {
  await register();
  const competitions = await Competition.find({});
  return Response.json(competitions);
}

export async function POST(req: Request) {
  try {
    await register();

    const body: CreateCompetitionPayload = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Competition name is required." },
        { status: 400 }
      );
    }

    if (!body.participationOptions || body.participationOptions.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one participation option is required." },
        { status: 400 }
      );
    }

    if (!body.owner) {
      return NextResponse.json(
        { success: false, error: "Owner (admin ID) is required." },
        { status: 400 }
      );
    }

    const newCompetition = await Competition.create({
      owner: body.owner,

      name: body.name,
      about: body.about,
      coverPhoto: body.coverPhoto,

      participationOptions: body.participationOptions,
      customQuestions: body.customQuestions,

      participantLimit: body.participantLimit,
      mode: body.mode,
      venue: body.venue,

      dateStart: body.dateStart ? new Date(body.dateStart) : undefined,
      dateEnd: body.dateEnd ? new Date(body.dateEnd) : undefined,

      timeStart: body.timeStart,
      timeEnd: body.timeEnd,

      registrationDeadline: body.registrationDeadline
        ? new Date(body.registrationDeadline)
        : undefined,

      judgingCriteria: body.judgingCriteria,
      prizePool: body.prizePool,
    });

    return NextResponse.json(
      { success: true, data: newCompetition },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating competition:", error);

    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
