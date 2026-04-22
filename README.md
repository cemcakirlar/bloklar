# Bloklar

Modern web teknolojileri kullanılarak geliştirilmiş, Vite tabanlı bir web uygulaması.

## 🚀 Teknolojiler

- [Vite](https://vitejs.dev/) - Ön uç build aracı ve geliştirme sunucusu
- [React 19](https://react.dev/) - UI kütüphanesi
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenli JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Erişilebilir UI bileşenleri

## 🛠️ Kurulum

1. Projeyi klonlayın:

```bash
git clone https://github.com/cemcakirlar/bloklar.git
cd bloklar
```

2. Bağımlılıkları yükleyin:

```bash
pnpm install
```

3. Geliştirme sunucusunu başlatın:

```bash
pnpm dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📦 Scripts

- `pnpm dev` - Geliştirme sunucusunu başlatır
- `pnpm build` - Üretim için `dist/` klasörüne build alır
- `pnpm preview` - Build çıktısını yerel olarak önizler
- `pnpm typecheck` - TypeScript tip kontrolü yapar
- `npm run lint` - ESLint ile kod kalitesi denetimi yapar
- `npm run lint:fix` - Uygulanabilir lint hatalarını düzeltir
- `npm run format` - Prettier format kontrolü yapar
- `npm run test` - Vitest birim testlerini çalıştırır
- `npm run test:coverage` - Coverage raporuyla test çalıştırır
- `npm run perf:budget` - Build çıktı boyutunu performans bütçesine göre doğrular
- `npm run quality` - typecheck + lint + test + build + perf budget zincirini tek adımda çalıştırır

## 🎯 Özellikler

- Modern ve responsive tasarım
- TypeScript ile tip güvenliği
- Radix UI ile erişilebilir bileşenler
- Tailwind CSS ile özelleştirilebilir stil sistemi

## 📝 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.
