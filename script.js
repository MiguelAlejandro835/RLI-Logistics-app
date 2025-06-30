// Variables globales
let charts = {};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Animación de entrada del hero
    setTimeout(function() {
        document.querySelector('.hero').classList.add('hero-animate');
    }, 200);
    initializeHeroParticles();
    initializeApp();
    animateOnScroll();
    addSoundEffects();
    initChatbot();
});

function initializeApp() {
    // Inicializar navegación móvil
    initializeMobileNav();
    
    // Inicializar scroll suave
    initializeSmoothScroll();
    
    // Inicializar formulario de contacto
    initializeContactForm();
    
    // Inicializar charts
    initializeCharts();
    
    // Inicializar animaciones de métricas
    initializeMetricAnimations();
    
    // Inicializar efectos de scroll
    initializeScrollEffects();
}

// Navegación móvil
function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Scroll suave
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Función global para scroll a sección
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Formulario de contacto
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmit();
        });
    }
}

function handleContactFormSubmit() {
    const formData = new FormData(document.getElementById('contactForm'));
    const data = Object.fromEntries(formData);
    
    // Simular envío de formulario
    showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
    
    // Limpiar formulario
    document.getElementById('contactForm').reset();
}

// Lógica para abrir/cerrar el modal de contacto/cotización
function openContactForm() {
    document.getElementById('contactModal').classList.add('active');
}

function closeContactForm() {
    document.getElementById('contactModal').classList.remove('active');
}

// Cerrar modal al hacer click fuera del contenido
window.addEventListener('click', function(e) {
    const modal = document.getElementById('contactModal');
    if (e.target === modal) {
        closeContactForm();
    }
});

// Opcional: Mensaje de éxito al enviar el formulario
const modalForm = document.getElementById('modalContactForm');
if (modalForm) {
    modalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias! Tu solicitud ha sido enviada.');
        closeContactForm();
        modalForm.reset();
        launchConfetti();
    });
}

// Inicializar gráficos
function initializeCharts() {
    // Gráfico de envíos
    const shipmentsCtx = document.getElementById('shipmentsChart');
    if (shipmentsCtx) {
        charts.shipments = new Chart(shipmentsCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Envíos Mensuales',
                    data: [1200, 1350, 1420, 1580, 1650, 1800],
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de incidencias anuales
    const incidentsCtx = document.getElementById('incidentsChart');
    if (incidentsCtx) {
        charts.incidents = new Chart(incidentsCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Incidencias',
                    data: [5, 8, 6, 12, 7, 9, 4, 10, 6, 8, 5, 7],
                    backgroundColor: '#4caf50',
                    borderRadius: 6,
                    maxBarThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Animaciones de métricas
function initializeMetricAnimations() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateMetric(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar métricas
    document.querySelectorAll('.metric-value').forEach(metric => {
        observer.observe(metric);
    });
}

function animateMetric(element) {
    const finalValue = element.textContent;
    const isPercentage = finalValue.includes('%');
    const isTime = finalValue.includes('h');
    const isRating = finalValue.includes('/');
    
    let startValue = 0;
    let endValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
    
    if (isPercentage) {
        startValue = 0;
    } else if (isTime) {
        startValue = 0;
    } else if (isRating) {
        startValue = 0;
    } else {
        startValue = 0;
    }
    
    const duration = 2000;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Función de easing
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        if (isPercentage) {
            element.textContent = currentValue.toFixed(1) + '%';
        } else if (isTime) {
            element.textContent = currentValue.toFixed(1) + 'h';
        } else if (isRating) {
            element.textContent = currentValue.toFixed(1) + '/5';
        } else {
            element.textContent = Math.round(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Efectos de scroll
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.service-card, .metric-card, .chart-container').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos de notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#059669',
        error: '#dc2626',
        warning: '#d97706',
        info: '#2563eb'
    };
    return colors[type] || colors.info;
}

// Simulación de datos en tiempo real
function updateMetrics() {
    // Simular actualización de métricas
    const metrics = {
        activeShipments: Math.floor(Math.random() * 50) + 200,
        routeEfficiency: (Math.random() * 5 + 90).toFixed(1),
        avgTime: (Math.random() * 2 + 1.5).toFixed(1),
        customerSatisfaction: (Math.random() * 0.5 + 4.5).toFixed(1)
    };
    
    // Actualizar valores
    Object.keys(metrics).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            const currentValue = element.textContent;
            const newValue = metrics[key];
            
            if (key === 'routeEfficiency') {
                element.textContent = newValue + '%';
            } else if (key === 'avgTime') {
                element.textContent = newValue + 'h';
            } else if (key === 'customerSatisfaction') {
                element.textContent = newValue + '/5';
            } else {
                element.textContent = newValue;
            }
        }
    });
}

// Actualizar métricas cada 30 segundos
setInterval(updateMetrics, 30000);

// Efectos de hover para tarjetas
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de hover para service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efecto de hover para metric cards
    document.querySelectorAll('.metric-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Animación de carga de página
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Función para abrir modal de consultoría
function openConsultingModal() {
    showNotification('¡Gracias por tu interés! Un consultor se pondrá en contacto contigo en las próximas 24 horas.', 'success');
}

// Función para descargar reporte
function downloadReport() {
    showNotification('Descargando reporte...', 'info');
    // Aquí se implementaría la lógica real de descarga
    setTimeout(() => {
        showNotification('Reporte descargado exitosamente', 'success');
    }, 2000);
}

// Función para exportar datos
function exportData() {
    showNotification('Exportando datos...', 'info');
    // Aquí se implementaría la lógica real de exportación
    setTimeout(() => {
        showNotification('Datos exportados exitosamente', 'success');
    }, 1500);
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
});

// Función para validar formulario
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc2626';
            isValid = false;
        } else {
            input.style.borderColor = '#e5e7eb';
        }
    });
    
    return isValid;
}

