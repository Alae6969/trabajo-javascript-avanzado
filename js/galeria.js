document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Galería inicializando...');
    

    function configurarLightbox() {
        if (typeof lightbox !== 'undefined' && lightbox !== null) {
            lightbox.option({
                'albumLabel': 'Proyecto %1 de %2',
                'wrapAround': true,
                'showImageNumberLabel': true,
                'disableScrolling': true,
                'fadeDuration': 300
            });
            console.log('✅ Lightbox configurado');
        } else {
            console.warn('⚠️ Lightbox no está disponible aún, reintentando...');
            setTimeout(configurarLightbox, 500);
        }
    }
    
    window.addEventListener('load', configurarLightbox);
    
    let proyectos = [];
    let proyectosVisibles = 6;
    const proyectosPorCarga = 3;
    let categoriaActual = 'todos';
    let proyectosCargados = false;
    
    const galeriaGrid = document.getElementById('galeria-grid');
    const loadingElement = document.getElementById('loading');
    const btnCargarMas = document.getElementById('cargar-mas');
    const filtrosBtns = document.querySelectorAll('.filtro-btn');
    
    const proyectosData = [
        {
            id: 1,
            titulo: "TaskMaster Pro",
            categoria: "tools",
            estudiante: "Ana Martínez",
            imagen_thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
            imagen_large: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            descripcion: "Aplicación de gestión de tareas con drag & drop, categorías y recordatorios inteligentes.",
            tecnologias: ["JavaScript", "LocalStorage", "Drag & Drop API", "CSS Grid"]
        },
        {
            id: 2,
            titulo: "WeatherApp Plus",
            categoria: "web",
            estudiante: "Carlos López",
            imagen_thumb: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=250&fit=crop",
            imagen_large: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
            descripcion: "App del tiempo con geolocalización, pronóstico extendido y gráficos interactivos.",
            tecnologias: ["API Fetch", "Geolocation API", "Chart.js", "Async/Await"]
        },
        {
            id: 3,
            titulo: "Memory Game JS",
            categoria: "juegos",
            estudiante: "María García",
            imagen_thumb: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=250&fit=crop",
            imagen_large: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&h=600&fit=crop",
            descripcion: "Juego de memoria con temporizador, sistema de puntuación y efectos visuales.",
            tecnologias: ["Event Listeners", "setTimeout", "CSS Animations", "Game Logic"]
        },
        {
            id: 4,
            titulo: "Expense Tracker",
            categoria: "tools",
            estudiante: "David Chen",
            imagen_thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
            imagen_large: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
            descripcion: "Sistema de seguimiento de gastos con categorías, informes y exportación de datos.",
            tecnologias: ["LocalStorage", "Chart.js", "Form Validation", "Data Export"]
        },
        {
            id: 5,
            titulo: "Portfolio Manager",
            categoria: "web",
            estudiante: "Alex Turner",
            imagen_thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
            imagen_large: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            descripcion: "Gestor de portfolios de inversión con datos en tiempo real y análisis técnico.",
            tecnologias: ["External APIs", "Data Visualization", "Real-time Updates", "Error Handling"]
        },
        {
            id: 6,
            titulo: "Quiz Challenge",
            categoria: "juegos",
            estudiante: "Laura Rodríguez",
            imagen_thumb: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
            imagen_large: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
            descripcion: "Plataforma de quizzes con múltiples categorías, temporizador y ranking de jugadores.",
            tecnologias: ["JSON Data", "Timer Functions", "Score System", "Responsive Design"]
        }
    ];
    
    function cargarGaleria() {
        console.log('📁 Cargando proyectos...');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
        
        setTimeout(() => {
            proyectos = proyectosData;
            proyectosCargados = true;
            mostrarProyectos();
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            console.log(`✅ ${proyectos.length} proyectos cargados`);
        }, 800);
    }
    
    function crearElementoProyecto(proyecto, index) {
        const article = document.createElement('article');
        article.className = 'proyecto-card';
        article.setAttribute('data-categoria', proyecto.categoria);
        article.style.animationDelay = `${index * 0.1}s`;
        
        const tecnologiasHTML = proyecto.tecnologias.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        article.innerHTML = `
            <a href="${proyecto.imagen_large}" 
               data-lightbox="proyectos" 
               data-title="<strong>${proyecto.titulo}</strong><br>
                           <em>Estudiante: ${proyecto.estudiante}</em><br>
                           ${proyecto.descripcion}">
                <img src="${proyecto.imagen_thumb}" 
                     alt="${proyecto.titulo}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x250/cccccc/666666?text=Imagen+no+disponible'">
                <div class="proyecto-info">
                    <h3>${proyecto.titulo}</h3>
                    <p class="estudiante">👤 ${proyecto.estudiante}</p>
                    <p class="descripcion">${proyecto.descripcion}</p>
                    <div class="tecnologias">
                        ${tecnologiasHTML}
                    </div>
                </div>
            </a>
        `;
        
        const link = article.querySelector('a');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (typeof lightbox !== 'undefined' && lightbox !== null) {
                const lightboxInstance = lightbox(this);
                lightboxInstance.open();
            } else {
                window.open(this.href, '_blank');
            }
        });
        
        return article;
    }
    
    function mostrarProyectos() {
        if (!proyectosCargados || !galeriaGrid) return;
        
        galeriaGrid.innerHTML = '';
        
        const proyectosFiltrados = categoriaActual === 'todos' 
            ? proyectos 
            : proyectos.filter(p => p.categoria === categoriaActual);
        
        const proyectosAMostrar = proyectosFiltrados.slice(0, proyectosVisibles);
        
        if (proyectosAMostrar.length === 0) {
            galeriaGrid.innerHTML = `
                <div class="no-proyectos">
                    <p>No hay proyectos en esta categoría</p>
                </div>
            `;
            if (btnCargarMas) {
                btnCargarMas.style.display = 'none';
            }
            return;
        }
        
        proyectosAMostrar.forEach((proyecto, index) => {
            galeriaGrid.appendChild(crearElementoProyecto(proyecto, index));
        });
        
        if (btnCargarMas) {
            const mostrarBoton = proyectosVisibles < proyectosFiltrados.length;
            btnCargarMas.style.display = mostrarBoton ? 'block' : 'none';
            
            if (mostrarBoton) {
                const proyectosRestantes = proyectosFiltrados.length - proyectosVisibles;
                btnCargarMas.textContent = `Ver Más (+${proyectosRestantes})`;
                btnCargarMas.disabled = false;
            }
        }
    }
    
    function filtrarGaleria(categoria) {
        categoriaActual = categoria;
        proyectosVisibles = 6;
        
        filtrosBtns.forEach(btn => btn.classList.remove('active'));
        const botonActivo = document.querySelector(`[data-categoria="${categoria}"]`);
        if (botonActivo) {
            botonActivo.classList.add('active');
        }
        
        mostrarProyectos();
    }
    
    function cargarMasProyectos() {
        proyectosVisibles += proyectosPorCarga;
        mostrarProyectos();
    }
    
    function inicializarEventListeners() {
        filtrosBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const categoria = this.getAttribute('data-categoria');
                if (categoria) {
                    filtrarGaleria(categoria);
                }
            });
        });
        
        if (btnCargarMas) {
            btnCargarMas.addEventListener('click', cargarMasProyectos);
        }
    }
    
    if (!galeriaGrid) {
        console.error('❌ No se encontró el elemento #galeria-grid');
        return;
    }
    
    cargarGaleria();
    inicializarEventListeners();
    
    console.log('✅ Galería inicializada correctamente');
});