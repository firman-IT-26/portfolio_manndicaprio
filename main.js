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