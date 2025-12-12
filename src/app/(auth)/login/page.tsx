
import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <Image
                            src="/upds-logo.png"
                            alt="Logo"
                            width={64}
                            height={64}
                        />
                        Level UPDS
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/bg-upds.png"
                    alt="Level UPDS Background"
                    fill
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
                />
            </div>
        </div>
    )
}
