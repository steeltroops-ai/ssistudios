"use client";

import { Suspense } from "react";
import CardsContent from "../CardsContent";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function CardsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CardsContent />
    </Suspense>
  );
}
