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
    threshold: 0.15
});

// Jalankan observer
document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-zoom"
).forEach(element => {
    observer.observe(element);
});