<?php
/**
 * The front page template - Matches CleanCloth React Design Exactly
 *
 * @package CleanCloth
 */

get_header(); ?>

<main id="main" class="site-main" style="margin: 0; padding: 0;">
    <!-- Hero Section with Video Background -->
    <div style="position: relative; min-height: 100vh; overflow: hidden; background: #2c2c2c;">
        <!-- Video Background -->
        <div style="position: absolute; inset: 0;">
            <video
                autoplay
                muted
                loop
                playsinline
                style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;"
            >
                <source
                    src="https://cleancloth.dk/wp-content/uploads/2025/08/cleancloth-broll-privat.mp4"
                    type="video/mp4"
                />
            </video>
            <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.35);"></div>
        </div>

        <!-- Content Container -->
        <div style="position: relative; z-index: 10;">
            <!-- Mobile Burger Header -->
            <header style="position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(44, 44, 44, 0.95); backdrop-filter: blur(16px); border-bottom: 2px solid rgba(60, 172, 174, 0.3); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem;">
                    <!-- Logo -->
                    <a href="<?php echo esc_url(home_url('/')); ?>" style="display: block;">
                        <img
                            src="https://cleancloth.dk/wp-content/uploads/2025/08/cropped-cropped-image-scaled-1-1.png"
                            alt="CleanCloth"
                            style="height: 3rem; width: auto;"
                        />
                    </a>

                    <!-- Burger Menu Button -->
                    <button
                        id="burger-menu-btn"
                        aria-label="Toggle menu"
                        style="display: flex; flex-direction: column; gap: 0.375rem; background: transparent; border: none; cursor: pointer; padding: 0.5rem; transition: transform 0.3s;"
                    >
                        <span style="display: block; width: 1.75rem; height: 0.25rem; background: #3CACAE; border-radius: 0.125rem; transition: all 0.3s;"></span>
                        <span style="display: block; width: 1.75rem; height: 0.25rem; background: #3CACAE; border-radius: 0.125rem; transition: all 0.3s;"></span>
                        <span style="display: block; width: 1.75rem; height: 0.25rem; background: #3CACAE; border-radius: 0.125rem; transition: all 0.3s;"></span>
                    </button>
                </div>

                <!-- Mobile Menu (Hidden by default) -->
                <nav
                    id="mobile-menu"
                    style="display: none; background: rgba(44, 44, 44, 0.98); border-top: 1px solid rgba(60, 172, 174, 0.3); padding: 1.5rem;"
                >
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <a href="<?php echo esc_url(home_url('/faq/')); ?>" style="color: white; font-weight: 600; text-decoration: none; padding: 0.75rem; border-radius: 0.375rem; transition: all 0.3s; font-size: 1rem;">
                            Spørgsmål & svar
                        </a>
                        <a href="<?php echo esc_url(home_url('/privatrengoring/')); ?>" style="color: white; font-weight: 600; text-decoration: none; padding: 0.75rem; border-radius: 0.375rem; transition: all 0.3s; font-size: 1rem;">
                            Privat rengøring i Aarhus
                        </a>
                        <a href="<?php echo esc_url(home_url('/hvordan-virker-det/')); ?>" style="color: white; font-weight: 600; text-decoration: none; padding: 0.75rem; border-radius: 0.375rem; transition: all 0.3s; font-size: 1rem;">
                            Sådan virker det
                        </a>
                    </div>
                </nav>
            </header>

            <!-- Price Calculator Widget - Left Side (Vertically Centered) -->
            <div style="position: fixed; left: 2rem; top: 50%; transform: translateY(-50%); z-index: 20; width: 100%; max-width: 28rem; padding: 0 1rem;">
                <div style="background: rgba(44, 44, 44, 0.92); backdrop-filter: blur(16px); border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    <h1 style="font-size: 1.5rem; color: white; font-weight: 600; margin-bottom: 0.75rem; line-height: 1.4;">
                        Rengøringshælp i Aarhus
                    </h1>

                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.6;">
                        Professionel service med transparent prissætning. Indtast dit postnummer og boligens størrelse nedenfor.
                    </p>

                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                        <!-- Price Calculator Form -->
                        <form id="price-calculator-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <input
                                    type="text"
                                    id="postal-code"
                                    name="postal_code"
                                    placeholder="Postnr."
                                    maxlength="4"
                                    style="flex: 1; padding: 0.75rem; background: rgba(255, 255, 255, 0.15); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 0.375rem; color: white; font-size: 0.875rem; outline: none;"
                                />
                                <input
                                    type="number"
                                    id="property-size"
                                    name="property_size"
                                    placeholder="Størrelse"
                                    min="0"
                                    max="300"
                                    style="flex: 1; padding: 0.75rem; background: rgba(255, 255, 255, 0.15); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 0.375rem; color: white; font-size: 0.875rem; outline: none;"
                                />
                                <span style="color: white; font-weight: 500; font-size: 0.875rem;">m²</span>
                            </div>

                            <!-- Success Message -->
                            <div id="zone-success" style="display: none; background: rgba(60, 172, 174, 0.15); border: 2px solid #3CACAE; border-radius: 0.5rem; padding: 0.75rem; text-align: center; color: white; font-size: 0.875rem;">
                                <strong>Godt nyt!</strong> Vi rengør i dit område.
                            </div>

                            <!-- Submit Button -->
                            <button
                                type="submit"
                                id="submit-btn"
                                disabled
                                style="margin: 0 auto; display: block; padding: 1rem 3rem; background: #00FFFF; color: black; font-weight: 800; border-radius: 0.5rem; border: 4px solid #00FFFF; cursor: pointer; transition: all 0.3s; font-size: 1rem;"
                            >
                                SE DIN PRIS →
                            </button>
                        </form>

                        <!-- Trust Indicators -->
                        <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.2); flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 0.375rem;">
                                <div style="color: #FCD34D; font-size: 0.875rem;">★★★★★</div>
                                <span style="color: rgba(255, 255, 255, 0.9); font-size: 0.875rem;">5.0 på Google</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.375rem;">
                                <img
                                    src="https://cleancloth.dk/wp-content/uploads/2025/08/tryg-logo.png"
                                    alt="Tryg"
                                    style="height: 1.5rem; border-radius: 0.25rem;"
                                    onerror="this.style.display='none'"
                                />
                                <span style="color: rgba(255, 255, 255, 0.9); font-size: 0.875rem;">Forsikret</span>
                            </div>
                        </div>

                        <!-- Eco Indicator -->
                        <div style="display: flex; align-items: center; justify-content: center; gap: 0.375rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.95); font-size: 0.875rem;">
                            <svg
                                style="width: 1rem; height: 1rem; color: #3CACAE;"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            Svanemærkede produkter
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 3px solid #3CACAE; box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2); z-index: 30;">
                <div style="max-width: 1280px; margin: 0 auto; padding: 1rem 1.25rem;">
                    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.875rem;">
                        <a href="<?php echo esc_url(home_url('/faq/')); ?>" style="color: #1F2937; font-weight: 700; text-decoration: none; transition: color 0.3s;">
                            Spørgsmål & svar
                        </a>
                        <span style="color: #D1D5DB; font-size: 1.125rem;">|</span>
                        <a href="<?php echo esc_url(home_url('/privatrengoring/')); ?>" style="color: #1F2937; font-weight: 700; text-decoration: none; transition: color 0.3s;">
                            Privat rengøring i Aarhus
                        </a>
                        <span style="color: #D1D5DB; font-size: 1.125rem;">|</span>
                        <a href="<?php echo esc_url(home_url('/hvordan-virker-det/')); ?>" style="color: #1F2937; font-weight: 700; text-decoration: none; transition: color 0.3s;">
                            Sådan virker det
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    /* Hide default header and footer */
    body.home .site-header {
        display: none !important;
    }

    body.home .site-footer {
        display: none !important;
    }

    /* Input focus styles */
    #postal-code:focus,
    #property-size:focus {
        border-color: #3CACAE !important;
        background: rgba(255, 255, 255, 0.2) !important;
    }

    /* Button hover effect */
    #submit-btn:not(:disabled):hover {
        background: #3CACAE !important;
        border-color: #3CACAE !important;
        color: white !important;
        transform: scale(1.05);
    }

    /* Button disabled state */
    #submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Bottom bar link hover */
    #main a:hover {
        color: #3CACAE !important;
    }

    /* Mobile menu links hover */
    #mobile-menu a:hover {
        background: rgba(60, 172, 174, 0.2);
        color: #3CACAE !important;
    }

    /* Burger menu animation */
    #burger-menu-btn:hover {
        transform: scale(1.1);
    }

    #burger-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(0.5rem, 0.5rem);
    }

    #burger-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }

    #burger-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(0.5rem, -0.5rem);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        /* Move calculator to bottom on mobile */
        #main > div > div > div:nth-child(2) {
            position: static !important;
            transform: none !important;
            left: auto !important;
            top: auto !important;
            max-width: 100% !important;
            padding: 1rem !important;
            margin-top: 5rem;
        }

        #main h1 {
            font-size: 1.25rem !important;
        }
    }

    @media (min-width: 769px) {
        #main h1 {
            font-size: 1.5rem !important;
        }
    }
