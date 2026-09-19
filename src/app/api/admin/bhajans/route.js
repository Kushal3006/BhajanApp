import { assertAdminRequest, adminErrorResponse } from "@/lib/adminAuth";
import { createAdminBhajan, listAdminBhajans } from "@/lib/adminRepository";

export async function GET(request) {
  try {
    await assertAdminRequest(request);
    return Response.json(await listAdminBhajans());
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
