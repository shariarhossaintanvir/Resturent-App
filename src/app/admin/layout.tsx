'use client';

import React from 'react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <AdminSidebar />
      <div className="flex-1 w-full min-w-0">{children}</div>
    </div>
  );
}
