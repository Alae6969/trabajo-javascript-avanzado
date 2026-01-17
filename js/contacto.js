document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando mapa de contacto...');
    
    const COORDS_CASTELLON = [39.980389, -0.104500];
    
    function inicializarMapa() {
        console.log('🗺️ Creando mapa...');
        
        const mapa = L.map('mapa').setView(COORDS_CASTELLON, 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            minZoom: 10
        }).addTo(mapa);
        
        console.log('✅ Mapa creado correctamente');
        return mapa;
    }
    
    function añadirMarcadorCurso(mapa) {
        console.log('📍 Añadiendo marcador del curso...');
        
        const iconoCurso = L.divIcon({
            html: '<div style="background: #4CAF50; color: white; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">🎓</div>',
            className: 'curso-marker',
            iconSize: [50, 50],
            iconAnchor: [25, 50]
        });
        
        const marcador = L.marker(COORDS_CASTELLON, { icon: iconoCurso }).addTo(mapa);
        
        marcador.bindPopup(`
            <div style="text-align: center; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #4CAF50;">🎓 Curso JavaScript</h3>
                <p style="margin: 0; font-weight: bold;">Castellón de la Plana</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                    Avenida de Cuidad de Transporte
                </p>
            </div>
        `).openPopup();
        
        return marcador;
    }
    
    function configurarCalculadoraRutas(mapa, marcadorCurso) {
        const btnCalcular = document.getElementById('calcular-ruta');
        const inputOrigen = document.getElementById('origen');
        const infoRuta = document.getElementById('info-ruta');
        
        let marcadorOrigen = null;
        let lineaRuta = null;
        
        btnCalcular.addEventListener('click', function() {
            const direccion = inputOrigen.value.trim();
            
            if (!direccion) {
                mostrarMensaje('Por favor, escribe una dirección', 'error');
                return;
            }
            
            calcularRuta(direccion, mapa, marcadorCurso);
        });
        
        inputOrigen.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                btnCalcular.click();
            }
        });
    }
    
    function calcularRuta(direccion, mapa, marcadorCurso) {
        mostrarMensaje('Buscando dirección...', 'loading');
        
        limpiarRutaAnterior(mapa);
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion + ', Castellón, España')}&limit=1`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error en la búsqueda');
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    throw new Error('Dirección no encontrada en Castellón');
                }
                
                const coordsOrigen = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                mostrarRutaEnMapa(coordsOrigen, mapa, marcadorCurso, data[0].display_name);
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarMensaje(error.message, 'error');
            });
    }
    
    function mostrarRutaEnMapa(coordsOrigen, mapa, marcadorCurso, nombreDireccion) {
        const iconoOrigen = L.divIcon({
            html: '<div style="background: #FF9800; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">📍</div>',
            className: 'origen-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        window.marcadorOrigen = L.marker(coordsOrigen, { icon: iconoOrigen }).addTo(mapa);
        window.marcadorOrigen.bindPopup(`<strong>📍 Tu ubicación</strong><br><small>${nombreDireccion.split(',')[0]}</small>`);
        
        window.lineaRuta = L.polyline([coordsOrigen, COORDS_CASTELLON], {
            color: '#4CAF50',
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(mapa);
        
        const distancia = calcularDistancia(COORDS_CASTELLON, coordsOrigen);
        const tiempo = calcularTiempoEstimado(distancia);
        
        mostrarInfoRuta(distancia, tiempo, nombreDireccion);
        
        const grupo = L.featureGroup([marcadorCurso, window.marcadorOrigen]);
        mapa.fitBounds(grupo.getBounds().pad(0.1));
    }
    
    function calcularDistancia(coords1, coords2) {
        const R = 6371; 
        const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
        const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    function calcularTiempoEstimado(distancia) {
        if (distancia < 2) {
            return Math.round((distancia / 5) * 60); 
        } else {
            return Math.round((distancia / 30) * 60); 
        }
    }
    
    function mostrarInfoRuta(distancia, tiempo, direccion) {
        const medio = distancia < 2 ? 'andando' : 'transporte/coche';
        const icono = distancia < 2 ? '🚶' : '🚗';
        
        document.getElementById('info-ruta').innerHTML = `
            <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                <h4 style="margin: 0 0 15px 0; font-size: 1.2em;">📊 Ruta Calculada</h4>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
                    <div>
                        <div style="font-size: 2em; margin-bottom: 5px;">📏</div>
                        <div style="font-size: 0.9em;">Distancia</div>
                        <div style="font-weight: bold; font-size: 1.1em;">${distancia.toFixed(1)} km</div>
                    </div>
                    
                    <div>
                        <div style="font-size: 2em; margin-bottom: 5px;">⏱️</div>
                        <div style="font-size: 0.9em;">Tiempo</div>
                        <div style="font-weight: bold; font-size: 1.1em;">${tiempo} min</div>
                    </div>
                    
                    <div>
                        <div style="font-size: 2em; margin-bottom: 5px;">${icono}</div>
                        <div style="font-size: 0.9em;">Medio</div>
                        <div style="font-weight: bold; font-size: 1.1em;">${medio}</div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 0.9em;">
                    <strong>Desde:</strong> ${direccion.split(',')[0]}
                </div>
            </div>
        `;
    }
    
    function limpiarRutaAnterior(mapa) {
        if (window.marcadorOrigen) {
            mapa.removeLayer(window.marcadorOrigen);
            window.marcadorOrigen = null;
        }
        if (window.lineaRuta) {
            mapa.removeLayer(window.lineaRuta);
            window.lineaRuta = null;
        }
    }
    
    function mostrarMensaje(mensaje, tipo) {
        const colores = {
            error: '#f44336',
            loading: '#2196F3',
            success: '#4CAF50'
        };
        
        const iconos = {
            error: '❌',
            loading: '🔄',
            success: '✅'
        };
        
        document.getElementById('info-ruta').innerHTML = `
            <div style="background: ${colores[tipo]}; color: white; padding: 1rem; border-radius: 5px; text-align: center;">
                ${iconos[tipo]} ${mensaje}
            </div>
        `;
    }
    
    try {
        const mapa = inicializarMapa();
        const marcadorCurso = añadirMarcadorCurso(mapa);
        configurarCalculadoraRutas(mapa, marcadorCurso);
        
        console.log('✅ Contacto inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar contacto:', error);
        document.getElementById('mapa').innerHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 2rem; text-align: center; border-radius: 8px;">
                <h3>❌ Error al cargar el mapa</h3>
                <p>No se pudo cargar el mapa interactivo.</p>
                <p><small>Error: ${error.message}</small></p>
            </div>
        `;
    }
});