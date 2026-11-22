let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar')

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x')
    navbar.classList.toggle('active');
}

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

// Atur volume agar tidak terlalu kencang (0.0 sampai 1.0)
bgMusic.volume = 0.4;

// 1. Fungsi Memutar Musik Otomatis Saat Klik Pertama di Layar
function startAutoplay() {
    bgMusic.play().then(() => {
        musicToggle.classList.add("playing");
        musicIcon.className = "bx bxs-volume-full";
    }).catch(() => {
        // Jika diblokir oleh browser, tombol tetap siap diklik manual
    });

    // Hapus listener setelah klik pertama agar tidak mengulang
    document.removeEventListener("click", startAutoplay);
}

// Dengarkan klik pertama pengguna di mana saja pada halaman
document.addEventListener("click", startAutoplay);

// 2. Tombol Mute / Unmute Manual
musicToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Mencegah bentrok dengan startAutoplay

    if (bgMusic.paused) {
        // Jika sedang mati -> Nyalakan
        bgMusic.play();
        musicToggle.classList.add("playing");
        musicIcon.className = "bx bxs-volume-full";
    } else {
        // Jika sedang nyala -> Matikan (Mute/Pause)
        bgMusic.pause();
        musicToggle.classList.remove("playing");
        musicIcon.className = "bx bxs-volume-mute";
    }
});

/* =========================================
   CINEMATIC INTRO CONTROLLER
========================================= */

const cinematicIntro = document.getElementById("cinematicIntro");
const enterPortfolio = document.getElementById("enterPortfolio");

if (cinematicIntro && enterPortfolio) {

    // Kunci scroll saat opening tampil
    document.body.style.overflow = "hidden";

    enterPortfolio.addEventListener("click", () => {

        // Hilangkan opening
        cinematicIntro.classList.add("hide-intro");

        // Kembalikan scroll website
        document.body.style.overflow = "";

        // Hapus intro setelah transisi selesai
        setTimeout(() => {
            cinematicIntro.remove();
        }, 1300);

    });

}
/* =========================================
   PROJECT DETAIL MODAL
========================================= */

const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalMeta = document.getElementById("modalMeta");
const modalMainImg = document.getElementById("modalMainImg");
const modalThumbs = document.getElementById("modalThumbs");
const modalClose = document.getElementById("modalClose");

const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentImages = [];
let currentIndex = 0;

// Buat daftar alamat foto dari data-* di kartu
function buildImageList(card) {
    const folder = card.dataset.folder;
    const prefix = card.dataset.prefix || "";
    const extension = card.dataset.extension || ".png";
    const start = Number(card.dataset.start || 1);
    const end = Number(card.dataset.end || start);
    const list = [];

    for (let i = start; i <= end; i++) {
        list.push(`${folder}${prefix}${i}${prefix ? ")" : ""}${extension}`);
    }
    return list;
}

// Tampilkan satu foto sebagai foto utama
function showMainImage(index) {
    currentIndex = index;
    modalMainImg.src = currentImages[index];
    modalThumbs.querySelectorAll("img").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
    });
}

// Buka foto besar (lightbox)
function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = currentImages[index];
    imageLightbox.classList.add("active");
}

// Pindah foto di lightbox (-1 = sebelumnya, 1 = berikutnya)
function stepLightbox(direction) {
    const total = currentImages.length;
    const next = (currentIndex + direction + total) % total;
    lightboxImage.src = currentImages[next];
    showMainImage(next);
}

