---
title: راهنمای ترجمه نرم‌افزارهای گنوم
author: سارا نوری
date: 2024-03-01
tags: ترجمه، محلی‌سازی، فارسی
---

# راهنمای ترجمه نرم‌افزارهای گنوم

ترجمه و محلی‌سازی نرم‌افزارها نقش مهمی در دسترس‌پذیری آن‌ها برای کاربران غیرانگلیسی‌زبان دارد.

## مقدمه‌ای بر Gettext

### ساختار فایل‌های ترجمه
```
po/
├── POTFILES.in          # فهرست فایل‌های قابل ترجمه
├── fa.po               # ترجمه فارسی
└── messages.pot         # قالب اصلی ترجمه
```

### فرمت فایل PO
```po
#: gtk/gtkfilechooserwidget.c:1234
msgid "Open"
msgstr "باز کردن"

#: gtk/gtkfilechooserwidget.c:1245
msgid "Save"
msgstr "ذخیره"
```

## اصول ترجمه کیفی

### سازگاری با زبان طبیعی
```po
# بد ❌
msgid "Apply"
msgstr "اعمال کردن"

# خوب ✅
msgid "Apply"
msgstr "اعمال"
```

### مدیریت جمع و مفرد
```po
#, c-format
msgid "%d file selected"
msgid_plural "%d files selected"
msgstr[0] "%Id پرونده انتخاب شده"
msgstr[1] "%Id پرونده انتخاب شده"
```

## ابزارهای ترجمه

### Poedit و Gtranslator
```bash
# نصب ابزارها
sudo apt install poedit gtranslator

# بررسی صحت فایل
msgfmt -cv fa.po

# آمار ترجمه
msgfmt --statistics fa.po
```

## منابع مفید

- [مستندات Gettext](https://www.gnu.org/software/gettext/)
- [راهنمای ترجمه گنوم](https://wiki.gnome.org/TranslationProject)
- [استانداردهای محلی‌سازی](https://www.unicode.org/cldr/)

---

ترجمه کیفی نیاز به دقت، صبر و آشنایی با فرهنگ کاربران دارد.