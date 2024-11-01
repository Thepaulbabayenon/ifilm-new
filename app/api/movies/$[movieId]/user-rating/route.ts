import { db } from "@/db/drizzle";
import { userRatings, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    
    
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const rating = await db.query.userRatings.findFirst({
      where: and(
        eq(userRatings.movieId, parseInt(params.movieId)),
        eq(userRatings.userId, userId)
      ),
    });

    return NextResponse.json({ rating: rating?.rating || 0 });
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { movieId: string } }
) {
  console.log("Received POST request for movieId:", params.movieId);
  console.log("Request method:", req.method); // Log method

  try {
    const { userId, rating } = await req.json();

    console.log("User ID:", userId);
    console.log("Rating:", rating);

    if (!userId || rating === undefined) { // Ensure rating is defined
      return NextResponse.json(
        { error: "User ID and rating are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const userExists = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 408 }
      );
    }

    // Existing rating handling and saving logic here...
    
  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}

