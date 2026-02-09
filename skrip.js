let mintaHTTP1;
let dataPanduanTermuat = {};
let daftarLabel = [];
let cetakanTerpilih = null;

window.addEventListener('load', () => {
	const pilihCetakan = document.getElementById('pilih-cetakan');
	pilihCetakan.addEventListener('input', aturCetakan);
	const tombolPergi = document.getElementById('tombol-pergi');
	tombolPergi.addEventListener('click', gulirKeTerpilih);
	const tombolReset = document.getElementById('tombol-reset');
	tombolReset.addEventListener('click', resetPilihan);

	cetakanTerpilih = localStorage.getItem('cetakanTerpilih');
	if (!cetakanTerpilih) {
		cetakanTerpilih = pilihCetakan.value;
	}
	pilihCetakan.value = cetakanTerpilih;
	localStorage.setItem('cetakanTerpilih', cetakanTerpilih);

	ambilDataPanduan();
});

function ambilDataPanduan() {
	if (dataPanduanTermuat.hasOwnProperty(cetakanTerpilih)) {
		buatDaftarBaca(dataPanduanTermuat[cetakanTerpilih]);
		return
	}
	mintaHTTP1 = new XMLHttpRequest();
	mintaHTTP1.onreadystatechange = () => {
		if (mintaHTTP1.readyState === XMLHttpRequest.DONE) {
			if (mintaHTTP1.status === 200) {
				const dataMentah = JSON.parse(mintaHTTP1.responseText);
				const dataTerolah = [];
				for (const j in dataMentah) {
					const juz = Number(j);
					let i = 0;
					for (const p of dataMentah[j]) {
						dataTerolah.push([juz, i ++, p[0], p[1], p[2], p[3]]);
					}
				}
				dataPanduanTermuat[cetakanTerpilih] = dataTerolah;
				buatDaftarBaca(dataPanduanTermuat[cetakanTerpilih]);
			}
		}
	};
	mintaHTTP1.open('GET', `./data-panduan/${cetakanTerpilih}.json`);
	mintaHTTP1.send();
	const daftarBaca = document.getElementById('daftar-baca');
	daftarBaca.replaceChildren();
	const pesanAmbilData = document.createElement('p');
	pesanAmbilData.innerHTML = 'Data panduan sedang diunduh ....';
	daftarBaca.append(pesanAmbilData);
}

function buatDaftarBaca(dataPanduan) {
	const daftarBaca = document.getElementById('daftar-baca');
	let sudahAtTaubah = false;
	daftarBaca.replaceChildren();
	daftarLabel = [];
	let seksiHari = '';
	let judulJuz = document.createElement('small');
	let hariKe = 0;
	let h = 0;
	let juzMulai = 1;
	let juzSebelum = 1;
	for (let i = 0; i < dataPanduan.length; i ++) {
		const ii = i % dataPanduan.length;
		const potongan = dataPanduan[ii];
		const juz = potongan[0];
		const k = potongan[1];
		const surah = potongan[2];
		const ayat = potongan[3];
		const h0 = potongan[4];
		const h1 = potongan[5];
		if (h == 0 || h == 5) {
			if (juzMulai != juzSebelum) {
				judulJuz.innerText += `–${juzSebelum}`;
			}
			if (judulJuz.innerText != '') {
				judulJuz.innerText = `(${judulJuz.innerText})`;
			}
			daftarBaca.append(seksiHari);
			seksiHari = document.createElement('section');
			const judulHari = document.createElement('h3');
			judulHari.innerText = `Hari Ke-${++ hariKe}`;
			judulJuz = document.createElement('small');
			judulJuz.className = 'judul-juz';
			judulJuz.innerText = `Juz ${juz}`;
			judulHari.append(judulJuz)
			const tombolKeAtas = document.createElement('button');
			tombolKeAtas.className = 'tombol-ke-atas';
			tombolKeAtas.innerText = 'Kembali ke atas';
			tombolKeAtas.addEventListener('click', () => {
				const daftarBaca = document.getElementById('daftar-baca');
				daftarBaca.scrollIntoView({ behavior: 'smooth' });
			});
			judulHari.append(tombolKeAtas);
			seksiHari.append(judulHari);
			juzMulai = juz;
			h = 0;
		}
		if (!sudahAtTaubah && surah >= 9) {
			const paragrafAtTaubah = document.createElement('p');
			paragrafAtTaubah.className = 'label-potongan';
			paragrafAtTaubah.id = 'paragraf-at-taubah';
			paragrafAtTaubah.innerHTML = '<span class="emoji">⚠</span> Dianjurkan tidak mengawali At-Taubah dengan basmalah.';
			seksiHari.append(paragrafAtTaubah);
			sudahAtTaubah = true;
		}
		const labelPotongan = document.createElement('label');
		labelPotongan.className = 'label-potongan';
		labelPotongan.id = `label-${juz}-${k}`;
		labelPotongan.innerHTML = `${daftarNamaSurah[surah]} (${surah}): ${ayat} <small>Halaman ${h0}–${h1}</small>`;
		labelPotongan.addEventListener('click', ((z) => {
			return () => pilihPotongan(z);
		})(`label-${juz}-${k}`));
		const opsiPotongan = document.createElement('input');
		opsiPotongan.type = 'radio';
		opsiPotongan.name = 'potongan';
		opsiPotongan.id = `potongan-${juz}-${k}`;
		opsiPotongan.value = `${juz}-${k}`;
		opsiPotongan.className = 'opsi-potongan';
		labelPotongan.prepend(opsiPotongan);
		seksiHari.append(labelPotongan);
		daftarLabel.push(labelPotongan);
		juzSebelum = juz;
		h ++;
	}
	if (juzMulai != juzSebelum) {
		judulJuz.innerText += `–${juzSebelum}`;
	}
	if (judulJuz.innerText != '') {
		judulJuz.innerText = `(${judulJuz.innerText})`;
	}
	daftarBaca.append(seksiHari);
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

function aturCetakan() {
	const pilihCetakan = document.getElementById('pilih-cetakan');
	if (pilihCetakan.value == cetakanTerpilih) {
		return;
	}
	if (localStorage.getItem('potonganTerpilih').length > 0 &&
			!confirm('Ubah cetakan terpilih? Capaian baca akan dihapus.')) {
		cetakanTerpilih = localStorage.getItem('cetakanTerpilih');
		if (cetakanTerpilih) {
			pilihCetakan.value = cetakanTerpilih;
		}
		return;
	}
	cetakanTerpilih = pilihCetakan.value;
	localStorage.setItem('cetakanTerpilih', cetakanTerpilih);
	localStorage.removeItem('potonganTerpilih');
	ambilDataPanduan();
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
	if (!confirm('Reset capaian baca? Capaian baca akan dihapus.')) {
		return;
	}
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
