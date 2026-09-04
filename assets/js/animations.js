/* ================================================================
   0A. LOADING SCREEN (Matrix / code-rain boot sequence)
   ================================================================ */
(function () {
    const screen = document.getElementById('loading-screen');
    const canvas = document.getElementById('loading-canvas');
    const fill = document.getElementById('loading-bar-fill');
    const percentEl = document.getElementById('loading-percent');
    if (!screen || !canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, columns, drops;
    const chars = '01'.split('');
    const fontSize = window.innerWidth < 768 ? 14 : 16;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        columns = Math.floor(W / fontSize);
        drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -40));
    }
    resize();
    window.addEventListener('resize', resize);

    let rainActive = true;
    function renderRain() {
        if (!rainActive) return;
        ctx.fillStyle = 'rgba(5, 7, 13, 0.18)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < columns; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const y = drops[i] * fontSize;
            ctx.fillStyle = Math.random() > 0.93 ? 'rgba(255,200,150,0.95)' : 'rgba(249,115,22,0.75)';
            ctx.fillText(char, i * fontSize, y);
            if (y > H && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        requestAnimationFrame(renderRain);
    }
    renderRain();

    let progress = 0;
    const minDuration = 4400;
    const startTime = performance.now();

    function tick() {
        const elapsed = performance.now() - startTime;
        const timeBased = Math.min(95, (elapsed / minDuration) * 95);
        progress = Math.max(progress, timeBased);
        fill.style.width = progress + '%';
        percentEl.textContent = Math.floor(progress) + '%';
        if (progress < 95) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function finishLoading() {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, minDuration - elapsed);
        setTimeout(() => {
            progress = 100;
            fill.style.width = '100%';
            percentEl.textContent = '100%';
            setTimeout(() => {
                screen.classList.add('loaded');
                rainActive = false;
                setTimeout(() => { screen.remove(); }, 700);
            }, 200);
        }, remaining);
    }

    if (document.readyState === 'complete') {
        finishLoading();
    } else {
        window.addEventListener('load', finishLoading);
    }
})();

/* ================================================================
   0B. SPARSE CODE FRAGMENTS (tech texture drifting over gradient mesh)
   ================================================================ */
(function () {
    const canvas = document.getElementById('code-fragments');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const snippets = [
        '01001', '10110', '{ }', '</>', 'const x =', 'if (true)',
        '=> {}', '0xFF', '01', '10', 'SELECT *', 'def fn():',
        '[::-1]', 'null', '!== ', '&&', '||', 'import', '#!/usr',
        '0b1010', 'true', 'false', '-> void', '...rest', 'async'
    ];

    const FRAG_COUNT = isMobile ? 9 : 17;
    const fragments = [];
    function randomFragment() {
        return {
            text: snippets[Math.floor(Math.random() * snippets.length)],
            x: Math.random() * W,
            y: Math.random() * H,
            size: 11 + Math.random() * 4,
            vy: 0.05 + Math.random() * 0.07,
            phase: Math.random() * Math.PI * 2,
            speed: 0.006 + Math.random() * 0.008
        };
    }
    function setupFragments() {
        fragments.length = 0;
        for (let i = 0; i < FRAG_COUNT; i++) fragments.push(randomFragment());
    }
    setupFragments();
    window.addEventListener('resize', setupFragments);

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.font = '12px monospace';
        fragments.forEach(f => {
            f.y += f.vy;
            f.phase += f.speed;
            if (f.y > H + 20) {
                f.y = -20;
                f.x = Math.random() * W;
                f.text = snippets[Math.floor(Math.random() * snippets.length)];
            }
            const fade = (Math.sin(f.phase) + 1) / 2;
            const alpha = 0.12 + fade * 0.45;
            ctx.font = f.size + 'px monospace';
            ctx.fillStyle = `rgba(249,115,22,${alpha})`;
            ctx.fillText(f.text, f.x, f.y);
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ================================================================
   0B2. DRIFTING TECH ICONS
   ================================================================ */
(function () {
    const layer = document.getElementById('tech-icons-layer');
    if (!layer) return;
    const isMobile = window.innerWidth < 768;

    const svgIcons = [
        'python', 'r', 'postgresql', 'databricks', 'apachehadoop', 'apachespark',
        'amazonwebservices', 'pandas', 'numpy', 'tensorflow', 'scikitlearn',
        'git', 'docker', 'jupyter'
    ];
    const imgIcons = ['tableau', 'powerbi'];

    const ICON_COUNT = isMobile ? 6 : 11;
    const icons = [];

    function buildIconEl(kind, name) {
        const el = document.createElement('div');
        el.className = 'tech-icon' + (kind === 'svg' && name === 'amazonwebservices' ? ' tech-icon-aws' : '');
        if (kind === 'svg') {
            el.innerHTML = `<svg viewBox="0 0 24 24"><use href="#ti-${name}"></use></svg>`;
        } else {
            el.innerHTML = `<img src="#tech-icon-${name}-src" alt="" draggable="false">`;
            const img = el.querySelector('img');
            img.src = document.getElementById(`tech-icon-${name}-src`).dataset.src;
        }
        return el;
    }

    function randomIcon() {
        const useImg = Math.random() < (imgIcons.length / (imgIcons.length + svgIcons.length));
        const kind = useImg ? 'img' : 'svg';
        const name = useImg
            ? imgIcons[Math.floor(Math.random() * imgIcons.length)]
            : svgIcons[Math.floor(Math.random() * svgIcons.length)];
        return { kind, name };
    }

    function setupIcons() {
        layer.innerHTML = '';
        icons.length = 0;
        for (let i = 0; i < ICON_COUNT; i++) {
            const { kind, name } = randomIcon();
            const el = buildIconEl(kind, name);
            const size = isMobile ? (18 + Math.random() * 8) : (22 + Math.random() * 12);
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            const startTop = Math.random() * 100;
            const startLeft = Math.random() * 96 + 1;
            el.style.top = startTop + 'vh';
            el.style.left = startLeft + 'vw';
            layer.appendChild(el);
            icons.push({
                el, kind, name,
                top: startTop,
                left: startLeft,
                vy: 0.0035 + Math.random() * 0.004,
                phase: Math.random() * Math.PI * 2,
                speed: 0.005 + Math.random() * 0.006
            });
        }
    }
    setupIcons();
    window.addEventListener('resize', setupIcons);

    function animate() {
        icons.forEach(ic => {
            ic.top += ic.vy;
            ic.phase += ic.speed;
            if (ic.top > 102) {
                ic.top = -6;
                ic.left = Math.random() * 96 + 1;
                ic.el.style.left = ic.left + 'vw';
            }
            const fade = (Math.sin(ic.phase) + 1) / 2;
            const alpha = 0.10 + fade * 0.30;
            ic.el.style.top = ic.top + 'vh';
            ic.el.style.opacity = alpha;
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ================================================================
   0C. CUSTOM NODE CURSOR
   ================================================================ */
(function () {
    if (window.innerWidth < 1024 || window.matchMedia('(hover: none)').matches) return;
    const cursor = document.getElementById('node-cursor');
    if (!cursor) return;
    document.body.classList.add('custom-cursor-active');

    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.opacity = '1'; });
    window.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });

    function render() {
        cx += (mx - cx) * 0.35;
        cy += (my - cy) * 0.35;
        cursor.style.transform = `translate(${cx}px, ${cy}px)`;
        requestAnimationFrame(render);
    }
    render();

    const hoverTargets = 'a, button, input, textarea, .card-hover, .glass';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverTargets)) cursor.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverTargets)) cursor.classList.remove('cursor-hover');
    });
})();

