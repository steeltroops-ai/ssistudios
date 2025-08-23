// src/app/api/templates/[templateId]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Template from "@/models/Template";

interface RouteContext {
  params: {
    templateId: string;
  };
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { templateId } = context.params;

  if (!templateId) {
    return NextResponse.json(
      { error: "Template ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const deletedTemplate = await Template.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    console.log(`--- SUCCESSFULLY DELETED TEMPLATE WITH ID: ${templateId} ---`);
    return NextResponse.json(
      { message: `Template ${templateId} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("--- DATABASE DELETION FAILED ---", error);
    return NextResponse.json(
      { error: "Server error during template deletion" },
      { status: 500 }
    );
  }
}