// Función para limpiar formulario
function clearForm(formElement) {
    formElement.reset();
    formElement.querySelectorAll('input, select, textarea').forEach(element => {
        element.style.borderColor = '#e5e7eb';
    });
}

// Función para mostrar/ocultar contraseña
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Función para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Texto copiado al portapapeles', 'success');
    }).catch(() => {
        showNotification('Error al copiar texto', 'error');
    });
}

// Función para compartir en redes sociales
function shareOnSocial(platform, url, text) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Función para imprimir página
function printPage() {
    window.print();
}

// Función para cambiar tema (claro/oscuro)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Cargar tema guardado
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Inicializar tema al cargar
loadSavedTheme();

// Partículas sutiles en el fondo del hero
function initializeHeroParticles() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 70;
    const colors = ['#b6e2c1', '#4caf50', '#2e5d3a', '#fff'];
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 1.5 + Math.random() * 2.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.15 + Math.random() * 0.25,
                dx: (Math.random() - 0.5) * 0.25,
                dy: (Math.random() - 0.5) * 0.25,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            p.x += p.dx;
            p.y += p.dy;
            p.twinkle += 0.04 + Math.random() * 0.02;
            let twinkleAlpha = p.alpha + Math.sin(p.twinkle) * 0.12;
            ctx.globalAlpha = Math.max(0, twinkleAlpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
            // Rebote en bordes
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    resize();
    createParticles();
    animate();
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    const confettiColors = ['#4caf50', '#b6e2c1', '#fff', '#2e5d3a', '#ffe082'];
    const confetti = [];
    const CONFETTI_COUNT = 120;
    for (let i = 0; i < CONFETTI_COUNT; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: 6 + Math.random() * 8,
            d: Math.random() * 0.8 + 0.4,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngle: 0,
            tiltAngleInc: Math.random() * 0.07 + 0.02
        });
    }
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let c of confetti) {
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, c.r, c.r * 0.4, c.tilt, 0, 2 * Math.PI);
            ctx.fillStyle = c.color;
            ctx.globalAlpha = 0.85;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    function update() {
        for (let c of confetti) {
            c.y += c.d * 6;
            c.x += Math.sin(frame / 10 + c.tilt) * 2;
            c.tiltAngle += c.tiltAngleInc;
            c.tilt = Math.sin(c.tiltAngle) * 10;
            if (c.y > canvas.height + 20) {
                c.y = -10;
                c.x = Math.random() * canvas.width;
            }
        }
        frame++;
    }
    let duration = 0;
    function animate() {
        draw();
        update();
        duration++;
        if (duration < 90) {
            requestAnimationFrame(animate);
        } else {
            canvas.style.display = 'none';
        }
    }
    animate();
}

