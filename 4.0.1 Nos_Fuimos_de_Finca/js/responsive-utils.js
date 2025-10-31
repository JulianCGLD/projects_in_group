// Responsive Utilities for Nos Fuimos de Finca
// This file contains utility functions for enhanced responsive behavior

(function() {
    'use strict';
    
    // Viewport height fix for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Handle orientation changes
    function handleOrientationChange() {
        setTimeout(() => {
            setViewportHeight();
            
            // Force reflow for mobile browsers
            document.body.style.height = '100.1%';
            setTimeout(() => {
                document.body.style.height = '';
            }, 10);
        }, 100);
    }
    
    // Responsive font sizing based on screen size
    function setResponsiveFontSizes() {
        const screenWidth = window.innerWidth;
        const root = document.documentElement;
        
        if (screenWidth <= 320) {
            root.style.fontSize = '14px';
        } else if (screenWidth <= 480) {
            root.style.fontSize = '15px';
        } else if (screenWidth <= 768) {
            root.style.fontSize = '16px';
        } else {
            root.style.fontSize = '16px';
        }
    }
    
    // Touch device detection and optimization
    function optimizeForTouch() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
            
            // Add larger touch targets for small elements
            const style = document.createElement('style');
            style.textContent = `
                .touch-device .btn {
                    min-height: 44px;
                    min-width: 44px;
                }
                .touch-device input[type="checkbox"],
                .touch-device input[type="radio"] {
                    min-height: 44px;
                    min-width: 44px;
                }
                .touch-device .form-control {
                    min-height: 44px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Safe area handling for devices with notches
    function handleSafeAreas() {
        if (CSS.supports('padding: env(safe-area-inset-top)')) {
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    body {
                        padding-top: env(safe-area-inset-top);
                        padding-left: env(safe-area-inset-left);
                        padding-right: env(safe-area-inset-right);
                        padding-bottom: env(safe-area-inset-bottom);
                    }
                    
                    .header {
                        padding-top: calc(1.5rem + env(safe-area-inset-top));
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Prevent zoom on input focus for iOS
    function preventIOSZoom() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], select, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (input.style.fontSize !== '16px') {
                        input.style.fontSize = '16px';
                    }
                });
                
                input.addEventListener('blur', () => {
                    input.style.fontSize = '';
                });
            });
        }
    }
    
    // Initialize responsive utilities
    function init() {
        setViewportHeight();
        setResponsiveFontSizes();
        optimizeForTouch();
        handleSafeAreas();
        preventIOSZoom();
        
        // Event listeners
        window.addEventListener('resize', debounce(() => {
            setViewportHeight();
            setResponsiveFontSizes();
        }, 100));
        
        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Listen for device rotation completion
        if (screen && screen.orientation) {
            screen.orientation.addEventListener('change', handleOrientationChange);
        }
        
        // Handle browser zoom
        let lastInnerWidth = window.innerWidth;
        window.addEventListener('resize', debounce(() => {
            const currentInnerWidth = window.innerWidth;
            if (Math.abs(currentInnerWidth - lastInnerWidth) > 50) {
                setResponsiveFontSizes();
                lastInnerWidth = currentInnerWidth;
            }
        }, 250));
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export utilities for potential use by other scripts
    window.ResponsiveUtils = {
        setViewportHeight,
        setResponsiveFontSizes,
        handleOrientationChange
    };
    
})();