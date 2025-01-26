import AuthProvider from "@/components/Auth";
import Navigation from "@/components/Navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div className="w-screen h-screen text-white flex flex-col items-center gap-4">
                <Navigation />
                <div className="flex flex-1 items-center justify-center w-full">
                    {children}
                </div>
            </div>
        </AuthProvider>
    )
}