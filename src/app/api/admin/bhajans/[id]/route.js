import { assertAdminRequest, adminErrorResponse } from "@/lib/adminAuth";
import {
  deleteAdminBhajan,
  updateAdminBhajan,
  updateBhajanStatus,
} from "@/lib/adminRepository";

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

export async function DELETE(request, { params }) {
  try {
    await assertAdminRequest(request);
    const { id } = await params;

    return Response.json(await deleteAdminBhajan(id));
  } catch (error) {
    return adminErrorResponse(error);
  }
}
