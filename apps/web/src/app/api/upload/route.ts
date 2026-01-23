import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        // Basic validation
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "File must be an image" }, { status: 400 });
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Target bucket - ensure this exists in Supabase Storage
        const bucketName = 'media';

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Upload Error:", error);
            // Hint for the user in the error message
            return NextResponse.json({ error: `Upload failed: ${error.message}. Ensure bucket '${bucketName}' exists.` }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrlData.publicUrl });
    } catch (e: any) {
        console.error("Server Upload Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
