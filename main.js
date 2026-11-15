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
   SCROLL REVEAL ANIMATION
========================================= */

// Pilih elemen yang akan dianimasikan
const revealElements = [
    [".home-content", "reveal-left"],
    [".home-img", "reveal-right"],

    [".about .container", "reveal-left"],
    [".about-content", "reveal-right"],

    [".services .heading", "reveal"],
    [".services-box", "reveal"],

    [".project .heading", "reveal"],
    [".project-card", "reveal"],

    [".contact .heading", "reveal"],
    [".contact form", "reveal"],

    [".footer .social-icons", "reveal"],
    [".footer .list", "reveal"],
    [".footer .copyright", "reveal"]
];

// Tambahkan class animasi otomatis
revealElements.forEach(([selector, animation]) => {
    document.querySelectorAll(selector).forEach(element => {
        element.classList.add(animation);
    });
});

// Observer untuk mendeteksi scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }

    });
}, {
    threshold: 0.10
});

// Jalankan observer
document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
).forEach(element => {
    observer.observe(element);
});

/* =========================================
   PROJECT REVIEW MODAL
========================================= */

const projectModal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalGallery = document.getElementById("modalGallery");
const modalClose = document.getElementById("modalClose");

const reviewButtons = document.querySelectorAll(".review-project");


/* =========================================
   MASONRY GALLERY FUNCTION
========================================= */

function resizeGalleryItems() {

    const rowHeight = 5;
    const styles = getComputedStyle(modalGallery);
    const gap = parseFloat(styles.rowGap);

    modalGallery.querySelectorAll("img").forEach(img => {

        const height = img.getBoundingClientRect().height;

        if (height > 0) {

            const span = Math.ceil(
                (height + gap) / (rowHeight + gap)
            );

            img.style.gridRowEnd = `span ${span}`;

        }

    });

}


/* =========================================
   BUKA MODAL
========================================= */

reviewButtons.forEach(button => {

    button.addEventListener("click", (e) => {

        e.preventDefault();

        const title = button.dataset.title;
        const images = button.dataset.images.split("|");

        modalTitle.textContent = title;
        modalGallery.innerHTML = "";

        images.forEach(src => {

            if (!src.trim()) return;

            const img = document.createElement("img");

            img.src = src.trim();
            img.alt = title;

            img.addEventListener("load", resizeGalleryItems);

            modalGallery.appendChild(img);

        });

        projectModal.classList.add("active");
        document.body.classList.add("modal-open");

        // Hitung ulang setelah modal tampil
        requestAnimationFrame(resizeGalleryItems);

    });

});


/* =========================================
   RESPONSIVE MASONRY
========================================= */

window.addEventListener("resize", () => {

    requestAnimationFrame(resizeGalleryItems);

});


/* =========================================
   TUTUP MODAL
========================================= */

function closeProjectModal() {

    projectModal.classList.remove("active");
    document.body.classList.remove("modal-open");

}

modalClose.addEventListener("click", closeProjectModal);


/* =========================================
   TUTUP KETIKA KLIK AREA LUAR
========================================= */

projectModal.addEventListener("click", (e) => {

    if (e.target === projectModal) {
        closeProjectModal();
    }

});


/* =========================================
   TUTUP MENGGUNAKAN TOMBOL ESCAPE
========================================= */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        closeProjectModal();
    }

});

// IMAGE LIGHTBOX
const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

// Klik gambar untuk memperbesar
modalGallery.addEventListener("click", function(e) {
    if (e.target.tagName === "IMG") {
        lightboxImage.src = e.target.src;
        imageLightbox.classList.add("active");
    }
});

// Tutup lightbox
function closeLightbox() {
    imageLightbox.classList.remove("active");
    lightboxImage.src = "";
}

lightboxClose.addEventListener("click", closeLightbox);

imageLightbox.addEventListener("click", function(e) {
    if (e.target === imageLightbox) {
        closeLightbox();
    }
});

// Tombol ESC
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeLightbox();
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