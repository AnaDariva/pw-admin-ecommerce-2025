import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import {
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    DollarSign,
    Users,
    Package,
    ArrowRight,
    Activity
} from "lucide-react";
import "./dashboard.css";

interface Stats {
    aguardandoPagamento: number;
    pago: number;
    emTransporte: number;
    concluido: number;
    cancelado: number;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        api.get("/admin/orders/stats")
            .then(res => setStats(res.data))
            .catch(err => console.error("Erro ao carregar stats:", err));
    }, []);

    if (!stats) {
        return <div className="loading-container">Carregando painel...</div>;
    }

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-welcome">
                <div>
                    <h1 className="welcome-title">Olá, Administrador</h1>
                    <p className="welcome-subtitle">Aqui está o resumo das operações da sua loja hoje.</p>
                </div>
                <div className="date-badge">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </header>

            <section className="dashboard-section">
                <h2 className="section-title"><Activity size={20}/> Visão Geral dos Pedidos</h2>
                <div className="stats-grid">
                    <div className="stat-card accent-yellow">
                        <div className="stat-header">
                            <span className="stat-label">Aguardando</span>
                            <div className="icon-circle yellow-bg"><Clock size={18} /></div>
                        </div>
                        <strong className="stat-value">{stats.aguardandoPagamento}</strong>
                        <p className="stat-desc">Pedidos pendentes</p>
                    </div>

                    <div className="stat-card accent-blue">
                        <div className="stat-header">
                            <span className="stat-label">Pagos</span>
                            <div className="icon-circle blue-bg"><DollarSign size={18} /></div>
                        </div>
                        <strong className="stat-value">{stats.pago}</strong>
                        <p className="stat-desc">Prontos para envio</p>
                    </div>

                    <div className="stat-card accent-indigo">
                        <div className="stat-header">
                            <span className="stat-label">Em Transporte</span>
                            <div className="icon-circle indigo-bg"><Truck size={18} /></div>
                        </div>
                        <strong className="stat-value">{stats.emTransporte}</strong>
                        <p className="stat-desc">A caminho do cliente</p>
                    </div>

                    <div className="stat-card accent-green">
                        <div className="stat-header">
                            <span className="stat-label">Concluídos</span>
                            <div className="icon-circle green-bg"><CheckCircle size={18} /></div>
                        </div>
                        <strong className="stat-value">{stats.concluido}</strong>
                        <p className="stat-desc">Entregas finalizadas</p>
                    </div>

                    <div className="stat-card accent-red">
                        <div className="stat-header">
                            <span className="stat-label">Cancelados</span>
                            <div className="icon-circle red-bg"><XCircle size={18} /></div>
                        </div>
                        <strong className="stat-value">{stats.cancelado}</strong>
                        <p className="stat-desc">Pedidos devolvidos/canc.</p>
                    </div>
                </div>
            </section>

            <section className="dashboard-section actions-section">
                <h2 className="section-title">Acesso Rápido</h2>
                <div className="actions-grid">
                    <button onClick={() => navigate("/admin/orders")} className="shortcut-card">
                        <div className="shortcut-icon primary"><Package size={24} /></div>
                        <div className="shortcut-info">
                            <strong>Gerenciar Pedidos</strong>
                            <span>Ver lista completa e detalhes</span>
                        </div>
                        <ArrowRight size={16} className="arrow-icon"/>
                    </button>

                    <button onClick={() => navigate("/admin/users")} className="shortcut-card">
                        <div className="shortcut-icon secondary"><Users size={24} /></div>
                        <div className="shortcut-info">
                            <strong>Gerenciar Usuários</strong>
                            <span>Aprovar ou bloquear acessos</span>
                        </div>
                        <ArrowRight size={16} className="arrow-icon"/>
                    </button>
                </div>
            </section>
        </div>
    );
}