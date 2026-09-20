import { assertAdminRequest, adminErrorResponse } from "@/lib/adminAuth";
import { createAdminBhajan, listAdminBhajans } from "@/lib/adminRepository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    await assertAdminRequest(request);
    return Response.json(await listAdminBhajans(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request) {
  try {
    await assertAdminRequest(request);
    const body = await request.json();
    return Response.json(await createAdminBhajan(body), { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
