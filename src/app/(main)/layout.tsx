'use client';

import RootClientLayout from "@/components/common/Layout/RootClientLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootClientLayout>
      {children}
    </RootClientLayout>
  );
}