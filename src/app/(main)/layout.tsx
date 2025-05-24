'use client';

import FullLayout from "@/components/common/Layout/FullLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FullLayout>
      {children}
    </FullLayout>
  );
}