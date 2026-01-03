import { NextResponse } from "next/server";
import { validateResetPasswordToken } from "@/lib/authClient";
import config from '@/lib/config';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    if (!token) {
        return NextResponse.redirect(new URL(`/reset-password/verify/link-expired?email=${email}`, config.HOSTNAME ));
    }

    const result = await validateResetPasswordToken(token);

    if (result.success) {
        return NextResponse.redirect(
            new URL(`/reset-password?token=${encodeURIComponent(token)}`, config.HOSTNAME )
        );
    } else {
        return NextResponse.redirect(
            new URL(`/reset-password/verify/link-expired?email=${encodeURIComponent(email ?? '')}`, config.HOSTNAME )
        );
    }
}
