# 🔗 Symlink Manager

<div align="center">

![Symlink Manager](https://img.shields.io/badge/Windows-Symlink%20Manager-6366f1?style=for-the-badge&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-40.x-47848F?style=for-the-badge&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Windows için modern, kullanıcı dostu sembolik link yönetim uygulaması**

</div>

---

## ✨ Özellikler

- 🔍 **Dizin Tarama** - Herhangi bir klasördeki sembolik linkleri otomatik tespit
- ➕ **Symlink Oluşturma** - Dosya veya klasör için yeni sembolik link oluştur
- 🗑️ **Symlink Silme** - Mevcut symlink'leri güvenle kaldır
- ⚠️ **Kırık Link Tespiti** - Hedefi olmayan symlink'leri otomatik işaretle
- 📊 **İstatistikler** - Toplam, geçerli ve kırık link sayılarını görüntüle
- 🌙 **Modern Dark UI** - Göz yormayan şık karanlık tema

---

## 📸 Ekran Görüntüsü

<div align="center">
<img src="docs/screenshot.png" alt="Symlink Manager Screenshot" width="800">
</div>

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

```bash
# Repoyu klonla
git clone https://github.com/KULLANICI_ADI/symlink-manager.git

# Dizine gir
cd symlink-manager

# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm run electron:dev
```

---

## 📦 Kullanım

### Hızlı Başlangıç

1. **Dizin Seç** butonuna tıklayın
2. Taramak istediğiniz klasörü seçin
3. Mevcut sembolik linkler otomatik listelenecek

### Yeni Symlink Oluşturma

1. **+ Yeni Symlink** butonuna tıklayın
2. Link türünü seçin (Dosya/Klasör)
3. Hedef dosya/klasörü seçin
4. Symlink'in oluşturulacağı konumu belirleyin
5. **Symlink Oluştur** butonuna tıklayın

---

## 🛠️ Geliştirme

```bash
# Development modunda çalıştır
npm run electron:dev

# Sadece web UI (tarayıcıda)
npm run dev

# Lint kontrolü
npm run lint

# Production build
npm run electron:build
```

---

## 📁 Proje Yapısı

```
symlink-manager/
├── electron/           # Electron ana süreç dosyaları
│   ├── main.js         # Ana süreç
│   ├── preload.js      # IPC köprüsü
│   └── symlink-service.js  # Symlink işlemleri
├── src/                # React uygulaması
│   ├── App.tsx         # Ana komponent
│   ├── index.css       # Stiller
│   └── main.tsx        # Entry point
├── package.json
└── vite.config.ts
```

---

## ⚠️ Önemli Notlar

- **Yönetici Yetkileri**: Windows'ta dosya symlink'leri için yönetici yetkileri gerekebilir
- **Junction**: Klasör symlink'leri için `junction` kullanılır (yönetici gerektirmez)
- **DevTools**: Geliştirici araçlarını açmak için `Ctrl+Shift+I` kullanın

---

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

</div>
