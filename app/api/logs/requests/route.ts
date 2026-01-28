
import { queryDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url || "");
  const id = searchParams.get("bookingRequestId");

  try {
    const query = `
      SELECT * 
      FROM [Marketplace].[APILog] 
      WHERE BookingRequestID = '${id}'
    `;

    const logs = await queryDatabase(query);
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
