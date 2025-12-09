import { api } from "@/lib/axios";
import type { IOrderDocument } from "@/commons/types";

export async function listDocuments(orderId: number): Promise<IOrderDocument[]> {
    const res = await api.get(`/admin/orders/${orderId}/documents`);
    return res.data;
}

export async function uploadDocument(orderId: number, file: File): Promise<IOrderDocument> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/admin/orders/${orderId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
}

export function downloadDocument(documentId: number) {
    window.open(`/admin/orders/documents/${documentId}/download`, "_blank");
}

export function viewDocument(documentId: number) {
    window.open(`/admin/orders/documents/${documentId}/view`, "_blank");
}
