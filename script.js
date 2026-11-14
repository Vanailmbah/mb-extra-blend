document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const saved = localStorage.getItem('nexus_site_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.services) {
                document.getElementById('servicesGrid').innerHTML = data.services.map((imgUrl, i) => `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="service-image-box">
                <img src="${imgUrl}" alt="Service ${i + 1}" />
                </div>
            </div>
            `).join('');
            }
        } catch (e) { console.error(e); }
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animates once when scrolled into view
            }
        });
    }, observerOptions);

    // Select elements you want to animate (Service image boxes, About image, Contact card, etc.)
    document.querySelectorAll('.service-image-box, .about-img-wrapper, .contact-card, .section-title').forEach(el => {
        el.classList.add('reveal-on-scroll');
        scrollObserver.observe(el);
    });
});