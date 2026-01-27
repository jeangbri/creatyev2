export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#0f172a] p-4 selection:bg-cyan-500/30 overflow-hidden text-slate-200">
            {/* Ambient Background Elements - Brighter and more visible */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-cyan-500/15 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/15 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {children}
            </div>

            {/* Subtle Grid Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        </div>
    )
}
