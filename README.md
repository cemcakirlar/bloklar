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
- `pnpm preview` - Build alıp Wrangler ile Cloudflare Worker önizlemesi açar
- `pnpm typecheck` - TypeScript tip kontrolü yapar
- `pnpm lint` - ESLint ile kod kalitesi denetimi yapar
- `pnpm lint:fix` - Uygulanabilir lint hatalarını düzeltir
- `pnpm format` - Prettier format kontrolü yapar
- `pnpm test` - Vitest birim testlerini çalıştırır
- `pnpm test:coverage` - Coverage raporuyla test çalıştırır
- `pnpm perf:budget` - Build çıktı boyutunu performans bütçesine göre doğrular
- `pnpm quality` - typecheck + lint + test + build + perf budget zincirini tek adımda çalıştırır

## 🎯 Özellikler

- Modern ve responsive tasarım
- TypeScript ile tip güvenliği
- Radix UI ile erişilebilir bileşenler
- Tailwind CSS ile özelleştirilebilir stil sistemi

## 📝 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.