</style>

<script>
// Zone Map
const ZONE_MAP = {
    '8000': 0, '8230': 0,
    '8200': 1, '8210': 1, '8220': 1,
    '8240': 2, '8250': 2,
    '8260': 3, '8270': 3, '8310': 3, '8320': 3, '8330': 3,
    '8361': 4, '8362': 4, '8370': 4, '8380': 4, '8381': 4,
    '8382': 4, '8410': 4, '8471': 4, '8520': 4, '8541': 4,
    '8543': 4, '8600': 4, '8660': 4, '8670': 4, '8680': 4
};

document.addEventListener('DOMContentLoaded', function() {
    // Burger menu toggle
    const burgerBtn = document.getElementById('burger-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    burgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (mobileMenu.style.display === 'none' || !mobileMenu.style.display) {
            mobileMenu.style.display = 'block';
        } else {
            mobileMenu.style.display = 'none';
        }
    });

    // Price calculator functionality
    const form = document.getElementById('price-calculator-form');
    const postalCodeInput = document.getElementById('postal-code');
    const propertySizeInput = document.getElementById('property-size');
    const submitBtn = document.getElementById('submit-btn');
    const zoneSuccess = document.getElementById('zone-success');

    function validateForm() {
        const postalCode = postalCodeInput.value;
        const propertySize = propertySizeInput.value;

        const hasValidLength = postalCode.length === 4;
        const hasSize = propertySize && parseInt(propertySize) > 0;
        const isInZone = ZONE_MAP[postalCode] !== undefined;

        if (hasValidLength && hasSize && isInZone) {
            submitBtn.disabled = false;
            zoneSuccess.style.display = 'block';
            return true;
        } else {
            submitBtn.disabled = true;
            zoneSuccess.style.display = 'none';
            return false;
        }
    }

    // Postal code formatting
    postalCodeInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
        validateForm();
    });

    propertySizeInput.addEventListener('input', function() {
        validateForm();
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            // Redirect to booking page with parameters
            const postalCode = postalCodeInput.value;
            const propertySize = propertySizeInput.value;
            window.location.href = '<?php echo esc_url(home_url('/beregn-pris/')); ?>?postal=' + postalCode + '&size=' + propertySize;
        }
    });
});
</script>
