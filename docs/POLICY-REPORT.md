# Laporan Rating Umur, Risiko Polisi & Cadangan

Dokumen dalaman untuk semakan sebelum penerbitan. Bukan nasihat guaman.

## 1. Penilaian rating (KINDERDY KIDS sahaja)

| Item | Nilai |
|---|---|
| Julat umur | 4–12 tahun |
| Kandungan ganas / seram / seksual / bahasa kasar | Tiada |
| Kandungan pihak ketiga (UGC, chat, pautan luar) | Tiada dalam prototaip |
| Pembelian dalam aplikasi | Direncanakan (buang iklan) — mesti di belakang parental gate |
| Iklan | Ruang disediakan, belum diaktifkan |
| Pengumpulan data | Tiada dalam prototaip (localStorage sahaja) |

**Cadangan rating:** Google Play *Everyone* / *Everyone 10+* (jika iklan diaktifkan); Apple *4+* dengan soalan “Made for Kids”.
Rating 12+ hanya jika kandungan sejarah/geografi menimbulkan tema sensitif — semak semula selepas kandungan Fasa 2.

## 2. Risiko utama

1. **Iklan kepada kanak-kanak.** Google Play Families Policy dan Apple 5.1.4 memerlukan: tiada iklan diperibadikan untuk kanak-kanak, tiada behavioral targeting, dan pengiklan disahkan mematuhi dasar keluarga. *Mitigasi:* iklan kekal OFF sehingga semakan selesai; gunakan rangkaian dengan mod “child-directed” sahaja.
2. **Pengumpulan data peribadi.** Nama panggilan + umur boleh menjadi data peribadi di bawah GDPR-K/COPPA. *Mitigasi:* simpan dalam peranti; jika awan, dapatkan persetujuan penjaga (verifiable parental consent), simpan minimum, dan sediakan pemadaman.
3. **Parental gate yang lemah.** PIN 4 digit boleh diteka oleh kanak-kanak yang memerhati. *Mitigasi:* PBKDF2 + had cubaan + kunci sementara + soalan dewasa untuk tindakan pembelian (bukan PIN sahaja).
4. **Pautan keluar.** Mana-mana pautan ke web/kedai mesti di belakang gate dan tidak boleh membuka pelayar secara automatik.
5. **Rating keseluruhan naik tanpa perlu.** Jika kandungan 13–17 dimasukkan dalam aplikasi yang sama, rating akan naik dan aplikasi kehilangan status “Made for Kids”. *Mitigasi:* asingkan produk.

## 3. Cadangan struktur produk

- **KINDERDY KIDS (4–12)** — satu aplikasi, rating keluarga. Ini yang dibina sekarang.
- **KINDERDY SUPER (13–17)** — aplikasi berasingan. Keperluan berbeza: akaun remaja, iklan mungkin dibenarkan dengan had, rating 12+/Teen.
- **KINDERDY MASTER (18+)** — aplikasi berasingan; tiada had kanak-kanak, tetapi perlu dasar privasi dewasa.

**Kesimpulan:** satu aplikasi untuk 4–12 adalah sesuai. **Jangan** gabungkan 13–17 ke dalam aplikasi yang sama — ia menaikkan rating dan menjejaskan pematuhan “Made for Kids”.

## 4. Senarai semak sebelum penerbitan

- [ ] Semakan fakta setiap nota oleh penyemak kurikulum
- [ ] Dasar privasi + terma penggunaan diterbitkan
- [ ] Aliran persetujuan penjaga (jika akaun awan diaktifkan)
- [ ] Ujian parental gate oleh kanak-kanak sebenar (bukan hanya pembangun)
- [ ] Iklan: konfigurasi child-directed + pengesahan rangkaian iklan
- [ ] Pemulihan pembelian diuji
- [ ] Ujian peranti: Android rendah, iPhone SE, tablet, desktop
- [ ] Semakan trademark “KINDERDY” selesai sebelum sebarang pendaftaran domain/aplikasi
