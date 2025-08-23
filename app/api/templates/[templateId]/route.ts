// src/app/api/templates/[templateId]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Import the DB connector
import Template from '@/models/Template';   // Import the Template model

export async function DELETE(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  const { templateId } = params;

  // 1. Check if an ID was provided
  if (!templateId) {
    return NextResponse.json(
      { error: 'Template ID is required' },
      { status: 400 }
    );
  }

  try {
    // 2. Connect to the database
    await dbConnect();

    // 3. Find and delete the template by its ID
    const deletedTemplate = await Template.findByIdAndDelete(templateId);

    // 4. Check if a template was actually found and deleted
    if (!deletedTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // 5. Respond with a success message
    console.log(`--- SUCCESSFULLY DELETED TEMPLATE WITH ID: ${templateId} ---`);
    return NextResponse.json(
      { message: `Template ${templateId} deleted successfully.` },
      { status: 200 } // response.ok will be true
    );
  } catch (error) {
    console.error('--- DATABASE DELETION FAILED ---', error);
    return NextResponse.json(
      { error: 'Server error during template deletion' },
      { status: 500 }
    );
  }
}
