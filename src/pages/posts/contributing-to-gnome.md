---
title: راهنمای مشارکت در پروژه گنوم
author: حسین احمدی
date: 2024-02-12
tags: مشارکت، توسعه، گنوم
---

# راهنمای مشارکت در پروژه گنوم

مشارکت در پروژه‌های آزاد یکی از بهترین راه‌ها برای یادگیری و کمک به جامعه است. در این راهنما نحوه مشارکت در پروژه گنوم را آموزش می‌دهیم.

## مراحل شروع

### 1. آشنایی با پروژه

قبل از شروع، باید با ساختار پروژه آشنا شوید:

```bash
# کلون کردن پروژه
git clone https://gitlab.gnome.org/GNOME/gtk.git
cd gtk

# مطالعه مستندات
ls docs/
cat README.md
cat CONTRIBUTING.md
```

### 2. نصب محیط توسعه

```bash
# نصب ابزارهای مورد نیاز (Ubuntu/Debian)
sudo apt update
sudo apt install build-essential git meson ninja-build

# نصب وابستگی‌های GTK
sudo apt install libglib2.0-dev libcairo-dev libpango1.0-dev \
                 libgdk-pixbuf2.0-dev libatk1.0-dev

# نصب ابزارهای اضافی
sudo apt install glade gtk-doc-tools
```

### 3. بیلد کردن پروژه

```bash
# ایجاد پوشه بیلد
meson setup builddir
cd builddir

# کامپایل
ninja

# تست
ninja test
```

## انواع مشارکت

### برنامه‌نویسی

