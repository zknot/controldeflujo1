// --- Base de datos en memoria (Ejemplos corporativos limpios sin simbolos) ---
let pedidos = [
    { id: 101, cliente: "Distribuidora Sur", estado: "Ingresado" },
    { id: 102, cliente: "Cadenas Maxi", estado: "En proceso" },
    { id: 103, cliente: "Almacen Central (Falta Stock SKU-402)", estado: "Terminado con faltante" },
    { id: 104, cliente: "Logistica Express (Discrepancia en 5 bultos)", estado: "Terminado con faltante" },
    { id: 105, cliente: "Minorista Juan", estado: "Terminado" },
    { id: 106, cliente: "Supermercado Oeste", estado: "Terminado" },
    { id: 107, cliente: "Ferreteria Olmos", estado: "Facturado" },
    { id: 108, cliente: "Hipermercado San Jose", estado: "Facturado" }
];

const flujoEstados = ["Ingresado", "En proceso", "Terminado", "Terminado con faltante", "Facturado"];

// --- 1. FUNCIÓN DE RENDERIZADO (Reactiva ante cambios) ---
function actualizarPantalla() {
    console.log("[MONITOR] Cambio de estado detectado. Renderizando 4 columnas...");

    const colPrep = document.getElementById('col-preparacion');
    const colRevisar = document.getElementById('col-revisar');
    const colListo = document.getElementById('col-listo');
    const colDesp = document.getElementById('col-despachado');

    let htmlPrep = '', htmlRevisar = '', htmlListo = '', htmlDesp = '';

    pedidos.forEach(p => {
        let claseCard = '';
        let claseBadge = '';

        switch(p.estado) {
            case 'Ingresado': claseCard = 'card-ingresado'; claseBadge = 'badge-ingresado'; break;
            case 'En proceso': claseCard = 'card-proceso'; claseBadge = 'badge-proceso'; break;
            case 'Terminado': claseCard = 'card-terminado'; claseBadge = 'badge-terminado'; break;
            case 'Terminado con faltante': claseCard = 'card-faltante'; claseBadge = 'badge-faltante'; break;
            case 'Facturado': claseCard = 'card-facturado'; claseBadge = 'badge-facturado'; break;
        }

        const cardHtml = `
            <div class="pedido-card ${claseCard}">
                <h2>#${p.id}</h2>
                <p>${p.cliente}</p>
                <span class="badge ${claseBadge}">${p.estado}</span>
            </div>
        `;

        if (p.estado === 'Ingresado' || p.estado === 'En proceso') {
            htmlPrep += cardHtml;
        } else if (p.estado === 'Terminado con faltante') {
            htmlRevisar += cardHtml; 
        } else if (p.estado === 'Terminado') {
            htmlListo += cardHtml;
        } else if (p.estado === 'Facturado') {
            htmlDesp += cardHtml;
        }
    });

    colPrep.innerHTML = htmlPrep;
    colRevisar.innerHTML = htmlRevisar;
    colListo.innerHTML = htmlListo;
    colDesp.innerHTML = htmlDesp;
}

// --- 2. GESTOR DE EVENTOS ---
function cambiarEstadoPedido(id, nuevoEstado) {
    const pedido = pedidos.find(p => p.id === id);
    
    if (pedido && pedido.estado !== nuevoEstado) {
        if (nuevoEstado === "Terminado con faltante" && !pedido.cliente.includes("Falta")) {
            pedido.cliente += " (Falta Stock / Revisar)";
        }
        if (nuevoEstado === "Facturado" && pedido.cliente.includes(" (Falta")) {
            pedido.cliente = pedido.cliente.split(" (Falta")[0];
        }

        console.log("[DATOS] Pedido #" + id + " muto a " + nuevoEstado);
        pedido.estado = nuevoEstado;
        actualizarPantalla(); 
    }
}

// --- 3. SIMULADOR AUTOMÁTICO ---
function recibirEventoDispositivo() {
    if (pedidos.length === 0) return;

    const indiceAleatorio = Math.floor(Math.random() * pedidos.length);
    const pedido = pedidos[indiceAleatorio];
    const estadoActual = pedido.estado;

    if (estadoActual !== "Facturado") {
        const idxFlujo = flujoEstados.indexOf(estadoActual);
        let proximoEstado;

        if (estadoActual === "En proceso") {
            proximoEstado = Math.random() < 0.35 ? "Terminado con faltante" : "Terminado";
        } else if (estadoActual === "Terminado con faltante") {
            proximoEstado = "Facturado";
        } else {
            proximoEstado = flujoEstados[idxFlujo + 1];
        }

        cambiarEstadoPedido(pedido.id, proximoEstado);

    } else {
        pedidos = pedidos.filter(p => p.id !== pedido.id);
        
        const nuevosClientes = ["Distribuidora Cordoba", "Transportes LD", "Logistica Austral", "Industrias Fenix"];
        const nuevoId = Math.floor(Math.random() * (999 - 600 + 1)) + 600;
        const nuevoCliente = nuevosClientes[Math.floor(Math.random() * nuevosClientes.length)];
        
        pedidos.push({ id: nuevoId, cliente: nuevoCliente, estado: "Ingresado" });
        actualizarPantalla();
    }
}

// --- 4. INICIO ---
document.addEventListener("DOMContentLoaded", () => {
    actualizarPantalla();
    setInterval(recibirEventoDispositivo, 4000);
});