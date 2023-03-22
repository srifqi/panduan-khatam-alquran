let mintaHTTP1;
let daftarLabel = [];

window.addEventListener('load', () => {
	mintaHTTP1 = new XMLHttpRequest();
	mintaHTTP1.onreadystatechange = function () {
		if (mintaHTTP1.readyState === XMLHttpRequest.DONE) {
			if (mintaHTTP1.status === 200) {
				buatDaftarBaca(mintaHTTP1.responseText);
			}
		}
	}
	mintaHTTP1.open('GET', './data-panduan.json');
	mintaHTTP1.send();
	const tombolPergi = document.getElementById('tombol-pergi');
	tombolPergi.addEventListener('click', gulirKeTerpilih);
	const tombolReset = document.getElementById('tombol-reset');
	tombolReset.addEventListener('click', resetPilihan);
});

function buatDaftarBaca(teksMentah) {
	const daftarBaca = document.getElementById('daftar-baca');
	const dataPanduan = JSON.parse(teksMentah);
	daftarLabel = [];
	for (const j in dataPanduan) {
		const seksiJuz = document.createElement('section');
		const judulJuz = document.createElement('h3');
		judulJuz.innerText = `Juz ${j}`;
		const tombolKeAtas = document.createElement('button');
		tombolKeAtas.className = 'tombol-ke-atas';
		tombolKeAtas.innerText = 'Kembali ke atas';
		tombolKeAtas.addEventListener('click', () => {
			const daftarBaca = document.getElementById('daftar-baca');
			daftarBaca.scrollIntoView({ behavior: 'smooth' });
		});
		judulJuz.append(tombolKeAtas);
		seksiJuz.append(judulJuz);
		for (const k in dataPanduan[j]) {
			const potongan = dataPanduan[j][k];
			const surah = potongan[0];
			const ayat = potongan[1];
			const h0 = potongan[2];
			const h1 = potongan[3];
			const labelPotongan = document.createElement('label');
			labelPotongan.className = 'label-potongan';
			labelPotongan.id = `label-${j}-${k}`;
			labelPotongan.innerHTML = `${daftarNamaSurah[surah]} (${surah}): ${ayat} <small>Halaman ${h0}–${h1}</small>`;
			labelPotongan.addEventListener('click', ((z) => {
				return () => pilihPotongan(z);
			})(`label-${j}-${k}`));
			const opsiPotongan = document.createElement('input');
			opsiPotongan.type = 'radio';
			opsiPotongan.name = 'potongan';
			opsiPotongan.id = `potongan-${j}-${k}`;
			opsiPotongan.value = `${j}-${k}`;
			opsiPotongan.className = 'opsi-potongan';
			labelPotongan.prepend(opsiPotongan);
			seksiJuz.append(labelPotongan);
			daftarLabel.push(labelPotongan);
		}
		daftarBaca.append(seksiJuz);
	}
	pilihPotongan();
}

function pilihPotongan(_idLabel) {
	let idLabel = _idLabel;
	if (!idLabel) {
		const terakhir = localStorage.getItem('potonganTerpilih');
		if (!terakhir) {
			idLabel = '';
		} else {
			idLabel = terakhir;
		}
	}
	localStorage.setItem('potonganTerpilih', idLabel);
	let sorot = true;
	const regexId = /label-(\d+)-(\d+)/i;
	if (!regexId.test(idLabel)) {
		idLabel = '';
		sorot = false;
	}
	for (const label of daftarLabel) {
		label.className = sorot ? 'label-potongan label-sorot' : 'label-potongan';
		label.getElementsByTagName('input')[0].checked = '';
		if (label.id === idLabel) {
			label.getElementsByTagName('input')[0].checked = 'checked';
			sorot = false;
		}
	}
}

function gulirKeTerpilih() {
	const terakhir = localStorage.getItem('potonganTerpilih');
	const daftarBaca = document.getElementById('daftar-baca');
	if (!terakhir) {
		daftarBaca.scrollIntoView({ behavior: 'smooth' });
	} else {
		const labelTerpilih = daftarLabel.find(x => x.id === terakhir);
		if (labelTerpilih) {
			labelTerpilih.scrollIntoView({ behavior: 'smooth' });
		} else {
			daftarBaca.scrollIntoView({ behavior: 'smooth' });
		}
	}
}

function resetPilihan() {
	localStorage.removeItem('potonganTerpilih');
	pilihPotongan();
}

