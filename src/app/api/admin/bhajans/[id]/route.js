import { assertAdminRequest, adminErrorResponse } from "@/lib/adminAuth";
import { updateAdminBhajan, updateBhajanStatus } from "@/lib/adminRepository";

export async function PATCH(request, { params }) {
  try {
    await assertAdminRequest(request);
    const { id } = await params;
    const body = await request.json();

    if (body.status && Object.keys(body).length === 1) {
      return Response.json(await updateBhajanStatus(id, body.status));
    }

    return Response.json(await updateAdminBhajan(id, body));
  } catch (error) {
    return adminErrorResponse(error);
  }
}
