/* ========================================
   INFORMATION ABOUT SLIDER FUNCTIONALITY
   Slider rotativo arrastrable con botones de navegación
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.getElementById('sliderTrackInfo');
    const prevBtn = document.getElementById('prevInfoBtn');
    const nextBtn = document.getElementById('nextInfoBtn');
    const indicatorsContainer = document.getElementById('sliderIndicators');
    const cards = document.querySelectorAll('.info-card');
    
    if (!sliderTrack || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    
    // Calcular el número de tarjetas visibles según el tamaño de pantalla
    function getCardsPerView() {
        const width = window.innerWidth;
        if (width >= 1600) return 3; // Pantallas muy grandes: 3 tarjetas
        if (width >= 768) return 2;  // Tablet y desktop: 2 tarjetas
        return 1; // Móvil: 1 tarjeta
    }
    
    const totalCards = cards.length;
    
    // Crear indicadores
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        const maxIndex = totalCards - getCardsPerView();
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }
    }
    
    // Actualizar indicadores
    function updateIndicators() {
        const dots = indicatorsContainer.querySelectorAll('.indicator-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Ir a un slide específico
    function goToSlide(index) {
        const cardsPerView = getCardsPerView();
        const maxIndex = totalCards - cardsPerView;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
    }
    
    // Actualizar posición del slider
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // 2rem gap
        const offset = currentIndex * (cardWidth + gap);
        
        currentTranslate = -offset;
        prevTranslate = currentTranslate;
        
        sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
        updateIndicators();
        updateButtons();
    }
    
    // Actualizar estado de botones
    function updateButtons() {
        const cardsPerView = getCardsPerView();
        const maxIndex = totalCards - cardsPerView;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }
    
    // Navegación con botones
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const cardsPerView = getCardsPerView();
        const maxIndex = totalCards - cardsPerView;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // === DRAG FUNCTIONALITY ===
    
    function touchStart(index) {
        return function(event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            sliderTrack.classList.add('grabbing');
        }
    }
    
    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }
    
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        sliderTrack.classList.remove('grabbing');
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Si se movió más de 100px, cambiar de slide
        if (movedBy < -100 && currentIndex < totalCards - getCardsPerView()) {
            currentIndex++;
        }
        
        if (movedBy > 100 && currentIndex > 0) {
            currentIndex--;
        }
        
        updateSlider();
    }
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function animation() {
        if (isDragging) {
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }
    
    // Event listeners para drag
    sliderTrack.addEventListener('mousedown', touchStart(0));
    sliderTrack.addEventListener('touchstart', touchStart(0));
    
    sliderTrack.addEventListener('mousemove', touchMove);
    sliderTrack.addEventListener('touchmove', touchMove);
    
    sliderTrack.addEventListener('mouseup', touchEnd);
    sliderTrack.addEventListener('mouseleave', touchEnd);
    sliderTrack.addEventListener('touchend', touchEnd);
    
    // Prevenir comportamiento por defecto de arrastre de imágenes
    sliderTrack.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    // Responsive: actualizar al cambiar tamaño de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createIndicators();
            updateSlider();
        }, 250);
    });
    
    // Inicializar
    createIndicators();
    updateButtons();
});