function closeProjectModal() {
    projectModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

function closeLightbox() {
    imageLightbox.classList.remove("active");
    lightboxImage.src = "";
}

// Setiap kartu: tambah info jumlah foto + buka modal saat diklik
document.querySelectorAll(".project-card").forEach(card => {
    if (!card.dataset.folder) return;

    const images = buildImageList(card);

    // Tulisan kecil "N foto" di kartu
    const hint = document.createElement("div");
    hint.className = "card-hint";
    hint.innerHTML = `<i class='bx bx-images'></i> ${images.length} foto`;
    card.insertBefore(hint, card.querySelector(".project-meta"));

    card.addEventListener("click", () => {
        currentImages = images;

        modalTitle.textContent = card.querySelector("h3").textContent;
        modalDesc.textContent = card.querySelector("p").textContent;

        const meta = card.querySelector(".project-meta");
        modalMeta.innerHTML = meta ? meta.innerHTML : "";

        // Kotak harga (hanya di jendela detail)
        if (card.dataset.price) {
            modalMeta.insertAdjacentHTML("beforeend", `
                <div class="meta-box">
                    <div class="meta-label">Price</div>
                    <div class="meta-value">${card.dataset.price}</div>
                </div>
            `);
        }

        modalThumbs.innerHTML = "";
        images.forEach((src, i) => {
            const thumb = document.createElement("img");
            thumb.src = src;
            thumb.alt = `Foto ${i + 1}`;
            thumb.loading = "lazy";
            thumb.addEventListener("click", () => openLightbox(i));
            modalThumbs.appendChild(thumb);
        });

        showMainImage(0);
        modalMainImg.alt = modalTitle.textContent;
        projectModal.classList.add("active");
        document.body.classList.add("modal-open");
    });
});

// Klik foto utama: perbesar
modalMainImg.addEventListener("click", () => openLightbox(currentIndex));

// Tombol tutup
modalClose.addEventListener("click", closeProjectModal);
lightboxClose.addEventListener("click", closeLightbox);

// Tombol panah
lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });

// Klik area gelap di luar konten
projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) closeProjectModal();
});
imageLightbox.addEventListener("click", (e) => {
    if (e.target === imageLightbox) closeLightbox();
});

// Keyboard: Esc menutup, panah kiri/kanan pindah foto
document.addEventListener("keydown", (e) => {
    const lightboxOpen = imageLightbox.classList.contains("active");

    if (e.key === "Escape") {
        if (lightboxOpen) closeLightbox();
        else closeProjectModal();
    }
    if (lightboxOpen && e.key === "ArrowLeft") stepLightbox(-1);
    if (lightboxOpen && e.key === "ArrowRight") stepLightbox(1);
});

/* =====================================
   CUSTOM CURSOR ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Aktif hanya untuk perangkat dengan mouse
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = document.querySelector(".custom-cursor");
    const dot = document.querySelector(".cursor-dot");

    if (!cursor || !dot) return;

    document.body.classList.add("custom-cursor-enabled");

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
    });

    // Animasi cursor smooth
    function animateCursor() {

        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + "px";
        cursor.style.top = cursorY + "px";

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Efek hover
    document.addEventListener("mouseover", (e) => {

        if (e.target.closest(
            "a, button, input, textarea, select, .project-card, .app-card"
        )) {
            cursor.classList.add("hover");
        }

    });

    document.addEventListener("mouseout", (e) => {

        if (e.target.closest(
            "a, button, input, textarea, select, .project-card, .app-card"
        )) {
            cursor.classList.remove("hover");
        }

    });

    // Efek klik
    document.addEventListener("mousedown", () => {
        cursor.classList.add("click");
    });

    document.addEventListener("mouseup", () => {
        cursor.classList.remove("click");
    });

    // Sembunyikan ketika mouse keluar halaman
    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
        dot.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
        dot.style.opacity = "1";
    });

});

const typingText = document.querySelector(".typing-text");

const words = [
    "Graphic Designer"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();

// HOME 3D FLIP CARD
const homeCard = document.getElementById("homeCard");

if (homeCard) {

    // EFEK TILT DAN LIGHT REFLECTION
    homeCard.addEventListener("pointermove", (e) => {

        if (e.pointerType === "touch") return;

        const rect = homeCard.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // KEMIRINGAN KARTU
        const rotateX = (0.5 - y) * 12;
        const rotateY = (x - 0.5) * 12;

        homeCard.style.setProperty(
            "--rotate-x",
            `${rotateX}deg`
        );

        homeCard.style.setProperty(
            "--rotate-y",
            `${rotateY}deg`
        );

        // POSISI PANTULAN CAHAYA
        homeCard.style.setProperty(
            "--glare-x",
            `${x * 100}%`
        );

        homeCard.style.setProperty(
            "--glare-y",
            `${y * 100}%`
        );

        homeCard.classList.add("is-hovering");
    });

    // RESET KETIKA MOUSE KELUAR
    homeCard.addEventListener("pointerleave", () => {

        homeCard.style.setProperty("--rotate-x", "0deg");
        homeCard.style.setProperty("--rotate-y", "0deg");

        homeCard.classList.remove("is-hovering");
    });

    // FLIP FOTO
    homeCard.addEventListener("click", () => {
        homeCard.classList.toggle("is-flipped");
    });

}

const techText = document.getElementById("techText");

const characters = "!@#$%^&*(_+";

techText.addEventListener("mouseenter", () => {
    let iteration = 0;
    const originalText = "Firmansyh";

    clearInterval(techText.interval);

    techText.interval = setInterval(() => {
        techText.innerText = originalText
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return originalText[index];
                }

                return characters[
                    Math.floor(Math.random() * characters.length)
                ];
            })
            .join("");

        if (iteration >= originalText.length) {
            clearInterval(techText.interval);
        }

        iteration += 0.5;
    }, 30);
});

// navbar //
/* =====================================
   FLOATING PILL NAVBAR
===================================== */

