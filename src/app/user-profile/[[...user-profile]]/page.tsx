"use client";

import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-12">
      <UserProfile path="/user-profile" routing="path" />
    </div>
  );
}
