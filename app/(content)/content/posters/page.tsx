"use client";

import { Suspense } from "react";
import PostersContent from "../PostersContent";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function PostersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PostersContent />
    </Suspense>
  );
}
