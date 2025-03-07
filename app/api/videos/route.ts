import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { VideoInterface } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "Filed to fetch videos" },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body: VideoInterface = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Filed to create video:", error);

    return NextResponse.json(
      { eror: "Failed to create video" },
      { status: 200 }
    );
  }
}
 