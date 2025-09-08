---
title: پشتیبانی از فارسی در GTK4
author: علی محمدی
date: 2024-01-20
tags: GTK، فارسی، UI
---

# پشتیبانی از فارسی در GTK4

GTK4 آخرین نسخه از کتابخانه محبوب GTK است که قابلیت‌های جدید بسیاری برای توسعه رابط‌های کاربری مدرن ارائه می‌دهد.

## بهبودهای مهم در GTK4

### سیستم رندر جدید
GTK4 از **GSK** (GTK Scene Kit) برای رندر استفاده می‌کند که:

- عملکرد بهتری دارد
- از GPU استفاده می‌کند
- پشتیبانی بهتر از انیمیشن‌ها

### پشتیبانی بهتر از RTL

```c
// تنظیم جهت RTL برای ویجت
gtk_widget_set_direction(widget, GTK_TEXT_DIR_RTL);

// تشخیص خودکار جهت متن
PangoDirection dir = pango_find_base_dir(text, -1);
if (dir == PANGO_DIRECTION_RTL) {
    gtk_widget_set_direction(widget, GTK_TEXT_DIR_RTL);
}
```

## مشکلات رایج و راه‌حل‌ها

### مشکل نمایش فونت‌های فارسی

یکی از مشکلات رایج در نمایش متن فارسی، **عدم اتصال صحیح حروف** است.

**راه‌حل**:

```c
// استفاده از Pango برای رندر صحیح
PangoLayout *layout = pango_cairo_create_layout(cr);
PangoFontDescription *desc = pango_font_description_from_string("Vazirmatn 12");
pango_layout_set_font_description(layout, desc);
pango_layout_set_text(layout, "متن فارسی", -1);

// تنظیم جهت RTL
pango_layout_set_auto_dir(layout, TRUE);
```

### تراز بندی عناصر

در طراحی RTL باید به نکات زیر توجه کرد:

1. **جابجایی مکان عناصر**: دکمه‌های "بله/خیر" باید جابجا شوند
2. **آیکون‌های جهت‌دار**: پیکان‌ها باید معکوس شوند
3. **مارجین و پدینگ**: left/right باید عوض شوند

### استفاده از CSS

```css
/* استایل RTL */
.rtl-layout {
    direction: rtl;
    text-align: right;
}

/* جابجایی عناصر */
.button-box.rtl {
    flex-direction: row-reverse;
}

/* آیکون‌های معکوس */
.icon-arrow.rtl {
    transform: scaleX(-1);
}
```

## مثال عملی: ایجاد فرم فارسی

```c
#include <gtk/gtk.h>

static void create_persian_form(void) {
    GtkWidget *window = gtk_window_new();
    gtk_window_set_title(GTK_WINDOW(window), "فرم نمونه");
    gtk_window_set_default_size(GTK_WINDOW(window), 400, 300);
    
    // تنظیم RTL برای پنجره
    gtk_widget_set_direction(window, GTK_TEXT_DIR_RTL);
    
    GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 10);
    gtk_window_set_child(GTK_WINDOW(window), box);
    
    // برچسب
    GtkWidget *label = gtk_label_new("نام و نام خانوادگی:");
    gtk_widget_set_halign(label, GTK_ALIGN_END);
    gtk_box_append(GTK_BOX(box), label);
    
    // ورودی متن
    GtkWidget *entry = gtk_entry_new();
    gtk_widget_set_direction(entry, GTK_TEXT_DIR_RTL);
    gtk_box_append(GTK_BOX(box), entry);
    
    // دکمه
    GtkWidget *button = gtk_button_new_with_label("ثبت");
    gtk_box_append(GTK_BOX(box), button);
    
    gtk_window_present(GTK_WINDOW(window));
}

int main(int argc, char *argv[]) {
    gtk_init();
    create_persian_form();
    
    while (g_list_model_get_n_items(gtk_window_get_toplevels()) > 0) {
        g_main_context_iteration(NULL, TRUE);
    }
    
    return 0;
}
```

## بهترین روش‌ها

### انتخاب فونت مناسب
- استفاده از فونت‌های استاندارد مثل **وزیرمتن**
- تست در اندازه‌های مختلف
- در نظر گیری فاصله خط مناسب

### طراحی ریسپانسیو
```c
// استفاده از constraint layout
GtkWidget *constraint_layout = gtk_constraint_layout_new();

// تعریف محدودیت‌ها برای RTL
GtkConstraint *constraint = gtk_constraint_new(
    target, GTK_CONSTRAINT_ATTRIBUTE_END,
    GTK_CONSTRAINT_RELATION_EQ,
    source, GTK_CONSTRAINT_ATTRIBUTE_START,
    1.0, 10.0, GTK_CONSTRAINT_STRENGTH_REQUIRED
);
```

### تست و اعتبارسنجی
- تست با متن‌های بلند فارسی
- بررسی نمایش در اندازه‌های مختلف صفحه
- تست ترکیب فارسی و انگلیسی

## منابع مفید

- [مستندات رسمی GTK4](https://docs.gtk.org/gtk4/)
- [راهنمای Pango](https://docs.gtk.org/Pango/)
- [نمونه کدهای RTL](https://github.com/gnome-farsi/gtk4-examples)

---

در مقاله بعدی به بررسی **چیدمان‌های پیچیده RTL** در GNOME Shell خواهیم پرداخت.