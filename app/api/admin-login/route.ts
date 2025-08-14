// app/api/admin-login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Member, IMember } from '@/models/Employee'; // Import your Mongoose Member model
import dbConnect from '@/lib/dbconnect'; // Import your Mongoose database connection
// import bcrypt from 'bcryptjs'; // You'll need this for password hashing in a real app!

export async function POST(req: NextRequest) {
  await dbConnect(); // Connect to MongoDB using Mongoose

  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
  }

  try {
    // Find the member by username in the 'admins' collection
    // Note: The Member model is already configured to use the 'admins' collection.
    const user: IMember | null = await Member.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // ⚠️ IMPORTANT: In a real application, you MUST hash and compare passwords using bcrypt or a similar library.
    // For demonstration, we're doing a plain text comparison, which is INSECURE.
    // If you uncomment the bcrypt line in Member model, uncomment and use this:
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = (password === user.password); // This is INSECURE for production!

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // If credentials are valid, return a success response.
    // In a real application, you would set a secure HTTP-only cookie here
    // with a JWT (JSON Web Token) or session ID for authentication.
    return NextResponse.json({ message: 'Login successful!', user: { id: user._id, username: user.username } }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}