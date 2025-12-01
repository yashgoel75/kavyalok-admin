import { NextRequest, NextResponse } from "next/server";
import { User, Post } from "../../../../db/schema";
import { register } from "@/instrumentation";
import redis from "@/lib/redis";

export async function GET(req: Request) {
  await register();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);

  const skip = (page - 1) * limit;
  const cacheKey = `posts:page:${page}:limit:${limit}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const posts = await Post.find({})
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate({
    path: "author",
    select:
      "-posts -bio -bookmarks -instagram -snapchat -followers -following -likes -notifications -createdAt -updatedAt -__v",
  })
  .select({
    title: 1,
    content: 1,
    picture: 1,
    author: 1,
    likes: 1,
    comments: 1,
    color: 1,
    createdAt: 1,
    _id: 1,
  })
  .lean();


  const total = await Post.countDocuments();

  const response = {
    posts,
    total,
    hasMore: skip + limit < total,
  };

  // Cache result (5 min)
  await redis.set(cacheKey, response, { ex: 300 });

  return NextResponse.json(response);
}
