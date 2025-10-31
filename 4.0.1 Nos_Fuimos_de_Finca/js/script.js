// Slider Functionality
class FincaSlider {
    constructor() {
        this.sliderTrack = document.getElementById('sliderTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.cards = document.querySelectorAll('.card');
        this.cardInfo = document.getElementById('cardInfo');
        this.overlay = document.getElementById('overlay');
        this.closeBtn = document.getElementById('closeBtn');
        this.cardTitle = document.getElementById('cardTitle');
        this.cardDesc = document.getElementById('cardDesc');
        
        this.currentIndex = 0;
        this.cardWidth = 300; // Base card width
        this.gap = 16; // Gap between cards
        this.visibleCards = this.getVisibleCards();
        
        this.init();
    }
    
    init() {
        this.updateSliderView();
        this.bindEvents();
        this.handleResize();
    }
    
    getVisibleCards() {
        const containerWidth = window.innerWidth;
        if (containerWidth >= 1200) return 4;
        if (containerWidth >= 768) return 3;
        if (containerWidth >= 480) return 2;
        return 1;
    }
    
    updateSliderView() {
        const translateX = -(this.currentIndex * (this.cardWidth + this.gap));
        this.sliderTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = 
            this.currentIndex >= this.cards.length - this.visibleCards ? '0.5' : '1';
    }
    
    next() {
        if (this.currentIndex < this.cards.length - this.visibleCards) {
            this.currentIndex++;
            this.updateSliderView();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSliderView();
        }
    }
    
    showCardInfo(card) {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        
        this.cardTitle.textContent = title;
        this.cardDesc.textContent = desc;
        
        this.overlay.classList.add('active');
        this.cardInfo.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    hideCardInfo() {
        this.overlay.classList.remove('active');
        this.cardInfo.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.visibleCards = this.getVisibleCards();
            
            // Update card width based on container
            const container = document.querySelector('.slider-container');
            const containerWidth = container.offsetWidth;
            this.cardWidth = (containerWidth - (this.gap * (this.visibleCards - 1))) / this.visibleCards - this.gap;
            
            // Reset position if necessary
            if (this.currentIndex >= this.cards.length - this.visibleCards) {
                this.currentIndex = Math.max(0, this.cards.length - this.visibleCards);
            }
            
            this.updateSliderView();
        });
    }
    
    bindEvents() {
        // Navigation buttons
        this.nextBtn.addEventListener('click', () => this.next());
        this.prevBtn.addEventListener('click', () => this.prev());
        
        // Card click events
        this.cards.forEach(card => {
            card.addEventListener('click', () => this.showCardInfo(card));
        });
        
        // Close modal events
        this.closeBtn.addEventListener('click', () => this.hideCardInfo());
        this.overlay.addEventListener('click', () => this.hideCardInfo());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCardInfo();
            } else if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        this.sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.sliderTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.next(); // Swipe left - next
                } else {
                    this.prev(); // Swipe right - previous
                }
            }
        });
    }
}

// Header Dropdowns Functionality
class HeaderDropdowns {
    constructor() {
        this.languageBtn = document.getElementById('languageBtn');
        this.languageMenu = document.getElementById('languageMenu');
        this.userMenuBtn = document.getElementById('userMenuBtn');
        this.userMenuDropdown = document.getElementById('userMenuDropdown');
        this.currentLang = document.getElementById('currentLang');
        
        this.translations = {
            es: {
                login: 'Iniciar Sesión',
                register: 'Registrarse',
                help: 'Ayuda',
                contact: 'Contacto',
                searchPlaceholder: '¿En que lugar te gustaria la finca?',
                searchButton: 'Buscar',
                guestsText: 'Huéspedes',
                roomText: 'Habitación',
                roomsText: 'Habitaciones'
            },
            en: {
                login: 'Login',
                register: 'Sign Up',
                help: 'Help',
                contact: 'Contact',
                searchPlaceholder: 'Where would you like your farm?',
                searchButton: 'Search',
                guestsText: 'Guests',
                roomText: 'Room',
                roomsText: 'Rooms'
            }
        };
        
        this.currentLanguage = 'es';
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateLanguageDisplay();
    }
    
