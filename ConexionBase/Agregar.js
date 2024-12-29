function Enviar() {
    if (mesaActual === null) {
        console.log('Por favor, seleccione una mesa antes de enviar el pedido.');
        return;
    }

    const mesa = pedidosPorMesa[mesaActual];

    if (mesa.items.length === 0) {
        console.log(`La mesa ${mesaActual} no tiene elementos en el pedido.`);
        return;
    }

    console.log(`Pedido para la mesa ${mesaActual} (${mesa.cliente || 'Sin nombre de cliente'}):`);
    mesa.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - $${item.price}`);
    });
    console.log(`Total: $${mesa.total}`);
}
