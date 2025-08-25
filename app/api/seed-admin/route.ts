import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Member } from '@/models/Employee';
import dbConnect from '@/lib/dbconnect';

export async function POST() {
  try {
    console.log('🔄 Connecting to database...');
    await dbConnect();
    
    const username = 'puneet';
    const password = 'puneet@ssi';
    
    // Check if user already exists
    const existingUser = await Member.findOne({ username: username.toLowerCase() });
    
    if (existingUser) {
      console.log('👤 User already exists, updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Update the existing user
      await Member.findByIdAndUpdate(existingUser._id, {
        password: hashedPassword,
        updatedAt: new Date()
      });
      
      return NextResponse.json({
        success: true,
        message: 'User password updated successfully!',
        user: { id: existingUser._id, username: existingUser.username }
      });
    } else {
      console.log('👤 Creating new user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create new user
      const newUser = new Member({
        username: username.toLowerCase(),
        password: hashedPassword
      });
      
      await newUser.save();
      
      return NextResponse.json({
        success: true,
        message: 'User created successfully!',
        user: { id: newUser._id, username: newUser.username }
      });
    }
    
  } catch (error: any) {
    console.error('❌ Database setup failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database setup failed',
      error: error.message
    }, { status: 500 });
  }
}
