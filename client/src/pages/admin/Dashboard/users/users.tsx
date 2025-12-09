import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import "./users.css";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    active: boolean;
    role: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadUsers = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const res = await api.get<AdminUser[]>("/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
            setErrorMessage("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleActivate = async (id: number) => {
        try {
            await api.put(`/users/${id}/activate`);
            await loadUsers();
        } catch (err) {
            console.error("Erro ao ativar usuário:", err);
            setErrorMessage("Erro ao ativar usuário.");
        }
    };

    const handleChangeRole = async (id: number, role: string) => {
        try {
            await api.put(`/users/${id}/role`, { role });
            await loadUsers();
        } catch (err) {
            console.error("Erro ao alterar role:", err);
            setErrorMessage("Erro ao alterar função do usuário.");
        }
    };

    if (loading) {
        return <div className="loading-users">Carregando usuários...</div>;
    }

    return (
        <div className="users-container">
            <h1 className="users-title">Gerenciamento de Usuários</h1>
            <p className="users-subtitle">
                Ative contas e defina permissões de acesso.
            </p>

            {errorMessage && (
                <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
            )}

            <table className="users-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Função</th>
                    <th>Ações</th>
                </tr>
                </thead>

                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>

                        <td>
                            {u.active ? (
                                <span className="badge active">Ativo</span>
                            ) : (
                                <span className="badge inactive">Inativo</span>
                            )}
                        </td>

                        <td>
                <span className="badge role">
                  {u.role === "ADMIN" ? "Administrador" : "Usuário"}
                </span>
                        </td>

                        <td className="users-actions">
                            {!u.active && (
                                <button
                                    className="btn activate"
                                    onClick={() => handleActivate(u.id)}
                                >
                                    Ativar
                                </button>
                            )}

                            <button
                                className="btn role"
                                onClick={() =>
                                    handleChangeRole(
                                        u.id,
                                        u.role === "ADMIN" ? "USER" : "ADMIN"
                                    )
                                }
                            >
                                {u.role === "ADMIN" ? "Tornar USER" : "Tornar ADMIN"}
                            </button>
                        </td>
                    </tr>
                ))}

                {users.length === 0 && (
                    <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                            Nenhum usuário encontrado.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
