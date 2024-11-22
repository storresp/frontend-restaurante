// Función para cargar pedidos desde la API
function loadPedidos(filtroEstado = null, clienteBusqueda = null) {
    const token = sessionStorage.getItem('token');
    const url = "http://127.0.0.1:8000/api/pedidos";

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        let pedidos = data.pedidos;

        // Filtros
        if (filtroEstado) {
            pedidos = pedidos.filter(pedido => pedido.estado === filtroEstado);
        }

        if (clienteBusqueda) {
            pedidos = pedidos.filter(pedido =>
                pedido.cliente.nombre.toLowerCase().includes(clienteBusqueda.toLowerCase())
            );
        }

        renderOrders(pedidos);
    })
    .catch(error => {
        console.error("Error al cargar los pedidos:", error);
    });
}

// Función para renderizar los pedidos en la tabla
function renderOrders(pedidos) {
    const ordersList = document.getElementById("orders-list");
    ordersList.innerHTML = ""; // Limpiar la lista antes de renderizar

    pedidos.forEach(pedido => {
        const row = document.createElement("tr");

        // ID del pedido
        const idCell = document.createElement("td");
        idCell.textContent = pedido.id;
        row.appendChild(idCell);

        // Información del cliente
        const clienteCell = document.createElement("td");
        clienteCell.textContent = `${pedido.cliente.nombre}`;
        row.appendChild(clienteCell);

        // Estado del pedido
        const estadoCell = document.createElement("td");
        estadoCell.textContent = pedido.estado;
        row.appendChild(estadoCell);

        // Botón de acción
        const accionesCell = document.createElement("td");
        const changeStateButton = document.createElement("button");
        changeStateButton.textContent =
            pedido.estado === "PENDIENTE" ? "Marcar como Entregado" : "Marcar como Pendiente";
        changeStateButton.addEventListener("click", () => changePedidoEstado(pedido.id, pedido.estado));
        accionesCell.appendChild(changeStateButton);
        row.appendChild(accionesCell);

        // Agregar la fila a la tabla
        ordersList.appendChild(row);
    });
}

// Función para cambiar el estado de un pedido
function changePedidoEstado(id, currentEstado) {
    const token = sessionStorage.getItem('token');
    const nuevoEstado = currentEstado === "PENDIENTE" ? "ENTREGADO" : "PENDIENTE";

    fetch(`http://127.0.0.1:8000/api/pedidos/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(`Pedido #${id} actualizado a ${nuevoEstado}`);
        loadPedidos(); // Recargar pedidos
    })
    .catch(error => {
        console.error(`Error al cambiar el estado del pedido #${id}:`, error);
    });
}

// Filtros y búsqueda
document.getElementById("filter-pending").addEventListener("click", () => loadPedidos("PENDIENTE"));
document.getElementById("filter-attended").addEventListener("click", () => loadPedidos("ENTREGADO"));
document.getElementById("search-client").addEventListener("click", () => {
    const clienteBusqueda = document.getElementById("client-search").value;
    loadPedidos(null, clienteBusqueda);
});

// Cargar pedidos al cargar la página
document.addEventListener("DOMContentLoaded", () => loadPedidos());

function cerrarSesión() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

document.getElementById('Logout').addEventListener("click", () => cerrarSesión());