import React from "react";
import Profile from "@/lib/components/Profile";

export const metadata = {
  title: "Profile",
  description: "User Profile page",
};
const UserProfile = async () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default UserProfile;