const daftarNamaSurah = {
	"1": "Al-Fātiḥah ",
	"2": "Al-Baqarah ",
	"3": "Āli ‘Imrān",
	"4": "An-Nisā' ",
	"5": "Al-Mā'idah",
	"6": "Al-An‘ām ",
	"7": "Al-A‘rāf",
	"8": "Al-Anfāl",
	"9": "At-Taubah",
	"10": "Yūnus",
	"11": "Hūd",
	"12": "Yūsuf",
	"13": "Ar-Ra‘d",
	"14": "Ibrāhīm",
	"15": "Al-Ḥijr",
	"16": "An-Naḥl",
	"17": "Al-Isrā'",
	"18": "Al-Kahf",
	"19": "Maryam",
	"20": "Ṭāhā",
	"21": "Al-Anbiyā' ",
	"22": "Al-Ḥajj",
	"23": "Al-Mu'minūn",
	"24": "An-Nūr",
	"25": "Al-Furqān",
	"26": "Asy-Syu‘arā'",
	"27": "An-Naml",
	"28": "Al-Qaṣaṣ",
	"29": "Al-‘Ankabūt",
	"30": "Ar-Rūm",
	"31": "Luqmān ",
	"32": "As-Sajdah",
	"33": "Al-Aḥzāb",
	"34": "Saba' ",
	"35": "Fāṭir",
	"36": "Yāsīn",
	"37": "Aṣ-Ṣāffāt",
	"38": "Ṣād ",
	"39": "Az-Zumar",
	"40": "Gāfir ",
	"41": "Fuṣṣilat",
	"42": "Asy-Syūrā",
	"43": "Az-Zukhruf",
	"44": "Ad-Dukhān",
	"45": "Al-Jāṡiyah",
	"46": "Al-Aḥqāf",
	"47": "Muḥammad ",
	"48": "Al-Fatḥ",
	"49": "Al-Ḥujurāt",
	"50": "Qāf",
	"51": "Aż-Żāriyāt",
	"52": "Aṭ-Ṭūr",
	"53": "An-Najm",
	"54": "Al-Qamar",
	"55": "Ar-Raḥmān",
	"56": "Al-Wāqi‘ah",
	"57": "Al-Ḥadīd",
	"58": "Al-Mujādalah",
	"59": "Al-Ḥasyr",
	"60": "Al-Mumtaḥanah",
	"61": "Aṣ-Ṣaff",
	"62": "Al-Jumu‘ah",
	"63": "Al-Munāfiqūn",
	"64": "At-Tagābun",
	"65": "Aṭ-Ṭalāq",
	"66": "At-taḥrīm",
	"67": "Al-Mulk",
	"68": "Al-Qalam",
	"69": "Al-Ḥāqqah",
	"70": "Al-Ma‘ārij",
	"71": "Nūḥ",
	"72": "Al-Jinn",
	"73": "Al-Muzzammil",
	"74": "Al-Muddaṡṡir",
	"75": "Al-Qiyāmah",
	"76": "Al-Insān",
	"77": "Al-Mursalāt",
	"78": "An-Naba'",
	"79": "An-Nāzi‘āt",
	"80": "‘Abasa",
	"81": "At-Takwīr",
	"82": "Al-Infiṭār",
	"83": "Al-Muṭaffifīn",
	"84": "Al-Insyiqāq",
	"85": "Al-Burūj",
	"86": "Aṭ-Ṭāriq",
	"87": "Al-A‘lā",
	"88": "Al-Gāsyiyah",
	"89": "Al-Fajr",
	"90": "Al-Balad",
	"91": "Asy-Syams",
	"92": "Al-Lail",
	"93": "Aḍ-Ḍuḥā",
	"94": "Asy-Syarḥ",
	"95": "At-Tīn",
	"96": "Al-‘Alaq",
	"97": "Al-Qadr",
	"98": "Al-Bayyinah",
	"99": "Az-Zalzalah",
	"100": "Al-‘Ādiyāt",
	"101": "Al-Qāri‘ah",
	"102": "At-Takāṡur",
	"103": "Al-‘Aṣr",
	"104": "Al-Humazah",
	"105": "Al-Fīl",
	"106": "Quraisy",
	"107": "Al-Mā‘ūn",
	"108": "Al-Kauṡar",
	"109": "Al-Kāfirūn",
	"110": "An-Naṣr",
	"111": "Al-Lahab",
	"112": "Al-Ikhlāṣ",
	"113": "Al-Falaq",
	"114": "An-Nās"
};
