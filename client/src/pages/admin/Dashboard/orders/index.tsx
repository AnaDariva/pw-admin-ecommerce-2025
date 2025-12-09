import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Calendar,
    Eye,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    DollarSign,
    RefreshCw
} from "lucide-react";
import "./orders.css";

interface OrderSummary {
    id: number;
    customerName: string;
    totalAmount: number;
    status: string;
    orderDate: string;
}

interface OrderStats {
    aguardandoPagamento: number;
    pago: number;
    emTransporte: number;
    concluido: number;
    cancelado: number;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);

    const [statusFilter, setStatusFilter] = useState<string>("");
    const [customerFilter, setCustomerFilter] = useState<string>("");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadStats();
        loadOrders();
    }, []);

    const loadStats = async () => {
        try {
            const res = await api.get<OrderStats>("/admin/orders/stats");
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            const params: Record<string, string> = {};
            if (statusFilter) params.status = statusFilter;
            if (customerFilter) params.customer = customerFilter;
            if (fromDate) params.from = fromDate;
            if (toDate) params.to = toDate;

            const res = await api.get<OrderSummary[]>("/admin/orders", { params });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            setErrorMessage("Erro ao carregar pedidos.");
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setStatusFilter("");
        setCustomerFilter("");
        setFromDate("");
        setToDate("");
        setTimeout(() => loadOrders(), 100);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getStatusClass = (status: string) => {
        return status ? status.toLowerCase().replace(/_/g, "-") : "default";
    };

    const formatStatusText = (status: string) => {
        return status ? status.replace(/_/g, " ") : "Desconhecido";
    };

    return (
        <div className="orders-page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Gerenciamento de Pedidos</h1>
                    <p className="page-subtitle">Acompanhe e atualize o status das vendas.</p>
                </div>
            </header>

            {stats && (
                <div className="stats-row">
                    <div className="stat-box yellow">
                        <Clock size={20} />
                        <div>
                            <span>Aguardando</span>
                            <strong>{stats.aguardandoPagamento}</strong>
                        </div>
                    </div>
                    <div className="stat-box blue">
                        <DollarSign size={20} />
                        <div>
                            <span>Pago</span>
                            <strong>{stats.pago}</strong>
                        </div>
                    </div>
                    <div className="stat-box indigo">
                        <Truck size={20} />
                        <div>
                            <span>Transporte</span>
                            <strong>{stats.emTransporte}</strong>
                        </div>
                    </div>
                    <div className="stat-box green">
                        <CheckCircle size={20} />
                        <div>
                            <span>Concluído</span>
                            <strong>{stats.concluido}</strong>
                        </div>
                    </div>
                    <div className="stat-box red">
                        <XCircle size={20} />
                        <div>
                            <span>Cancelado</span>
                            <strong>{stats.cancelado}</strong>
                        </div>
                    </div>
                </div>
            )}

            <div className="filters-bar">
                <div className="filter-input-group">
                    <Search size={18} className="input-icon" />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                    />
                </div>

                <div className="filter-input-group">
                    <Filter size={18} className="input-icon" />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">Todos os Status</option>
                        <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                        <option value="PAGO">Pago</option>
                        <option value="EM_TRANSPORTE">Em Transporte</option>
                        <option value="CONCLUIDO">Concluído</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                </div>

                <div className="filter-input-group date-group">
                    <Calendar size={18} className="input-icon" />
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    <span className="date-separator">até</span>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>

                <div className="filter-actions">
                    <button className="btn-filter primary" onClick={loadOrders}>Filtrar</button>
                    <button className="btn-filter secondary" onClick={handleClearFilters} title="Limpar">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {errorMessage && <div className="error-banner">{errorMessage}</div>}

            <div className="table-container">
                {loading ? (
                    <div className="table-loading">Carregando pedidos...</div>
                ) : orders.length === 0 ? (
                    <div className="table-empty">Nenhum pedido encontrado.</div>
                ) : (
                    <table className="custom-table">
                        <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Cliente</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="fw-bold">#{order.id}</td>
                                <td>
                                    <div className="customer-cell">
                                        <div className="avatar-placeholder">
                                            {(order.customerName || "?").charAt(0).toUpperCase()}
                                        </div>
                                        {order.customerName || "Cliente Desconhecido"}
                                    </div>
                                </td>
                                <td>
                                    {new Date(order.orderDate).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="fw-bold">{formatCurrency(order.totalAmount)}</td>
                                <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {formatStatusText(order.status)}
                                        </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button
                                        className="action-btn"
                                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                                        title="Ver detalhes"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}