import { assertAdminRequest, adminErrorResponse } from "@/lib/adminAuth";
import { createAdminCategory, listAdminCategories } from "@/lib/adminRepository";

export async function GET(request) {
  try {
    await assertAdminRequest(request);
    return Response.json(await listAdminCategories());
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request) {
  try {
    await assertAdminRequest(request);
    const body = await request.json();
    return Response.json(await createAdminCategory(body), { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
