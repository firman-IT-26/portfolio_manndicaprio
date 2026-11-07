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