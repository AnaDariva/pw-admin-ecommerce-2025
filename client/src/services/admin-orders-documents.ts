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


export async function downloadDocument(documentId: number) {
    const url = `${import.meta.env.VITE_API_URL}/admin/orders/documents/${documentId}/download`;

    const res = await api.get(url, {
        responseType: "blob",
    });

    const blob = new Blob([res.data]);
    const objectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "documento";
    link.click();

    window.URL.revokeObjectURL(objectUrl);
}


export async function viewDocument(documentId: number) {
    const url = `${import.meta.env.VITE_API_URL}/admin/orders/documents/${documentId}/view`;

    const res = await api.get(url, {
        responseType: "blob",
    });

    const blob = new Blob([res.data]);
    const objectUrl = window.URL.createObjectURL(blob);

    window.open(objectUrl, "_blank");
}