/* ================================================================
   2. SCROLL PROGRESS BAR
   ================================================================ */
(function () {
    const bar = document.getElementById('scroll-progress');
    if(!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (docHeight > 0 ? (scrollTop / docHeight * 100) : 0) + '%';
    }, { passive: true });
})();

/* ================================================================
   4. INTERSECTION OBSERVER — SCROLL REVEAL
   ================================================================ */
(function () {
    const isMobile = window.innerWidth < 768;
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .cert-badge');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.closest('.stagger');
                let delay = 0;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    delay = isMobile ? index * 40 : index * 90;
                }
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.querySelectorAll('.stat-val').forEach(el => el.classList.add('animate'));
                    entry.target.querySelectorAll('.timeline-dot').forEach(el => el.classList.add('animate'));
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
    revealEls.forEach(el => observer.observe(el));
})();

/* ================================================================
   5. TILT EFFECT
   ================================================================ */
(function () {
    if (window.innerWidth < 768) return;
    const tiltCards = document.querySelectorAll('#skills .glass, #projects .glass');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(600px) rotateX(${-(y / rect.height) * 6}deg) rotateY(${(x / rect.width) * 6}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
})();

/* ================================================================
   6. TECH TAG HOVER
   ================================================================ */
(function () {
    document.querySelectorAll('.tech-tag').forEach(tag => {
        tag.style.transition = 'background 0.3s, border-color 0.3s, color 0.3s';
        tag.addEventListener('mouseenter', () => {
            tag.style.background = 'rgba(249,115,22,0.15)';
            tag.style.borderColor = 'rgba(249,115,22,0.5)';
            tag.style.color = '#f97316';
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.background = ''; tag.style.borderColor = ''; tag.style.color = '';
        });
    });
})();

/* ================================================================
   7. ACTIVE NAV HIGHLIGHT
   ================================================================ */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.id; });
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current || link.getAttribute('href').endsWith('#' + current)) link.style.color = '#f97316';
        });
    }, { passive: true });
})();

/* ================================================================
   8. TYPEWRITER
   ================================================================ */
