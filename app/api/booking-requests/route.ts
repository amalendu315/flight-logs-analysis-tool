
import { queryDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url || "");
  const date = searchParams.get("date");

  // Validate the date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  try {
    const query = `
      SELECT * 
      FROM [Marketplace].[BookingRequest] 
      WHERE CONVERT(date, Entrydate) = '${date}'
    `;

    const logs = await queryDatabase(query);
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching booking request:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking request logs" },
      { status: 500 }
    );
  }
}
