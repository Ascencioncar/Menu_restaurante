        let mesaActual = null;
        let pedidosPorMesa = {
            1: { items: [], total: 0, cliente: '' },
            2: { items: [], total: 0, cliente: '' },
            3: { items: [], total: 0, cliente: '' },
            4: { items: [], total: 0, cliente: '' }
        };

        function seleccionarMesa(numeroMesa) {
            if (mesaActual === numeroMesa) return;
            
            document.querySelectorAll('.mesa-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`.mesa-btn:nth-child(${numeroMesa})`).classList.add('active');
            
            mesaActual = numeroMesa;
            document.getElementById('mesa-actual').textContent = numeroMesa;
            document.getElementById('cliente-nombre').value = pedidosPorMesa[numeroMesa].cliente;
            document.getElementById('cliente-actual').textContent = pedidosPorMesa[numeroMesa].cliente || '-';
            
            updateCart();
        }

        function actualizarNombreCliente(nombre) {
            if (mesaActual === null) {
                alert('Por favor, seleccione una mesa primero');
                document.getElementById('cliente-nombre').value = '';
                return;
            }
            pedidosPorMesa[mesaActual].cliente = nombre;
            document.getElementById('cliente-actual').textContent = nombre || '-';
        }

        function toggleCart() {
            if (mesaActual === null) {
                alert('Por favor, seleccione una mesa primero');
                return;
            }
            document.querySelector('.cart').classList.add('active');
            document.querySelector('.cart-overlay').classList.add('active');
        }

        function closeCart() {
            document.querySelector('.cart').classList.remove('active');
            document.querySelector('.cart-overlay').classList.remove('active');
        }

        function addToCart(name, price) {
            if (mesaActual === null) {
                alert('Por favor, seleccione una mesa primero');
                return;
            }

            pedidosPorMesa[mesaActual].items.push({ name, price });
            pedidosPorMesa[mesaActual].total += price;
            updateCart();
        }

        function removeFromCart(index) {
            const mesa = pedidosPorMesa[mesaActual];
            mesa.total -= mesa.items[index].price;
            mesa.items.splice(index, 1);
            updateCart();
        }

        function updateCart() {
            if (mesaActual === null) return;

            const mesa = pedidosPorMesa[mesaActual];
            const cartItems = document.querySelector('.cart-items');
            const cartTotal = document.querySelector('.cart-total');
            
            cartItems.innerHTML = mesa.items.map((item, index) => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>$${item.price.toFixed(2)} 
                        <button onclick="removeFromCart(${index})">×</button>
                    </span>
                </div>
            `).join('');
            
            cartTotal.textContent = `Total: $${mesa.total.toFixed(0)}`;
        }
  

        async function Enviar() {
            if (mesaActual === null) {
                alert('Por favor, seleccione una mesa antes de enviar el pedido');
                return;
            }
        
            const mesa = mesaActual;
            const cliente = pedidosPorMesa[mesa].cliente || 'Cliente desconocido';
            const items = pedidosPorMesa[mesa].items;
            const total = pedidosPorMesa[mesa].total;
            const comentario = document.getElementById('mesa').value || '';
        
            if (items.length === 0) {
                alert('El pedido está vacío, no se puede enviar.');
                return;
            }
        
            try {
                const response = await fetch('http://localhost:3000/guardar-pedido', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mesa, cliente, items, total, comentario })
                });
        
                const data = await response.json();
        
                if (data.success) {
                    alert('¡Pedido enviado exitosamente!');
                    // Reiniciar el pedido de la mesa actual
                    pedidosPorMesa[mesa] = { items: [], total: 0, cliente };
                    document.getElementById('mesa').value = '';
                    updateCart();
                } else {
                    alert('Error al enviar el pedido: ' + data.message);
                }
            } catch (error) {
                console.error('Error al enviar el pedido:', error);
                alert('Ocurrió un error al conectar con el servidor.');
            }
        }
        