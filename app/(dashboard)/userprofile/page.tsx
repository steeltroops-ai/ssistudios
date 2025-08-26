import { Metadata } from "next";
import UserProfileContent from "./UserProfileContent";

export const metadata: Metadata = {
  title: "User Profile",
  description: "Manage your profile settings and preferences",
  keywords: "profile, settings, user, account",
};

export default function UserProfilePage() {
  return <UserProfileContent />;
}