(function () {
    const el = document.querySelector('#home h2');
    if (!el) return;
    const roles = [
        'Data Analyst | Data Scientist',
        'Machine Learning Enthusiast',
        'Business Intelligence & Analytics',
        'Business Analyst',
        'Business & Data Solutions'
    ];
    el.style.borderRight = '2px solid #f97316';
    el.style.paddingRight = '4px';
    el.style.display = 'inline-block';
    el.style.whiteSpace = 'nowrap';
    el.style.overflow = 'hidden';

    let roleIdx = 0, charIdx = 0, deleting = false;
    function morphType() {
        const current = roles[roleIdx];
        if (!deleting) {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) { deleting = true; setTimeout(morphType, 2200); return; }
            setTimeout(morphType, 60);
        } else {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(morphType, 400); return; }
            setTimeout(morphType, 30);
        }
    }
    el.textContent = '';
    setTimeout(morphType, 800);
})();

/* ================================================================
   9. HERO NAME GLOW
   ================================================================ */
(function () {
    if (window.innerWidth < 768) return;
    const nameEl = document.querySelector('#home h1');
    if (!nameEl) return;
    nameEl.style.transition = 'text-shadow 0.4s ease, color 0.4s ease';
    nameEl.addEventListener('mouseenter', () => {
        nameEl.style.textShadow = '0 0 40px rgba(249,115,22,0.5), 0 0 80px rgba(249,115,22,0.2)';
        nameEl.style.color = '#f97316';
    });
    nameEl.addEventListener('mouseleave', () => { nameEl.style.textShadow = ''; nameEl.style.color = ''; });
})();

/* ================================================================
   10. ANIMATED NUMBERS
   ================================================================ */
(function () {
    function animateCounter(el, target, suffix, duration) {
        const isFloat = target % 1 !== 0;
        let start = null;
        function step(ts) {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = eased * target;
            el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.dataset.countTarget;
            if (!raw) return;
            animateCounter(el, parseFloat(raw), el.dataset.countSuffix || '', 1800);
            statsObserver.unobserve(el);
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('#about .stat-val').forEach(el => {
        const text = el.textContent.trim();
        const match = text.match(/([\d.]+)(.*)/);
        if (match) {
            el.dataset.countTarget = match[1];
            el.dataset.countSuffix = match[2];
            el.textContent = '0' + match[2];
            statsObserver.observe(el);
        }
    });
})();

/* ================================================================
   12. SECTION HEADINGS REVEAL
   ================================================================ */
(function () {
    const headings = document.querySelectorAll('section h3');
    headings.forEach(h => {
        const text = h.textContent;
        h.innerHTML = '';
        h.style.opacity = '1';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `display:inline-block;opacity:0;transform:translateY(20px) rotateX(90deg);transition:opacity 0.4s ${i * 0.02}s,transform 0.4s ${i * 0.02}s;`;
            h.appendChild(span);
        });
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                h.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0) rotateX(0)'; });
                obs.unobserve(h);
            }
        }, { threshold: 0.2 });
        obs.observe(h);
    });
})();

/* ================================================================
   13. EXPERIENCE ITEMS SLIDE
   ================================================================ */
(function () {
    const isMobile = window.innerWidth < 768;
    const items = document.querySelectorAll('#experience .space-y-12 > .relative');
    items.forEach((item, i) => {
        if (isMobile) {
            item.style.opacity = '0';
            item.style.transition = `opacity 0.5s ${i * 0.1}s ease`;
        } else {
            item.style.opacity = '0';
            item.style.transform = i % 2 === 0 ? 'translateX(-40px)' : 'translateX(40px)';
            item.style.transition = `opacity 0.7s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1)`;
        }
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                item.style.opacity = '1';
                if (!isMobile) item.style.transform = 'translateX(0)';
                obs.unobserve(item);
            }
        }, { threshold: 0.1 });
        obs.observe(item);
    });
})();

/* ================================================================
   18. EXPERIENCE TIMELINE LINE DRAW
   ================================================================ */
(function () {
    const line = document.querySelector('#experience .border-l-2');
    if (!line) return;
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { line.style.animation = 'timelineLineGrow 1.5s cubic-bezier(0.16,1,0.3,1) both'; obs.unobserve(line); }
    }, { threshold: 0.05 });
    obs.observe(line);
})();

/* ================================================================
   25. EDUCATION LIST ITEM SLIDE-IN
   ================================================================ */
(function () {
    const skillItems = document.querySelectorAll('#education li');
    skillItems.forEach((li, i) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        li.style.transition = `opacity 0.5s ${i * 0.15}s, transform 0.5s ${i * 0.15}s`;
        const icon = li.querySelector('i');
        if (icon) icon.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                li.style.opacity = '1'; li.style.transform = 'translateX(0)';
                if (icon) setTimeout(() => { icon.style.transform = 'scale(1.4) rotate(10deg)'; setTimeout(() => { icon.style.transform = ''; }, 300); }, i * 150 + 400);
                obs.unobserve(li);
            }
        }, { threshold: 0.3 });
        obs.observe(li);
    });
})();