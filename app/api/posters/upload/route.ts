import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Template from "@/models/Template";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const file: File | null = formData.get("templateFile") as unknown as File;
    const templateName = formData.get("templateName") as string;
    const userId = formData.get("userId") as string;

    if (!file || !templateName || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save in MongoDB
    const newTemplate = await Template.create({
      templateName,
      image: buffer,
      contentType: file.type,
      ownerId: userId,
    });

    return NextResponse.json({ success: true, data: newTemplate }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
