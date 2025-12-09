import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Upload,
    FileText,
    Download,
    Eye,
    Package,
    User,
} from "lucide-react";

import {
    uploadDocument,
    listDocuments,
} from "@/services/admin-orders-documents";

import "./orders.css";

interface OrderDetail {
    id: number;
    customerName?: string;
    totalAmount: number;
    status: string;
    orderDate?: string;
    items: {
        productName: string;
        quantity: number;
        price: number;
    }[];
}

interface OrderDocument {
    id: number;
    originalFilename: string;
    contentType: string;
    size: number;
    uploadDate: string;
}

export default function AdminOrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [docs, setDocs] = useState<OrderDocument[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(true);
    const [savingStatus, setSavingStatus] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setErrorMessage("ID do pedido inválido.");
            setLoading(false);
            return;
        }
        loadOrder();
        loadDocuments();
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const res = await api.get(`/admin/orders/${id}`);
            setOrder(res.data);
            setSelectedStatus(res.data.status);
        } catch (err) {
            console.error("Erro ao carregar pedido:", err);
            setErrorMessage("Erro ao carregar detalhes do pedido.");
        } finally {
            setLoading(false);
        }
    };

    const loadDocuments = async () => {
        if (!id) return;
        try {
            const res = await listDocuments(Number(id));
            setDocs(res);
        } catch (err) {
            console.error("Erro ao listar documentos:", err);
        }
    };

    const handleSaveStatus = async () => {
        if (!id || !selectedStatus) return;

        setSavingStatus(true);
        setFeedbackMessage(null);
        setErrorMessage(null);

        try {
            const res = await api.put(`/admin/orders/${id}/status`, {
                newStatus: selectedStatus,
            });
            setOrder(res.data);
            setFeedbackMessage("Status atualizado! E-mail enviado ao cliente.");
        } catch (err) {
            console.error("Erro ao atualizar status:", err);
            setErrorMessage("Erro ao atualizar status.");
        } finally {
            setSavingStatus(false);
        }
    };

    const handleUpload = async () => {
        if (!file || !id) return;

        setUploading(true);
        setErrorMessage(null);
        setFeedbackMessage(null);

        try {
            await uploadDocument(Number(id), file);
            setFile(null);

            const fileInput = document.getElementById("file-upload") as HTMLInputElement | null;
            if (fileInput) fileInput.value = "";

            await loadDocuments();
            setFeedbackMessage("Documento anexado com sucesso.");
        } catch {
            setErrorMessage("Erro ao enviar documento.");
        } finally {
            setUploading(false);
        }
    };

    const getCustomerInitial = (name?: string) => {
        if (!name) return "?";
        const trimmed = name.trim();
        if (!trimmed) return "?";
        return trimmed[0].toUpperCase();
    };

    const formatOrderDate = (value?: string) => {
        if (!value) return "-";
        const d = new Date(value);
        if (isNaN(d.getTime())) return "-";
        return (
            d.toLocaleDateString("pt-BR") +
            " às " +
            d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        );
    };

    if (loading)
        return <div className="loading-container">Carregando detalhes...</div>;

    if (!order)
        return (
            <div className="orders-page">
                <p>{errorMessage ?? "Pedido não encontrado."}</p>
                <button onClick={() => navigate("/admin/orders")} className="back-link">
                    <ArrowLeft size={18} /> Voltar
                </button>
            </div>
        );

    const customerInitial = getCustomerInitial(order.customerName);
    const customerName = order.customerName || "Cliente Desconhecido";
    const formattedDate = formatOrderDate(order.orderDate);

    return (
        <div className="orders-page">

            <div className="page-header-row">
                <button onClick={() => navigate("/admin/orders")} className="back-link">
                    <ArrowLeft size={20} /> Voltar para lista
                </button>
                <h1 className="page-title">Detalhes do Pedido #{order.id}</h1>
            </div>

            {errorMessage && <div className="error-banner">{errorMessage}</div>}
            {feedbackMessage && <div className="success-banner">{feedbackMessage}</div>}

            <div className="details-grid">

                <div className="details-main">

                    <div className="detail-card">
                        <div className="card-header">
                            <User size={20} /> Informações do Cliente
                        </div>
                        <div className="card-body">
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "10px",
                            }}>
                                <div
                                    className="avatar-placeholder"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        background: "#e0e7ff",
                                        color: "#4f46e5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {customerInitial}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: "bold" }}>
                                        {customerName}
                                    </p>
                                </div>
                            </div>

                            <p>
                                <strong>Data do Pedido:</strong> {formattedDate}
                            </p>
                        </div>
                    </div>

                    <div className="detail-card">
                        <div className="card-header">
                            <Package size={20} /> Itens do Pedido
                        </div>

                        <table className="custom-table">
                            <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Qtd</th>
                                <th>Preço Un.</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.items.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>R$ {item.price.toFixed(2)}</td>
                                    <td><strong>R$ {(item.price * item.quantity).toFixed(2)}</strong></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="total-row">
                            <span>Total do Pedido:</span>
                            <strong>R$ {order.totalAmount.toFixed(2)}</strong>
                        </div>
                    </div>

                </div>

                <div className="details-sidebar">

                    <div className="detail-card">
                        <div className="card-header">Alterar Status</div>
                        <div className="card-body">
                            <label className="input-label">Situação Atual</label>

                            <select
                                className="status-select-large"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                                <option value="PAGO">Pago</option>
                                <option value="EM_TRANSPORTE">Em Transporte</option>
                                <option value="CONCLUIDO">Concluído</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>

                            <button
                                className="save-status-btn"
                                onClick={handleSaveStatus}
                                disabled={savingStatus || selectedStatus === order.status}
                            >
                                <Save size={18} />
                                {savingStatus ? "Salvando..." : "Atualizar Status"}
                            </button>
                        </div>
                    </div>

                    <div className="detail-card">
                        <div className="card-header">Documentos & N.F.</div>

                        <div className="card-body">

                            <div className="upload-area">
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                    className="file-input"
                                />

                                <button
                                    onClick={handleUpload}
                                    className="upload-action-btn"
                                    disabled={!file || uploading}
                                >
                                    <Upload size={16} />
                                    {uploading ? "Enviando..." : "Anexar"}
                                </button>
                            </div>

                            <ul className="docs-list">

                                {docs.length === 0 ? (
                                    <li className="no-docs">Nenhum anexo encontrado.</li>
                                ) : (
                                    docs.map((doc) => (
                                        <li key={doc.id} className="doc-item">

                                            <div className="doc-icon">
                                                <FileText size={20} color="#64748b" />
                                            </div>

                                            <div className="doc-info">
                                                <span className="doc-name">{doc.originalFilename}</span>
                                                <span className="doc-size">{(doc.size / 1024).toFixed(0)} KB</span>
                                            </div>


                                            <div className="doc-actions-mini">

                                                <a
                                                    href={`http://localhost:8080/admin/orders/documents/${doc.id}/view`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Visualizar"
                                                    className="doc-link-btn"
                                                >
                                                    <Eye size={16} />
                                                </a>

                                                <a
                                                    href={`http://localhost:8080/admin/orders/documents/${doc.id}/download`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Baixar"
                                                    className="doc-link-btn"
                                                >
                                                    <Download size={16} />
                                                </a>

                                            </div>
                                        </li>
                                    ))
                                )}

                            </ul>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
