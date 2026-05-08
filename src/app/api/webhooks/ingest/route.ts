import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse incoming JSON body
    const body = await req.json();
    const { headline, summary_text, category_tags, source_links, audio_url } = body;

    // 2. Simple validation check
    if (!headline || !summary_text) {
      return NextResponse.json(
        { error: "Missing required fields: headline and summary_text are mandatory." },
        { status: 400 }
      );
    }

    // 3. Insert data into the news_signals table using the Admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from("news_signals")
      .insert([
        {
          headline,
          summary_text,
          category_tags: category_tags || [],
          source_links: source_links || [],
          audio_url: audio_url || null,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Insertion Error:", error);
      return NextResponse.json(
        { error: "Failed to insert news signal", details: error.message },
        { status: 500 }
      );
    }

    // 4. Return success response
    return NextResponse.json(
      { message: "News signal ingested successfully", signal: data[0] },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Webhook Handler Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
