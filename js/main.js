const shopContent = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");

let carrito = [];

// Verificar si hay datos guardados en localStorage al cargar la página
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

productos.forEach((product) => {
    let content = document.createElement("div");

    content.className = "card";
    content.innerHTML = `
        <img src="${product.img}">
        <h3> ${product.nombre}</h3>
        <p class="prrice">${product.precio} $</p>
    `;
    shopContent.append(content);

    let comprar = document.createElement("button");
    comprar.innerText = "comprar";
    comprar.className = "comprar";

    content.append(comprar);

    comprar.addEventListener("click", () => {
        // Verificar si el producto ya está en el carrito
        const existingProduct = carrito.find(item => item.id === product.id);
        if (existingProduct) {
            // Si el producto ya está en el carrito, aumentar su cantidad
            existingProduct.cantidad++;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            carrito.push({
                id: product.id,
                img: product.img,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: 1
            });
        }
        console.log("Producto agregado al carrito:", carrito);
        guardarCarrito(); // Guardar el carrito en localStorage después de agregar un producto
    });
});

verCarrito.addEventListener("click", () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header"
    modalHeader.innerHTML = `
        <h1 class="modal-header-title">Carrito.</h1>
    `;
    modalContainer.append(modalHeader);

    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "x";
    modalbutton.className = "modal-header-button";

    modalbutton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    modalHeader.append(modalbutton);

    carrito.forEach((product, index) => {

        let carritoContent = document.createElement("div");
        carritoContent.className = "modal-content";
        carritoContent.innerHTML = `
            <img src="${product.img}">
            <h3>${product.nombre}</h3>
            <p>${product.precio} $</p>
        `;

        // Selector de cantidad de productos
        let cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.min = "1";
        cantidadInput.value = product.cantidad;
        cantidadInput.addEventListener("change", () => {
            // Actualizar la cantidad de productos en el carrito
            product.cantidad = parseInt(cantidadInput.value);
            console.log("Cantidad actualizada:", carrito);
            actualizarPrecioTotal();
            guardarCarrito(); // Guardar el carrito en localStorage después de actualizar la cantidad
        });

        carritoContent.append(cantidadInput);

        // Botón para eliminar productos del carrito
        let eliminarButton = document.createElement("button");
        eliminarButton.innerText = "Eliminar";
        eliminarButton.className = "eliminar-button";

        eliminarButton.addEventListener("click", () => {
            // Eliminar el producto del carrito y actualizar el precio total
            console.log("Antes de eliminar:", carrito);
            carrito = carrito.filter(item => item.id !== product.id);
            console.log("Después de eliminar:", carrito);
            carritoContent.remove();
            actualizarPrecioTotal();
            guardarCarrito(); // Guardar el carrito en localStorage después de eliminar un producto
        });

        carritoContent.append(eliminarButton);
        modalContainer.append(carritoContent);
    });

    // Calcular el precio total y mostrarlo
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    const totalBuying = document.createElement("div");
    totalBuying.className = "total-content";
    totalBuying.innerText = `Total a pagar: ${total} $`;
    modalContainer.append(totalBuying);
});

// Función para actualizar el precio total
function actualizarPrecioTotal() {
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    const totalBuying = document.querySelector(".total-content");
    totalBuying.innerText = `Total a pagar: ${total} $`;
}
