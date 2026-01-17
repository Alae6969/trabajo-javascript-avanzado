document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario-presupuesto');
    const elementosCalculo = ['producto', 'plazo', 'extras'];
    
    const config = {
        productos: {
            'web-basica': 1000,
            'web-avanzada': 2500,
            'ecommerce': 5000
        },
        extras: {
            'seo': 300,
            'hosting': 200,
            'mantenimiento': 150,
            'dominio': 50
        },
        descuentos: {
            15: 0.10,   
            30: 0.05,   
            60: 0.02    
        }
    };

    function validarNombre(nombre) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/;
        return regex.test(nombre);
    }

    function validarApellidos(apellidos) {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,40}$/;
        return regex.test(apellidos);
    }

    function validarTelefono(telefono) {
        const regex = /^\d{9}$/;
        return regex.test(telefono);
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function mostrarError(campo, mensaje) {
        const errorElement = document.getElementById(`error-${campo}`);
        errorElement.textContent = mensaje;
        errorElement.style.display = 'block';
    }

    function limpiarError(campo) {
        const errorElement = document.getElementById(`error-${campo}`);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    document.getElementById('nombre').addEventListener('blur', function() {
        if (!validarNombre(this.value)) {
            mostrarError('nombre', 'Solo letras, máximo 15 caracteres');
        } else {
            limpiarError('nombre');
        }
    });

    document.getElementById('apellidos').addEventListener('blur', function() {
        if (!validarApellidos(this.value)) {
            mostrarError('apellidos', 'Solo letras, máximo 40 caracteres');
        } else {
            limpiarError('apellidos');
        }
    });

    document.getElementById('telefono').addEventListener('blur', function() {
        if (!validarTelefono(this.value)) {
            mostrarError('telefono', 'Solo números, 9 dígitos');
        } else {
            limpiarError('telefono');
        }
    });

    document.getElementById('email').addEventListener('blur', function() {
        if (!validarEmail(this.value)) {
            mostrarError('email', 'Formato de email inválido');
        } else {
            limpiarError('email');
        }
    });

    function calcularPresupuesto() {
        const productoSelect = document.getElementById('producto');
        const productoSeleccionado = productoSelect.options[productoSelect.selectedIndex];
        const precioBase = parseFloat(productoSeleccionado.getAttribute('data-precio')) || 0;
        
        const plazo = parseInt(document.getElementById('plazo').value) || 0;
        const extras = document.querySelectorAll('input[name="extras"]:checked');
        
        let totalExtras = 0;
        extras.forEach(extra => {
            totalExtras += parseFloat(extra.getAttribute('data-precio')) || 0;
        });
        
        let descuento = 0;
        Object.keys(config.descuentos).forEach(dias => {
            if (plazo <= parseInt(dias)) {
                descuento = config.descuentos[dias];
            }
        });
        
        const subtotal = precioBase + totalExtras;
        const total = subtotal - (subtotal * descuento);
        
        const infoDescuento = document.getElementById('info-descuento');
        if (descuento > 0) {
            infoDescuento.textContent = `¡Descuento del ${descuento * 100}% aplicado!`;
            infoDescuento.style.color = 'green';
        } else {
            infoDescuento.textContent = '';
        }
        
        document.getElementById('total').value = `€${total.toFixed(2)}`;
    }

    elementosCalculo.forEach(elemento => {
        if (elemento === 'extras') {
            document.querySelectorAll('input[name="extras"]').forEach(checkbox => {
                checkbox.addEventListener('change', calcularPresupuesto);
            });
        } else {
            document.getElementById(elemento).addEventListener('change', calcularPresupuesto);
            document.getElementById(elemento).addEventListener('input', calcularPresupuesto);
        }
    });

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const condiciones = document.getElementById('condiciones').checked;
        
        let formularioValido = true;
        
        if (!validarNombre(nombre)) {
            mostrarError('nombre', 'Solo letras, máximo 15 caracteres');
            formularioValido = false;
        }
        
        if (!validarApellidos(apellidos)) {
            mostrarError('apellidos', 'Solo letras, máximo 40 caracteres');
            formularioValido = false;
        }
        
        if (!validarTelefono(telefono)) {
            mostrarError('telefono', 'Solo números, 9 dígitos');
            formularioValido = false;
        }
        
        if (!validarEmail(email)) {
            mostrarError('email', 'Formato de email inválido');
            formularioValido = false;
        }
        
        if (!condiciones) {
            mostrarError('condiciones', 'Debes aceptar las condiciones');
            formularioValido = false;
        }
        
        if (formularioValido) {
            alert('Formulario enviado correctamente. Presupuesto: ' + document.getElementById('total').value);
            formulario.reset();
            calcularPresupuesto(); 
        }
    });

    calcularPresupuesto();
});