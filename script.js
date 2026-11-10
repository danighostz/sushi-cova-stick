/* ============================================================
   SUSHI STICK · script.js
   Lightbox + navbar activa + scroll suave + animaciones
   + botón hamburguesa para móviles
   Versión corregida y completa
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ==========================================================
       1. LIGHTBOX — funcional, accesible y sin bloquear scroll
    ========================================================== */
    const lightbox = document.getElementById('lightbox');
    const imgLightbox = document.getElementById('imgLightbox');
    const cerrarLightbox = document.getElementById('cerrarLightbox');

    if (lightbox && imgLightbox && cerrarLightbox) {

        function abrirLightbox(src, alt) {
            if (!src) return;

            imgLightbox.src = src;
            imgLightbox.alt = alt || 'Imagen ampliada';

            lightbox.classList.add('activo');
            lightbox.setAttribute('aria-hidden', 'false');

            document.body.classList.add('lightbox-abierto');
            document.body.style.overflow = 'hidden';

            cerrarLightbox.focus();
        }

        function cerrarLightboxFunc() {
            lightbox.classList.remove('activo');
            lightbox.setAttribute('aria-hidden', 'true');
            imgLightbox.src = '';
            imgLightbox.alt = '';

            document.body.classList.remove('lightbox-abierto');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('figure[data-src]').forEach(function (figura) {
            figura.setAttribute('tabindex', '0');
            figura.setAttribute('role', 'button');
            figura.style.cursor = 'zoom-in';

            const img = figura.querySelector('img');
            const altTexto = img ? img.alt : '';

            figura.addEventListener('click', function () {
                abrirLightbox(figura.getAttribute('data-src'), altTexto);
            });

            figura.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    abrirLightbox(figura.getAttribute('data-src'), altTexto);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function (img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function () {
                abrirLightbox(img.getAttribute('data-src'), img.alt);
            });
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    abrirLightbox(img.getAttribute('data-src'), img.alt);
                }
            });
        });

        cerrarLightbox.addEventListener('click', function (e) {
            e.stopPropagation();
            cerrarLightboxFunc();
        });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                cerrarLightboxFunc();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('activo')) {
                cerrarLightboxFunc();
            }
        });
    }


    /* ==========================================================
       2. BOTÓN HAMBURGUESA — MENÚ MÓVIL
    ========================================================== */
    const navToggle = document.getElementById('navToggle');
    const navLinksList = document.getElementById('navLinks');

    if (navToggle && navLinksList) {

        function abrirMenu() {
            navToggle.classList.add('activo');
            navLinksList.classList.add('activo');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Cerrar menú');
        }

        function cerrarMenu() {
            navToggle.classList.remove('activo');
            navLinksList.classList.remove('activo');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
        }

        function toggleMenu() {
            if (navLinksList.classList.contains('activo')) {
                cerrarMenu();
            } else {
                abrirMenu();
            }
        }

        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });

        /* Cerrar menú al hacer clic en un enlace */
        navLinksList.querySelectorAll('a').forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                cerrarMenu();
            });
        });

        /* Cerrar menú al hacer clic fuera */
        document.addEventListener('click', function (e) {
            if (
                navLinksList.classList.contains('activo') &&
                !navLinksList.contains(e.target) &&
                !navToggle.contains(e.target)
            ) {
                cerrarMenu();
            }
        });

        /* Cerrar menú con tecla Escape */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinksList.classList.contains('activo')) {
                cerrarMenu();
            }
        });

        /* Cerrar menú si se cambia de orientación (móvil horizontal/vertical) */
        window.addEventListener('resize', function () {
            if (window.innerWidth > 1024) {
                cerrarMenu();
            }
        });
    }


    /* ==========================================================
       3. SCROLL SUAVE CON OFFSET POR NAVBAR FIJA
    ========================================================== */
    const navbar = document.getElementById('navbar');

    document.querySelectorAll('a[href^="#"]').forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
            const destinoId = this.getAttribute('href');
            if (destinoId === '#' || destinoId.length < 2) return;

            const destino = document.querySelector(destinoId);
            if (!destino) return;

            e.preventDefault();

            const alturaNavbar = navbar ? navbar.offsetHeight : 0;
            const posicion =
                destino.getBoundingClientRect().top +
                window.pageYOffset -
                alturaNavbar -
                10;

            window.scrollTo({
                top: posicion,
                behavior: 'smooth'
            });
        });
    });


    /* ==========================================================
       4. NAVBAR CON CLASE "scrolled" AL HACER SCROLL
    ========================================================== */
    if (navbar) {
        function actualizarNavbar() {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', actualizarNavbar, { passive: true });
        actualizarNavbar();
    }


    /* ==========================================================
       5. RESALTAR LINK ACTIVO SEGÚN LA SECCIÓN VISIBLE
    ========================================================== */
    const seccionesConId = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if ('IntersectionObserver' in window && seccionesConId.length > 0 && navLinks.length > 0) {
        const observerNav = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === '#' + entry.target.id);
                    });
                }
            });
        }, {
            rootMargin: '-45% 0px -50% 0px'
        });

        seccionesConId.forEach(function (sec) {
            observerNav.observe(sec);
        });
    }


    /* ==========================================================
       6. ANIMACIÓN DE APARICIÓN AL HACER SCROLL
    ========================================================== */
    const seccionesAnimadas = document.querySelectorAll(
        '.seccion, .seccion-ubicacion, .punto-venta, .banner-final'
    );

    if ('IntersectionObserver' in window && seccionesAnimadas.length > 0) {
        const observerAnim = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observerAnim.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        seccionesAnimadas.forEach(function (sec) {
            sec.classList.add('animar-scroll');
            observerAnim.observe(sec);
        });
    }


    /* ==========================================================
       7. MANEJO DE ERRORES DE IMÁGENES
    ========================================================== */
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
            this.style.opacity = '0.3';
            const contenedor = this.closest('figure');
            if (contenedor) {
                contenedor.style.background = 'rgba(212, 163, 115, 0.06)';
            }
        });
    });

});