    bindEvents() {
        // Language selector
        this.languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(this.languageBtn, this.languageMenu);
            this.closeDropdown(this.userMenuBtn, this.userMenuDropdown);
        });
        
        // User menu
        this.userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(this.userMenuBtn, this.userMenuDropdown);
            this.closeDropdown(this.languageBtn, this.languageMenu);
        });
        
        // Language selection
        this.languageMenu.addEventListener('click', (e) => {
            const languageItem = e.target.closest('.dropdown-item');
            if (languageItem) {
                const selectedLang = languageItem.getAttribute('data-lang');
                this.changeLanguage(selectedLang);
                this.closeDropdown(this.languageBtn, this.languageMenu);
            }
        });
        
        // User menu actions
        this.userMenuDropdown.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.dropdown-item');
            if (menuItem) {
                const action = menuItem.getAttribute('data-action');
                
                // If it's a link (anchor tag), let the default behavior happen
                if (menuItem.tagName === 'A' && (action === 'login' || action === 'register')) {
                    // Close dropdown and let the link navigate
                    this.closeDropdown(this.userMenuBtn, this.userMenuDropdown);
                    return; // Don't prevent default, let the link work
                }
                
                // For other actions (help, contact), use the custom handler
                this.handleUserAction(action);
                this.closeDropdown(this.userMenuBtn, this.userMenuDropdown);
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeDropdown(this.languageBtn, this.languageMenu);
            this.closeDropdown(this.userMenuBtn, this.userMenuDropdown);
        });
        
        // Close dropdowns on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown(this.languageBtn, this.languageMenu);
                this.closeDropdown(this.userMenuBtn, this.userMenuDropdown);
            }
        });
    }
    
    toggleDropdown(button, menu) {
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        
        if (isOpen) {
            this.closeDropdown(button, menu);
        } else {
            this.openDropdown(button, menu);
        }
    }
    
    openDropdown(button, menu) {
        button.setAttribute('aria-expanded', 'true');
        menu.classList.add('active');
    }
    
    closeDropdown(button, menu) {
        button.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
    }
    
    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.updateLanguageDisplay();
        this.updatePageTexts();
        
        // Save language preference
        localStorage.setItem('preferredLanguage', lang);
        
        console.log(`Language changed to: ${lang}`);
    }
    
    updateLanguageDisplay() {
        this.currentLang.textContent = this.currentLanguage.toUpperCase();
    }
    
    updatePageTexts() {
        const texts = this.translations[this.currentLanguage];
        
        // Update user menu texts
        const loginItem = this.userMenuDropdown.querySelector('[data-action="login"] span');
        const registerItem = this.userMenuDropdown.querySelector('[data-action="register"] span');
        const helpItem = this.userMenuDropdown.querySelector('[data-action="help"] span');
        const contactItem = this.userMenuDropdown.querySelector('[data-action="contact"] span');
        
        if (loginItem) loginItem.textContent = texts.login;
        if (registerItem) registerItem.textContent = texts.register;
        if (helpItem) helpItem.textContent = texts.help;
        if (contactItem) contactItem.textContent = texts.contact;
        
        // Update search bar texts
        const locationInput = document.querySelector('.location');
        const searchBtn = document.querySelector('.search-btn');
        
        if (locationInput) {
            locationInput.placeholder = texts.searchPlaceholder;
        }
        
        if (searchBtn) {
            searchBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> ${texts.searchButton}`;
        }
        
        // Update guest button text if search bar is initialized
        if (window.searchBarInstance) {
            window.searchBarInstance.updateGuestButton();
        }
    }
    
    handleUserAction(action) {
        switch (action) {
            case 'login':
                // Now handled by direct link to log_in.html
                console.log('Redirecting to login page...');
                break;
            case 'register':
                // Now handled by direct link to register.html
                console.log('Redirecting to register page...');
                break;
            case 'help':
                this.scrollToSection('ayuda-section');
                break;
            case 'contact':
                this.scrollToSection('contacto-section');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }
    
    // Smooth scroll to footer sections
    scrollToSection(sectionId) {
        // Small delay to allow dropdown to close
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Add a highlight effect
                this.highlightSection(section);
            }
        }, 300);
    }
    
    // Highlight the section briefly to draw attention
    highlightSection(section) {
        // Add highlight class
        section.classList.add('section-highlight');
        
        // Remove highlight after animation
        setTimeout(() => {
            section.classList.remove('section-highlight');
        }, 2000);
        
        // Optional: console log for debugging
        console.log(`Navegando a la sección: ${section.id}`);
    }
}

// Search Bar Functionality (Updated with Calendars)
class SearchBar {
    constructor() {
        this.locationInput = document.querySelector('.location');
        this.locationField = document.querySelector('.location-field');
        this.dropdown = document.getElementById('dropdown');
        this.options = document.querySelectorAll('.option');
        this.guestBtn = document.getElementById('guestBtn');
        this.guestField = document.querySelector('.guest-field');
        this.guestDropdown = document.getElementById('guestDropdown');
        this.counterBtns = document.querySelectorAll('.counter-btn');
        this.searchBtn = document.querySelector('.search-btn');
        this.travelWithPets = document.getElementById('travelWithPets');
        
        // Calendar elements
        this.checkinField = document.querySelector('.checkin-field');
        this.checkoutField = document.querySelector('.checkout-field');
        this.checkinDisplay = document.getElementById('checkinDisplay');
        this.checkoutDisplay = document.getElementById('checkoutDisplay');
        this.checkinCalendar = document.getElementById('checkinCalendar');
        this.checkoutCalendar = document.getElementById('checkoutCalendar');
        this.checkinInput = document.getElementById('checkinDate');
        this.checkoutInput = document.getElementById('checkoutDate');
        
        this.guestCounts = {
            adults: 2,
            children: 0
        };
        
        this.selectedDates = {
            checkin: null,
            checkout: null
        };
        
        this.currentMonth = {
            checkin: new Date(),
            checkout: new Date()
        };
        
        this.init();
        
        // Make this instance globally available for language updates
        window.searchBarInstance = this;
    }
    
    init() {
        this.bindEvents();
        this.updateGuestButton();
        this.setupFieldInteractions();
        this.initializeCalendars();
    }
    
    initializeCalendars() {
        this.renderCalendar('checkin');
        this.renderCalendar('checkout');
    }
    
    renderCalendar(type) {
        const calendar = type === 'checkin' ? this.checkinCalendar : this.checkoutCalendar;
        const monthElement = calendar.querySelector('.calendar-month');
        const daysContainer = calendar.querySelector('.calendar-days');
        const currentDate = this.currentMonth[type];
        
        // Clear previous days
        daysContainer.innerHTML = '';
        
        // Set month title
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        monthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Generate calendar days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();
            
            // Check if date is in current month
            if (date.getMonth() !== currentDate.getMonth()) {
                dayElement.classList.add('disabled');
            }
            
            // Check if date is in the past
            if (date < today) {
                dayElement.classList.add('disabled');
            }
            
            // Check if date is today
            if (date.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }
            
            // Check if date is selected
            const selectedDate = this.selectedDates[type];
            if (selectedDate && date.getTime() === selectedDate.getTime()) {
                dayElement.classList.add('selected');
            }
            
            // Check if date is in range (for checkout calendar)
            if (type === 'checkout' && this.selectedDates.checkin && this.selectedDates.checkout) {
                if (date > this.selectedDates.checkin && date < this.selectedDates.checkout) {
                    dayElement.classList.add('in-range');
                }
                if (date.getTime() === this.selectedDates.checkin.getTime()) {
                    dayElement.classList.add('range-start');
                }
                if (date.getTime() === this.selectedDates.checkout.getTime()) {
                    dayElement.classList.add('range-end');
                }
            }
            
            // Add click event
            if (!dayElement.classList.contains('disabled')) {
                dayElement.addEventListener('click', () => {
                    this.selectDate(type, date);
                });
            }
            
            daysContainer.appendChild(dayElement);
        }
    }
    
    selectDate(type, date) {
        this.selectedDates[type] = date;
        
        // Format date for display
        const options = { day: 'numeric', month: 'short' };
        const formattedDate = date.toLocaleDateString('es-ES', options);
        
        // Update display
        if (type === 'checkin') {
            this.checkinDisplay.textContent = formattedDate;
            this.checkinInput.value = date.toISOString().split('T')[0];
            this.checkinCalendar.classList.remove('active');
            this.checkinField.classList.remove('active');
            
            // If checkout is before checkin, clear it
            if (this.selectedDates.checkout && this.selectedDates.checkout <= date) {
                this.selectedDates.checkout = null;
                this.checkoutDisplay.textContent = 'Agregar fecha';
                this.checkoutInput.value = '';
            }
        } else {
            // Ensure checkout is after checkin
            if (this.selectedDates.checkin && date <= this.selectedDates.checkin) {
                return;
            }
            
            this.checkoutDisplay.textContent = formattedDate;
            this.checkoutInput.value = date.toISOString().split('T')[0];
            this.checkoutCalendar.classList.remove('active');
            this.checkoutField.classList.remove('active');
        }
        
        // Re-render both calendars to update visual states
        this.renderCalendar('checkin');
        this.renderCalendar('checkout');
    }
    
    setupFieldInteractions() {
        // Add click handlers for all search fields
        const searchFields = document.querySelectorAll('.search-field');
        
        searchFields.forEach(field => {
            field.addEventListener('click', (e) => {
                // Remove active class from all fields
                searchFields.forEach(f => f.classList.remove('active'));
                
                // Close all dropdowns
                this.dropdown.classList.remove('active');
                this.guestDropdown.classList.remove('active');
                this.checkinCalendar.classList.remove('active');
                this.checkoutCalendar.classList.remove('active');
                
                // Add active class to clicked field
                field.classList.add('active');
                
                // Handle specific field interactions
                if (field.classList.contains('location-field')) {
                    this.locationInput.focus();
                    this.dropdown.classList.add('active');
                } else if (field.classList.contains('guest-field')) {
                    this.guestDropdown.classList.add('active');
                } else if (field.classList.contains('checkin-field')) {
                    this.checkinCalendar.classList.add('active');
                } else if (field.classList.contains('checkout-field')) {
                    this.checkoutCalendar.classList.add('active');
                }
            });
        });
        
        // Close active states when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-field') && 
                !e.target.closest('.dropdown') && 
                !e.target.closest('.guest-dropdown') && 
                !e.target.closest('.calendar-dropdown')) {
                searchFields.forEach(f => f.classList.remove('active'));
                this.dropdown.classList.remove('active');
                this.guestDropdown.classList.remove('active');
                this.checkinCalendar.classList.remove('active');
                this.checkoutCalendar.classList.remove('active');
            }
        });
        
        // Calendar navigation
        document.getElementById('checkinPrev').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth.checkin.setMonth(this.currentMonth.checkin.getMonth() - 1);
            this.renderCalendar('checkin');
        });
        
        document.getElementById('checkinNext').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth.checkin.setMonth(this.currentMonth.checkin.getMonth() + 1);
            this.renderCalendar('checkin');
        });
        
        document.getElementById('checkoutPrev').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth.checkout.setMonth(this.currentMonth.checkout.getMonth() - 1);
            this.renderCalendar('checkout');
        });
        
        document.getElementById('checkoutNext').addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentMonth.checkout.setMonth(this.currentMonth.checkout.getMonth() + 1);
            this.renderCalendar('checkout');
        });
    }
    
    bindEvents() {
        // Location dropdown
        this.locationInput.addEventListener('focus', () => {
            this.dropdown.classList.add('active');
        });
        
        this.locationInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.dropdown.classList.remove('active');
            }, 200);
        });
        
        this.options.forEach(option => {
            option.addEventListener('click', () => {
                this.locationInput.value = option.textContent.trim();
                this.dropdown.classList.remove('active');
                this.locationField.classList.remove('active');
            });
        });
        
        // Guest selector
        this.guestBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleGuestDropdown();
        });
        
        // Counter buttons
        this.counterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = btn.getAttribute('data-type');
                const isIncrement = btn.classList.contains('plus');
                const valueSpan = document.getElementById(type);
                
                if (isIncrement) {
                    this.incrementCounter(type);
                } else {
                    this.decrementCounter(type);
                }
                
                valueSpan.textContent = this.guestCounts[type];
                this.updateGuestButton();
                this.updateCounterButtons();
            });
        });
        
        // Search button
        this.searchBtn.addEventListener('click', () => {
            this.performSearch();
        });
        
        // Close guest dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.guest-field')) {
                this.guestDropdown.classList.remove('active');
                this.guestField.classList.remove('active');
            }
        });
        
        // Pets checkbox
        this.travelWithPets.addEventListener('change', () => {
            console.log('Traveling with pets:', this.travelWithPets.checked);
        });
    }
    
    toggleGuestDropdown() {
        this.guestDropdown.classList.toggle('active');
        this.updateCounterButtons();
    }
    
    incrementCounter(type) {
        if (this.guestCounts[type] >= 20) return;
        
        this.guestCounts[type]++;
        
        // Auto-increment adults if children are added but no adults
        if (type === 'children' && this.guestCounts.adults === 0) {
            this.guestCounts.adults = 1;
            document.getElementById('adults').textContent = this.guestCounts.adults;
        }
    }
    
    decrementCounter(type) {
        if (this.guestCounts[type] <= 0) return;
        
        // Prevent adults from going below 1 if children exist
        if (type === 'adults' && this.guestCounts[type] === 1 && this.guestCounts.children > 0) {
            return;
        }
        
        this.guestCounts[type]--;
    }
    
    updateCounterButtons() {
        this.counterBtns.forEach(btn => {
            const type = btn.getAttribute('data-type');
            const isIncrement = btn.classList.contains('plus');
            const currentValue = this.guestCounts[type];
            
            // Disable minus buttons for minimum values
            if (!isIncrement) {
                if (type === 'adults' && currentValue <= 1 && this.guestCounts.children > 0) {
                    btn.disabled = true;
                } else if (type === 'children' && currentValue <= 0) {
                    btn.disabled = true;
                } else {
                    btn.disabled = false;
                }
            }
            
            // Disable plus buttons for maximum values
            if (isIncrement) {
                if (currentValue >= 20) {
                    btn.disabled = true;
                } else {
                    btn.disabled = false;
                }
            }
        });
    }
    
    updateGuestButton() {
        const { adults, children } = this.guestCounts;
        
        // Get current language for proper text
        const currentLang = window.headerDropdowns ? window.headerDropdowns.currentLanguage : 'es';
        
        let guestText = '';
        if (currentLang === 'es') {
            if (adults > 0) guestText += `${adults} adulto${adults > 1 ? 's' : ''}`;
            if (children > 0) {
                if (guestText) guestText += ' · ';
                guestText += `${children} niño${children > 1 ? 's' : ''}`;
            }
        } else {
            if (adults > 0) guestText += `${adults} adult${adults > 1 ? 's' : ''}`;
            if (children > 0) {
                if (guestText) guestText += ' · ';
                guestText += `${children} child${children > 1 ? 'ren' : ''}`;
            }
        }
        
        this.guestBtn.textContent = guestText;
    }
    
    performSearch() {
        const location = this.locationInput.value;
        const checkinDate = this.checkinInput.value;
        const checkoutDate = this.checkoutInput.value;
        const withPets = this.travelWithPets.checked;
        
        // Validation
        if (!location.trim()) {
            alert('Por favor, selecciona una ubicación');
            return;
        }
        
        if (!checkinDate || !checkoutDate) {
            alert('Por favor, selecciona las fechas de llegada y salida');
            return;
        }
        
        if (new Date(checkinDate) >= new Date(checkoutDate)) {
            alert('La fecha de salida debe ser posterior a la fecha de llegada');
            return;
        }
        
        // Here you would typically send the search data to your backend
        console.log('Searching with:', {
            location,
            checkinDate,
            checkoutDate,
            guests: this.guestCounts,
            withPets
        });
        
        // Show loading state
        const currentLang = window.headerDropdowns ? window.headerDropdowns.currentLanguage : 'es';
        const searchingText = currentLang === 'es' ? 'Buscando...' : 'Searching...';
        const searchText = currentLang === 'es' ? 'Buscar' : 'Search';
        
        this.searchBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${searchingText}</span>`;
        this.searchBtn.disabled = true;
        
        setTimeout(() => {
            this.searchBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> <span>${searchText}</span>`;
            this.searchBtn.disabled = false;
            
            const demoText = currentLang === 'es' ? 
                '¡Búsqueda realizada! Encontramos 15 fincas disponibles.' : 
                'Search completed! We found 15 available farms.';
            alert(demoText);
        }, 2000);
    }
}

// Slider Municipios - Simple y funcional
function initMunicipiosSlider() {
    const nextBtn = document.querySelector("#slider-municipios .button .next");
    const prevBtn = document.querySelector("#slider-municipios .button .prev");
    const slide = document.querySelector("#slider-municipios .slide");
    
    console.log("Municipios Slider - Next button:", nextBtn);
    console.log("Municipios Slider - Prev button:", prevBtn);
    console.log("Municipios Slider - Slide container:", slide);
    
    if (!nextBtn || !prevBtn || !slide) {
        console.error("No se encontraron los elementos del slider");
        return;
    }
    
    // Botón siguiente
    nextBtn.addEventListener("click", function () {
        console.log("Click en NEXT");
        const items = document.querySelectorAll("#slider-municipios .slide .item");
        console.log("Items encontrados:", items.length);
        if (items.length > 0) {
            slide.appendChild(items[0]);
        }
    });
    
    // Botón anterior
    prevBtn.addEventListener("click", function () {
        console.log("Click en PREV");
        const items = document.querySelectorAll("#slider-municipios .slide .item");
        console.log("Items encontrados:", items.length);
        if (items.length > 0) {
            slide.prepend(items[items.length - 1]);
        }
    });
    
    // Auto-slide cada 10 segundos
    setInterval(function () {
        const items = document.querySelectorAll("#slider-municipios .slide .item");
        if (items.length > 0) {
            slide.appendChild(items[0]);
        }
    }, 10000);
    
    console.log("Slider de municipios inicializado correctamente");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize header dropdowns first
    window.headerDropdowns = new HeaderDropdowns();
    
    // Then initialize other components
    new FincaSlider();
    new SearchBar();
    initMunicipiosSlider();
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== 'es') {
        window.headerDropdowns.changeLanguage(savedLanguage);
    }
});