#### رفع باگ
1. پیدا کردن باگ در [GitLab Issues](https://gitlab.gnome.org/GNOME/gtk/-/issues)
2. بررسی کد و پیدا کردن علت
3. نوشتن پچ
4. ارسال Merge Request

```bash
# ایجاد برنچ جدید
git checkout -b fix-rtl-button-alignment

# انجام تغییرات
# ویرایش فایل‌ها...

# کامیت تغییرات
git add .
git commit -m "fix: RTL alignment for buttons in dialogs

Fixes issue where buttons were incorrectly aligned
in RTL mode. Now uses proper text direction detection.

Fixes: #1234"

# پوش کردن برنچ
git push origin fix-rtl-button-alignment
```

#### افزودن ویژگی جدید
```c
// مثال: افزودن پشتیبانی بهتر از فارسی
// در فایل gtk/gtkentry.c

static void
gtk_entry_update_text_direction (GtkEntry *entry)
{
    GtkEntryPrivate *priv = gtk_entry_get_instance_private (entry);
    const char *text = gtk_editable_get_text (GTK_EDITABLE (entry));
    
    // تشخیص خودکار جهت متن فارسی
    if (text && g_utf8_strlen (text, -1) > 0) {
        PangoDirection dir = pango_find_base_dir (text, -1);
        
        if (dir == PANGO_DIRECTION_RTL) {
            gtk_widget_set_direction (GTK_WIDGET (entry), GTK_TEXT_DIR_RTL);
            // تنظیم تراز متن به راست
            gtk_editable_set_alignment (GTK_EDITABLE (entry), 1.0);
        } else {
            gtk_widget_set_direction (GTK_WIDGET (entry), GTK_TEXT_DIR_LTR);
            gtk_editable_set_alignment (GTK_EDITABLE (entry), 0.0);
        }
    }
}

// اتصال به سیگنال تغییر متن
g_signal_connect (entry, "notify::text",
                  G_CALLBACK (gtk_entry_update_text_direction), NULL);
```

### ترجمه و محلی‌سازی

#### ترجمه رابط کاربری
```bash
# دانلود فایل‌های ترجمه
git clone https://gitlab.gnome.org/GNOME/gtk.git
cd gtk/po

# ویرایش فایل فارسی
nano fa.po

# بررسی صحت ترجمه
msgfmt -cv fa.po
```

#### نمونه ترجمه:
```po
# فایل po/fa.po
#: gtk/gtkfilechooserwidget.c:1234
msgid "Open"
msgstr "باز کردن"

#: gtk/gtkfilechooserwidget.c:1245
msgid "Save"
msgstr "ذخیره"

#: gtk/gtkfilechooserwidget.c:1256
#, c-format
msgid "Save as %s"
msgstr "ذخیره به‌عنوان %s"
```

### طراحی و گرافیک

#### ایجاد آیکون
```bash
# نصب Inkscape
sudo apt install inkscape

# باز کردن قالب آیکون گنوم
inkscape /usr/share/icons/Adwaita/scalable/actions/document-open-symbolic.svg
```

#### استانداردهای طراحی آیکون:
- **اندازه**: 16×16 تا 512×512 پیکسل
- **فرمت**: SVG (برای symbolic) یا PNG
- **رنگ**: تک‌رنگ برای symbolic icons
- **سبک**: مطابق با [GNOME HIG](https://developer.gnome.org/hig/)

### تست و کیفیت‌سنجی

#### نوشتن تست
```c
// tests/test-rtl-support.c
#include <gtk/gtk.h>

static void
test_entry_rtl_alignment (void)
{
    GtkWidget *entry = gtk_entry_new ();
    
    // تنظیم متن فارسی
    gtk_editable_set_text (GTK_EDITABLE (entry), "سلام دنیا");
    
    // بررسی جهت ویجت
    g_assert_cmpint (gtk_widget_get_direction (entry), ==, GTK_TEXT_DIR_RTL);
    
    // بررسی تراز متن
    gfloat alignment = gtk_editable_get_alignment (GTK_EDITABLE (entry));
    g_assert_cmpfloat (alignment, ==, 1.0);
    
    gtk_widget_destroy (entry);
}

int
main (int argc, char **argv)
{
    gtk_test_init (&argc, &argv, NULL);
    
    g_test_add_func ("/entry/rtl-alignment", test_entry_rtl_alignment);
    
    return g_test_run ();
}
```

#### اجرای تست‌ها
```bash
# اجرای همه تست‌ها
ninja test

# اجرای تست خاص
ninja test --suite rtl

# تست با valgrind
meson test --wrap='valgrind --leak-check=full'
```

## فرآیند Code Review

### آماده‌سازی MR
1. **کامیت‌های منظم**: هر کامیت باید یک تغییر منطقی داشته باشد
2. **پیام کامیت واضح**: با فرمت استاندارد
3. **تست کردن**: همه تست‌ها باید پاس شوند
4. **مستندسازی**: تغییرات مهم باید مستند شوند

### نمونه Merge Request
```markdown
## خلاصه تغییرات
افزودن پشتیبانی خودکار از جهت متن فارسی در GtkEntry

## تغییرات انجام شده
- تشخیص خودکار جهت متن با Pango
- تنظیم خودکار تراز متن
- افزودن تست‌های مربوطه

## تست شده
- [x] تست‌های موجود پاس می‌شوند
- [x] تست‌های جدید اضافه شده
- [x] با متن‌های فارسی و عربی تست شده

## اسکرین‌شات
![before](before.png)
![after](after.png)

## مرتبط با
Fixes #1234
Related to #5678
```

## نکات مهم

### کیفیت کد
```c
// خوب ✅
static gboolean
is_rtl_text (const char *text)
{
    g_return_val_if_fail (text != NULL, FALSE);
    
    PangoDirection dir = pango_find_base_dir (text, -1);
    return dir == PANGO_DIRECTION_RTL;
}

// بد ❌
static int check_text(char* t) {
    return pango_find_base_dir(t,-1)==PANGO_DIRECTION_RTL?1:0;
}
```

### مدیریت پچ‌ها
```bash
# ایجاد پچ از کامیت‌ها
git format-patch HEAD~3  # ۳ کامیت آخر

# اعمال پچ
git apply 0001-fix-rtl-support.patch

# ایجاد پچ برای ایمیل
git send-email --to=gtk-devel-list@gnome.org 0001-fix-rtl-support.patch
```

## منابع مفید

### مستندات
- [GNOME Developer Documentation](https://developer.gnome.org/)
- [GTK Documentation](https://docs.gtk.org/)
- [Meson Build System](https://mesonbuild.com/)

### ابزارها
- **Builder**: IDE مخصوص GNOME
- **Glade**: طراح رابط کاربری
- **d-feet**: مشاهده D-Bus
- **GtkInspector**: دیباگ رابط کاربری

### کانال‌های ارتباطی
- **Matrix**: #gtk:gnome.org
- **IRC**: #gtk+ on irc.gnome.org
- **Discourse**: https://discourse.gnome.org/

---

**نکته**: مشارکت در پروژه‌های آزاد نیاز به صبر و تمرین دارد. شروع کنید و به تدریج مهارت‌هایتان را افزایش دهید!