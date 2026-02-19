"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isEditorPage = pathname.includes('/editor')

    return (
        <div className="flex h-screen overflow-hidden bg-[#fafafa]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {isEditorPage ? (
                    children
                ) : (
                    <div className="mx-auto max-w-6xl px-8 py-8">
                        {children}
                    </div>
                )}
            </main>
        </div>
    )
}