const header = document.querySelector('.header');
const logo = document.querySelector('.logo');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled', 'expanded');
    }
});

logo.addEventListener('click', (e) => {
    if (header.classList.contains('scrolled')) {
        e.preventDefault();
        header.classList.toggle('expanded');
    }
});

/* =========================================
   CONTACT FORM (FORMSPREE)
========================================= */

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        formStatus.textContent = "Sending...";

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" }
            });

            if (response.ok) {
                formStatus.textContent = "Message sent! Thank you, I'll reply soon.";
                contactForm.reset();
            } else {
                formStatus.textContent = "Oops, something went wrong. Please try again.";
            }
        } catch (error) {
            formStatus.textContent = "Network error. Please try again.";
        }
    });
}

/* =========================================
   SKILLS: BAR TERISI SAAT TERLIHAT
========================================= */

const skillsSection = document.getElementById("skills");

if (skillsSection) {

    // Nama level mengikuti angka
    function levelName(value) {
        if (value >= 75) return "Advanced";
        if (value >= 45) return "Intermediate";
        return "Beginner";
    }

    // Baca data-level tiap kartu, lalu atur bar dan tulisannya
    skillsSection.querySelectorAll(".skill-card").forEach(card => {
        const value = Math.min(100, Math.max(0, Number(card.dataset.level) || 0));

        card.querySelector(".skill-fill").style.setProperty("--level", value + "%");
        card.querySelector(".skill-label").textContent = levelName(value) + " · " + value + "%";
    });

    // Bar terisi saat section terlihat
    if ("IntersectionObserver" in window) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillsSection.classList.add("in-view");
                    skillsObserver.disconnect();
                }
            });
        }, { threshold: 0.25 });

        skillsObserver.observe(skillsSection);
    } else {
        skillsSection.classList.add("in-view");
    }
}

/* =========================================
   MOBILE NAVBAR ACTIVE SECTION
========================================= */

const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

const mobileNavSections = document.querySelectorAll(
    '#home, #about, #skills, #services, #projects, #contact'
);

// Mengatur menu yang sedang aktif
function setActiveMobileLink(sectionId) {

    mobileNavLinks.forEach((link) => {

        const isActive =
            link.getAttribute('href') === `#${sectionId}`;

        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }

    });

}

// Ketika navbar diklik
mobileNavLinks.forEach((link) => {

    link.addEventListener('click', () => {

        const targetId = link.getAttribute('href').slice(1);

        setActiveMobileLink(targetId);

    });

});

// Mengikuti section yang sedang terlihat
if ('IntersectionObserver' in window && mobileNavSections.length) {

    const mobileSectionObserver = new IntersectionObserver((entries) => {

        const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length) {

            setActiveMobileLink(
                visibleSections[0].target.id
            );

        }

    }, {
        root: null,
        rootMargin: '-25% 0px -45% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75]
    });

    mobileNavSections.forEach((section) => {
        mobileSectionObserver.observe(section);
    });

}