// Animaciones de scroll
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const animatedElements = document.querySelectorAll('.service-card, .consulting-step, .consulting-benefit, .dashboard-card, .chart-container, .cta-section');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Sistema de efectos de sonido
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.volume = 0.3; // Volumen bajo para ser sutil
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio no pudo reproducirse:', e));
    }
}

// Función para crear sonidos sintéticos
function createSyntheticSound(frequency, duration, type = 'sine') {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Efectos de sonido para diferentes interacciones
function playHoverSound() {
    createSyntheticSound(800, 0.1, 'sine');
}

function playClickSound() {
    createSyntheticSound(600, 0.15, 'square');
}

function playSuccessSound() {
    createSyntheticSound(1000, 0.2, 'sine');
    setTimeout(() => createSyntheticSound(1200, 0.2, 'sine'), 100);
}

// Agregar eventos de sonido a elementos interactivos
function addSoundEffects() {
    // Sonido en hover para tarjetas
    const interactiveElements = document.querySelectorAll('.service-card, .consulting-step, .consulting-benefit, .dashboard-card, button, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', playHoverSound);
        element.addEventListener('click', playClickSound);
    });
    
    // Sonido especial para envío de formulario
    const contactForm = document.getElementById('modalContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            setTimeout(() => {
                playSuccessSound();
                launchConfetti();
            }, 100);
        });
    }
    
    // Sonido para botones de navegación
    const navButtons = document.querySelectorAll('.nav-link, .cta-button');
    navButtons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });
}

