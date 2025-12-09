import { useParams } from "react-router-dom";

export function AdminOrderDetailPage() {
    const { id } = useParams();

    return (
        <div>
            <h1>Detalhes do Pedido #{id}</h1>
            <p>Itens, status, anexos e mudanças de status vêm aqui.</p>
        </div>
    );
}
