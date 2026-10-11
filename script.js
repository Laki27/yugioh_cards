const FOLDER_PUTANJA = 'slike/';

let karte = [];
let trenutniIndeks = 0;

const gallery = document.getElementById('gallery');
const modalOverlay = document.getElementById('modalOverlay');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalBadge = document.getElementById('modalBadge'); // Opcioni bedž za tip karte
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Učitavanje podataka iz JSON fajla čim se stranica otvori
fetch('karte.json')
    .then(response => response.json())
    .then(data => {
        karte = data;
        inicijalizujGaleriju();
    })
    .catch(error => console.error('Greška pri učitavanju karata:', error));

function inicijalizujGaleriju() {
    gallery.innerHTML = '';

    karte.forEach((karta, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        const img = document.createElement('img');
        img.src = FOLDER_PUTANJA + karta.fajl;
        img.alt = karta.naziv;
        img.loading = 'lazy';

        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = karta.naziv;

        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        card.appendChild(title);

        card.addEventListener('click', () => {
            prikaziKartu(index);
            modalOverlay.classList.add('active');
        });

        gallery.appendChild(card);
    });
}

// Funkcija za prikazivanje karte u modalu
function prikaziKartu(index) {
    trenutniIndeks = index;
    const karta = karte[trenutniIndeks];
    
    modalImg.src = FOLDER_PUTANJA + karta.fajl;
    modalTitle.textContent = karta.naziv;

    // Sastavljanje zaglavlja (Tip i Podtip)
    let detaljiTekst = `[ ${karta.tipKarte} / ${karta.podtip} ]<br>`;
    
    if (karta.atributi) {
        detaljiTekst += `${karta.atributi}<br>`;
    }
    
    // Formatiranje opisa (zamenjujemo novu liniju sa <br> da bi HTML lepo prelomio tekst)
    const formatiranOpis = karta.opis.replace(/\n/g, '<br>');

    if (karta.podtip === "Normal") {
        detaljiTekst += `<br>${formatiranOpis}`;
    } else {
        detaljiTekst += `<br>Opis / Efekat:<br>${formatiranOpis}`;
    }
    
    // Koristimo innerHTML da bi se span tagovi sa tooltipovima pravilno prikazali
    modalDesc.innerHTML = detaljiTekst;
}

function sledecaKarta() {
    const noviIndeks = (trenutniIndeks + 1) % karte.length;
    prikaziKartu(noviIndeks);
}

function prethodnaKarta() {
    const noviIndeks = (trenutniIndeks - 1 + karte.length) % karte.length;
    prikaziKartu(noviIndeks);
}

// Event listeneri za dugmad
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sledecaKarta();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prethodnaKarta();
});

closeBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;

    if (e.key === 'ArrowRight') {
        sledecaKarta();
    } else if (e.key === 'ArrowLeft') {
        prethodnaKarta();
    } else if (e.key === 'Escape') {
        modalOverlay.classList.remove('active');
    }
});

// --- LOGIKA ZA PREGLED SLIČICA NA HOVER (TOOLTIP) ---
const tooltip = document.getElementById('card-preview-tooltip');
const tooltipImg = document.getElementById('tooltip-img');

document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('card-tooltip')) {
        const imgFileName = e.target.getAttribute('data-img');
        if (imgFileName && tooltipImg && tooltip) {
            tooltipImg.src = FOLDER_PUTANJA + imgFileName; 
            tooltip.style.display = 'block';
        }
    }
});

document.addEventListener('mousemove', function(e) {
    if (tooltip && tooltip.style.display === 'block') {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('card-tooltip')) {
        if (tooltip && tooltipImg) {
            tooltip.style.display = 'none';
            tooltipImg.src = '';
        }
    }
});