// Chatbot flotante básico
function initChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const windowEl = document.getElementById('chatbot-window');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');

    if (!toggleBtn || !windowEl || !form || !input || !messages) return;

    // Abrir/cerrar chatbot
    toggleBtn.addEventListener('click', () => {
        windowEl.style.display = windowEl.style.display === 'none' ? 'flex' : 'none';
        if (windowEl.style.display === 'flex') {
            // Limpiar mensajes y sugerencias previos
            messages.innerHTML = '';
            const prevSug = document.getElementById('chatbot-suggestions');
            if (prevSug) prevSug.remove();
            input.focus();
            addMessage('¡Hola! Soy el asistente virtual de RLI. ¿En qué puedo ayudarte hoy?', 'bot');
            showSuggestions();
            messages.scrollTop = 0;
        }
    });

    // Botón de cerrar (X)
    const closeBtn = document.getElementById('chatbot-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            windowEl.style.display = 'none';
        });
    }

    // Preguntas frecuentes y respuestas
    const faqs = [
        { q: /horario|atención/i, a: 'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.' },
        { q: /contact(o|ar)/i, a: 'Puedes contactarnos desde el formulario o al correo: contacto@rli.com' },
        { q: /servici[oa]s?/i, a: 'Ofrecemos consultoría logística, monitoreo de unidades y optimización de rutas.' },
        { q: /cotizaci[óo]n|precio|costo/i, a: 'Solicita tu diagnóstico gratuito y te enviaremos una cotización personalizada.' },
        { q: /dónde|ubicaci[óo]n/i, a: 'Estamos en CDMX, pero brindamos servicio en toda la República Mexicana.' },
        { q: /dashboard|métricas|monitoreo/i, a: 'Nuestro dashboard te permite monitorear unidades, incidencias y licencias en tiempo real.' },
        { q: /gracias|thank/i, a: '¡Con gusto! ¿Hay algo más en lo que te pueda ayudar?' },
        // Nuevas preguntas y respuestas
        { q: /qu[ée] es rli|quiénes son/i, a: 'RLI es una empresa mexicana especializada en soluciones logísticas inteligentes para empresas de todos los tamaños.' },
        { q: /cómo funciona/i, a: 'Analizamos tus procesos logísticos, proponemos mejoras y te acompañamos en la implementación y monitoreo.' },
        { q: /beneficios|ventajas/i, a: 'Al trabajar con RLI obtienes reducción de costos, mayor visibilidad, entregas puntuales y soporte personalizado.' },
        { q: /soporte|ayuda/i, a: 'Puedes solicitar soporte técnico o ayuda desde este chat o escribiendo a soporte@rli.com.' },
        { q: /whatsapp|asesor/i, a: '¡Claro! Puedes hablar con un asesor directamente en WhatsApp haciendo clic en el botón verde de la esquina inferior derecha.' },
        { q: /facturaci[óo]n|factura/i, a: 'Para temas de facturación, por favor envía tus datos fiscales a facturacion@rli.com y te atenderemos a la brevedad.' },
        { q: /integraci[óo]n|api/i, a: 'Contamos con APIs y opciones de integración para conectar RLI con tus sistemas actuales.' },
        { q: /seguridad|datos/i, a: 'Tus datos están protegidos con altos estándares de seguridad y privacidad.' },
        { q: /cancelar|baja/i, a: 'Para cancelar tu servicio, por favor envía un correo a soporte@rli.com o contáctanos por WhatsApp. Un asesor te guiará en el proceso de baja y resolverá cualquier duda que tengas.' },
    ];

    function addMessage(text, from = 'user') {
        const msg = document.createElement('div');
        msg.style.margin = '8px 0';
        msg.style.textAlign = from === 'user' ? 'right' : 'left';
        msg.innerHTML = `<span style="display:inline-block;padding:8px 14px;border-radius:16px;max-width:80%;background:${from==='user'?'#e8f5e9':'#f1f1f1'};color:#222;font-size:1rem;">${text}</span>`;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function botReply(userText) {
        let found = false;
        for (const faq of faqs) {
            if (faq.q.test(userText)) {
                setTimeout(() => {
                    addMessage(faq.a, 'bot');
                    showSuggestions();
                }, 600);
                found = true;
                break;
            }
        }
        if (!found) {
            setTimeout(() => {
                addMessage('Lo siento, no tengo la respuesta a esa pregunta. ¿Quieres que te contacte un asesor?', 'bot');
                showSuggestions();
            }, 600);
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const userText = input.value.trim();
        if (!userText) return;
        addMessage(userText, 'user');
        input.value = '';
        botReply(userText);
    });

    // Agregar botón de sugerencias
    const suggestionBtn = document.createElement('button');
    suggestionBtn.textContent = '¿Qué puedo preguntar?';
    suggestionBtn.style.background = '#e8f5e9';
    suggestionBtn.style.color = '#222';
    suggestionBtn.style.border = 'none';
    suggestionBtn.style.borderRadius = '12px';
    suggestionBtn.style.padding = '6px 14px';
    suggestionBtn.style.margin = '10px auto 0 auto';
    suggestionBtn.style.display = 'block';
    suggestionBtn.style.cursor = 'pointer';
    suggestionBtn.style.fontSize = '1rem';
    suggestionBtn.style.boxShadow = '0 2px 8px rgba(76,175,80,0.08)';
    
    windowEl.insertBefore(suggestionBtn, messages);

    // Sugerencias de preguntas como botones
    function showSuggestions() {
        // Elimina sugerencias previas si existen
        const prev = document.getElementById('chatbot-suggestions');
        if (prev) prev.remove();
        const sugDiv = document.createElement('div');
        sugDiv.id = 'chatbot-suggestions';
        sugDiv.style.display = 'flex';
        sugDiv.style.flexWrap = 'wrap';
        sugDiv.style.gap = '8px';
        sugDiv.style.margin = '10px 0 0 0';
        const suggestions = [
            '¿Qué es RLI?',
            '¿Cuáles son los beneficios?',
            '¿Cómo solicito una cotización?',
            '¿Dónde están ubicados?',
            '¿Cómo funciona el dashboard?',
            '¿Puedo hablar con un asesor?',
            '¿Tienen integración con otros sistemas?',
            '¿Cómo solicito soporte?',
            '¿Cómo cancelo mi servicio?',
            '¿Qué horario tienen?'
        ];
        suggestions.forEach(s => {
            const btn = document.createElement('button');
            btn.textContent = s;
            btn.style.background = '#4caf50';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '16px';
            btn.style.padding = '6px 14px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '0.98rem';
            btn.addEventListener('click', function() {
                addMessage(s, 'user');
                botReply(s);
                sugDiv.remove();
            });
            sugDiv.appendChild(btn);
        });
        messages.appendChild(sugDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    suggestionBtn.addEventListener('click', showSuggestions);
} 