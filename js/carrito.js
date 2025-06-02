let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Configuración de WhatsApp
const NUMERO_WHATSAPP = "573113081706"; // Reemplaza con tu número de WhatsApp (incluye código de país sin +)
const NOMBRE_TIENDA = "NKD Pereira";

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Repuesto</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio.toLocaleString('es-CO')}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${(producto.precio * producto.cantidad).toLocaleString('es-CO')}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);
        })
    
        actualizarBotonesEliminar();
        actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Repuesto eliminado del carrito",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #dc2626, #ef4444)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a eliminar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} repuestos del carrito.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
            
            Toastify({
                text: "Carrito vaciado correctamente",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "linear-gradient(to right, #dc2626, #ef4444)",
                  borderRadius: "2rem",
                  textTransform: "uppercase",
                  fontSize: ".75rem"
                },
                offset: {
                    x: '1.5rem',
                    y: '1.5rem'
                }
            }).showToast();
        }
    })
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado.toLocaleString('es-CO')}`;
}

// Función para generar el mensaje de WhatsApp
function generarMensajeWhatsApp() {
    const totalCompra = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    const cantidadProductos = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    const fecha = new Date().toLocaleDateString('es-CO');
    
    let mensaje = `🏍️ *${NOMBRE_TIENDA}* - Nueva Orden de Compra\n\n`;
    mensaje += `🗓️ *Fecha:* ${fecha}\n`;
    mensaje += `📦 *Productos solicitados:* ${cantidadProductos}\n\n`;
    mensaje += `*DETALLE DEL PEDIDO:*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    productosEnCarrito.forEach((producto, index) => {
        mensaje += `${index + 1}. *${producto.titulo}*\n`;
        mensaje += `   Cantidad: ${producto.cantidad}\n`;
        mensaje += `   Precio unitario: $${producto.precio.toLocaleString('es-CO')}\n`;
        mensaje += `   Subtotal: $${(producto.precio * producto.cantidad).toLocaleString('es-CO')}\n\n`;
    });
    
    mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💰 *TOTAL A PAGAR: $${totalCompra.toLocaleString('es-CO')}*\n\n`;
    mensaje += `✅ *Solicito cotización y disponibilidad*\n`;
    mensaje += `💳 *Medio de pago preferido:* A coordinar\n`;
    mensaje += `🚛 *Entrega:* A coordinar\n\n`;
    mensaje += `¡Gracias por elegir ${NOMBRE_TIENDA}! 🏍️`;
    
    return encodeURIComponent(mensaje);
}

// Función para abrir WhatsApp
function abrirWhatsApp() {
    const mensaje = generarMensajeWhatsApp();
    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;
    
    // Abrir en una nueva ventana/pestaña
    window.open(urlWhatsApp, '_blank');
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    const totalCompra = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    const cantidadProductos = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    
    Swal.fire({
        title: '¡Compra realizada!',
        icon: 'success',
        html: `
            <p>Has seleccionado ${cantidadProductos} repuestos</p>
            <p><strong>Total: $${totalCompra.toLocaleString('es-CO')}</strong></p>
            <p>¡Gracias por confiar en ${NOMBRE_TIENDA}!</p>
        `,
        confirmButtonText: 'Proceder al pago por WhatsApp',
        confirmButtonColor: '#25D366', // Color verde de WhatsApp
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#6b7280'
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar segundo modal con instrucciones
            Swal.fire({
                title: '📱 Contactar por WhatsApp',
                icon: 'info',
                html: `
                    <p>Se abrirá WhatsApp con tu pedido completo.</p>
                    <p><strong>Podrás coordinar:</strong></p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>✅ Disponibilidad de productos</li>
                        <li>💰 Método de pago</li>
                        <li>🚚 Forma de entrega</li>
                        <li>📍 Dirección de envío</li>
                    </ul>
                    <br>
                    <small>Si WhatsApp no se abre automáticamente, verifica que esté instalado en tu dispositivo.</small>
                `,
                confirmButtonText: 'Abrir WhatsApp',
                confirmButtonColor: '#25D366',
                showCancelButton: true,
                cancelButtonText: 'Volver',
                cancelButtonColor: '#6b7280'
            }).then((secondResult) => {
                if (secondResult.isConfirmed) {
                    // Abrir WhatsApp
                    abrirWhatsApp();
                    
                    // Limpiar carrito después de enviar a WhatsApp
                    setTimeout(() => {
                        productosEnCarrito.length = 0;
                        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                        
                        contenedorCarritoVacio.classList.add("disabled");
                        contenedorCarritoProductos.classList.add("disabled");
                        contenedorCarritoAcciones.classList.add("disabled");
                        contenedorCarritoComprado.classList.remove("disabled");
                    }, 1000);
                }
            });
        }
    });
}