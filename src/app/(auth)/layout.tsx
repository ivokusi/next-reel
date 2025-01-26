import AuthProvider from "@/components/Auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div className="w-screen h-screen flex items-center justify-center">
                {children}
            </div>
        </AuthProvider>
    );
}