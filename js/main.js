function cargarNoticias() {
    fetch('js/noticias.json')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('contenedor-noticias');
            contenedor.innerHTML = '';
            
            data.noticias.forEach(noticia => {
                const articulo = document.createElement('article');
                articulo.className = 'noticia';
                articulo.innerHTML = `
                    <h3>${noticia.titulo}</h3>
                    <span class="fecha">${noticia.fecha}</span>
                    <p>${noticia.contenido}</p>
                `;
                contenedor.appendChild(articulo);
            });
        })
        .catch(error => console.error('Error cargando noticias:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    cargarNoticias();
});