document.addEventListener('DOMContentLoaded', function () {
  const botonInicio = document.getElementById('BotonInicio');
  const BotonAlMenu = document.getElementById('BotonAlMenu');
  const botonEmpleados = document.getElementById('Empleados');
  const BotonIntegrantes = document.getElementById("BotonIntegrantes");
  const botonesCategoria = {
    'Entrada': document.getElementById('Entradas'),
    'Rolls': document.getElementById('PlatoFuerte'),
    'Postre': document.getElementById('Postre'),
    'Bebida': document.getElementById('Bebidas'),
    'Todo': document.getElementById('Todo')
  };
  
  if (botonEmpleados) {
    botonEmpleados.addEventListener('click', ()=> {
      window.location.href = 'https://storresp.github.io/frontend-empleados/';
    });
  }

  if (BotonIntegrantes) {
    BotonIntegrantes.addEventListener('click', () => {
      window.location.href = 'integrantes.html';
    });
  };

  if (BotonAlMenu) {
    BotonAlMenu.addEventListener('click', () => {
      window.location.href = 'menu.html';
    });
  };

  if (botonInicio) {
    botonInicio.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  };

  function getCart() {
    const cart = localStorage.getItem('carrito');
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart) {
    localStorage.setItem('carrito', JSON.stringify(cart));
  }

  function agregarAlCarrito(nombre, precio) {
    const cart = getCart();
    cart.push({ nombre, precio });
    saveCart(cart);
    renderCarrito();
  }

  function removerDelCarrito(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCarrito();
  }

  function vaciarCarrito() {
    localStorage.removeItem('carrito');
    renderCarrito();
  }

  function renderCarrito() {
    const comprasList = document.getElementById('Compras');
    const resumen = document.getElementById('Resumen');
    if (!comprasList || !resumen) return; // Solo en menu.html

    const cart = getCart();
    comprasList.innerHTML = '';

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      
      const info = document.createElement('span');
      info.textContent = `${item.nombre} - $${item.precio.toLocaleString('es-CO')}`;
      
      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.classList.add('remove-item');
      removeButton.addEventListener('click', () => {
        removerDelCarrito(index);
      });
      
      li.appendChild(info);
      li.appendChild(removeButton);
      comprasList.appendChild(li);
    });

    const totalItems = cart.length;
    const totalPrice = cart.reduce((total, item) => total + item.precio, 0);
    
    // Formatear el total con separadores de miles
    const totalPriceFormateado = totalPrice.toLocaleString('es-CO');

    resumen.innerHTML = `
      <p>Items: ${totalItems}</p>
      <p>Total: $${totalPriceFormateado} COP</p>
    `;
  }

  renderCarrito();

  function renderCarritoPago() {
    const itemsList = document.getElementById('Items');
    const resumenPago = document.getElementById('Resumen');
    if (!itemsList || !resumenPago) return;

    const cart = getCart();
    itemsList.innerHTML = '';

    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.nombre} - $${item.precio.toLocaleString('es-CO')}`;
      itemsList.appendChild(li);
    });

    const totalItems = cart.length;
    const totalPrice = cart.reduce((total, item) => total + item.precio, 0);
    
    // Formatear el total con separadores de miles
    const totalPriceFormateado = totalPrice.toLocaleString('es-CO');

    resumenPago.innerHTML = `
      <p>Items: ${totalItems}</p>
      <p>Total: $${totalPriceFormateado} COP</p>
    `;
  }

  if (document.getElementById('Menu')) {
    const Menu = document.getElementById('Menu');
    const Titulo = document.getElementById('titleMenu');
    const BotonPagar = document.getElementById("PayRedir");
    const botonVaciar = document.getElementById('Vaciar');

    function mostrarCategoria(categoria) {
      const itemsArray = Menu.querySelectorAll('li');
      itemsArray.forEach(item => {
        const tipoPlato = item.querySelector('p#Tipo').textContent.split(': ')[1];
        if (categoria === 'Todo' || tipoPlato === categoria) {
          item.style.display = 'grid';

          if (categoria === 'Entrada') {
            Titulo.innerHTML = "Entradas"
          } else if (categoria === 'Rolls') {
            Titulo.innerHTML = "Rolls"
          } else if (categoria === 'Postre') {
            Titulo.innerHTML = "Postres"
          } else if (categoria === 'Bebida') {
            Titulo.innerHTML = "Bebidas"
          } else if (categoria === 'Todo') {
            Titulo.innerHTML = "Menú Completo"
          }

        } else {
          item.style.display = 'none';
        }
      });
    }

    async function fetchData() {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwZ9JIrW-FLEe43WL84XRcbIb0blzf9y0sy2L8kLvK73OXYJqMBRFUDybr_qF_YMy4_UA/exec');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderMenu(data);

      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    }

    // Función para Renderizar el Menú en la Página
    function renderMenu(menuData) {
      const menuList = document.getElementById('Menu');
      menuList.innerHTML = ''; 

      const itemsArray = menuData.data;

      itemsArray.forEach(item => {
        const platos = document.createElement('li');
        platos.classList.add('menu-item');

        platos.innerHTML = `
          <div>
            <img src="${item.imagen}" alt="${item.nombre}">
          </div>
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <p>Precio: $${item.precio}</p>
          <p id="Tipo">Tipo de plato: ${item.tipo}</p>
          <button class="agregarCarrito">Agregar al carrito</button>
        `;
        menuList.appendChild(platos);
      });

      asignarEventosCarrito();
    }

    function asignarEventosCarrito() {
      const botonesAgregar = document.querySelectorAll('.agregarCarrito');
      botonesAgregar.forEach((boton, index) => {
        boton.addEventListener('click', function() {
          const item = this.closest('li');
          const nombre = item.querySelector('h3').textContent;
          const precioTexto = item.querySelector('p:nth-child(4)').textContent;
          
          let precio = '0';
          if (precioTexto.includes('$')) {
            precio = precioTexto.split('$')[1].replace(/,/g, ''); // Eliminar todas las comas
          }
          
          const precioNumero = parseFloat(precio);
          
          agregarAlCarrito(nombre, precioNumero);
        });
      });
    }

    if (botonVaciar) {
      botonVaciar.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
          vaciarCarrito();
        }
      });
    }

    if (BotonPagar) {
      BotonPagar.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length > 0) {
          window.location.href = 'pago.html';
        } else {
          alert('El carrito está vacío.');
        }
      });
    }

    fetchData();

    Object.keys(botonesCategoria).forEach(categoria => {
      const boton = botonesCategoria[categoria];
      boton.addEventListener('click', () => {
        mostrarCategoria(categoria);
      });
    });

  } if (document.getElementById('paymentForm')) {
    const paymentForm = document.getElementById('paymentForm');

    renderCarritoPago();

    paymentForm.addEventListener('submit', async function(event) {
      event.preventDefault(); 

      const nombreCliente = document.getElementById('nombreCliente').value.trim();
      const telefonoCliente = document.getElementById('telefonoCliente').value.trim();
      const direccionCliente = document.getElementById('direccionCliente').value.trim();

      if (!nombreCliente || !telefonoCliente || !direccionCliente) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      const cart = getCart();
      if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
      }

      const datosPago = {
        cliente: {
          nombre: nombreCliente,
          telefono: telefonoCliente,
          direccion: direccionCliente
        },
        pedido: cart
      };
      
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwZ9JIrW-FLEe43WL84XRcbIb0blzf9y0sy2L8kLvK73OXYJqMBRFUDybr_qF_YMy4_UA/exec', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*'
          },
          body: JSON.stringify(datosPago)
        });

        if (!response || response.type === 'opaque') {
          console.warn('Advertencia: Respuesta opaca debido a las políticas de CORB. Ignorando el error.');
          alert('¡Pedido realizado con éxito!');
          vaciarCarrito();
          window.location.href = 'index.html';
          return;
        }

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.result === 'success') {
          alert('¡Pedido realizado con éxito!');
          vaciarCarrito();

          window.location.href = 'index.html';
        } else {
          throw new Error('Error al procesar el pedido.');
        }
      } catch (error) {
        console.error('Error al enviar el pedido:', error);
        alert('Hubo un problema al procesar tu pedido. Por favor, inténtalo de nuevo.');
      }
    });
  }
});