---
title: رندر متن فارسی با Pango
author: مهدی رضایی
date: 2024-02-18
tags: Pango، فونت، رندرینگ
---

# رندر متن فارسی با Pango

Pango کتابخانه قدرتمندی برای رندر متن در نرم‌افزارهای گنوم است که پشتیبانی عالی از زبان‌های پیچیده مثل فارسی دارد.

## معرفی Pango

### ویژگی‌های کلیدی
- **پشتیبانی کامل از Unicode**
- **رندر زبان‌های پیچیده** (عربی، فارسی، هندی و...)
- **مدیریت جهت متن** (LTR/RTL/Mixed)
- **تنظیمات پیشرفته فونت**
- **پشتیبانی از OpenType features**

### معماری Pango
```
Application Layer
       ↓
  PangoLayout (چیدمان متن)
       ↓
  PangoGlyph (شکل‌های حروف)
       ↓
  FontConfig (مدیریت فونت)
       ↓
   FreeType (رندر فونت)
```

## مبانی کار با Pango

### ایجاد Layout ساده
```c
#include <pango/pangocairo.h>

void render_persian_text(cairo_t *cr, const char *text)
{
    // ایجاد layout
    PangoLayout *layout = pango_cairo_create_layout(cr);
    
    // تنظیم متن
    pango_layout_set_text(layout, text, -1);
    
    // تنظیم فونت
    PangoFontDescription *desc = pango_font_description_from_string("Vazirmatn 16");
    pango_layout_set_font_description(layout, desc);
    
    // تشخیص خودکار جهت
    pango_layout_set_auto_dir(layout, TRUE);
    
    // رندر
    pango_cairo_show_layout(cr, layout);
    
    // تمیز کردن
    pango_font_description_free(desc);
    g_object_unref(layout);
}
```

### کنترل دقیق جهت متن
```c
void setup_rtl_layout(PangoLayout *layout, const char *text)
{
    // تنظیم متن
    pango_layout_set_text(layout, text, -1);
    
    // تشخیص جهت متن
    PangoDirection base_dir = pango_find_base_dir(text, -1);
    
    if (base_dir == PANGO_DIRECTION_RTL) {
        // تنظیم تراز راست
        pango_layout_set_alignment(layout, PANGO_ALIGN_RIGHT);
        
        // تنظیم جهت paragraph
        PangoContext *context = pango_layout_get_context(layout);
        pango_context_set_base_dir(context, PANGO_DIRECTION_RTL);
    }
}
```

## کار با فونت‌های پیچیده

### انتخاب فونت بهینه
```c
// جستجوی فونت با پشتیبانی فارسی
PangoFontFamily **families;
int n_families;
PangoFontMap *fontmap = pango_cairo_font_map_get_default();

pango_font_map_list_families(fontmap, &families, &n_families);

for (int i = 0; i < n_families; i++) {
    const char *family_name = pango_font_family_get_name(families[i]);
    
    // بررسی پشتیبانی از فارسی
    if (supports_persian_script(families[i])) {
        printf("فونت پشتیبان فارسی: %s\n", family_name);
    }
}

g_free(families);
```

### تنظیمات OpenType
```c
void setup_persian_typography(PangoLayout *layout)
{
    PangoAttrList *attrs = pango_attr_list_new();
    
    // فعال‌سازی ligature های فارسی
    PangoAttribute *feature_attr = pango_attr_font_features_new("liga=1,calt=1,kern=1");
    pango_attr_list_insert(attrs, feature_attr);
    
    // تنظیم variant
    PangoAttribute *variant_attr = pango_attr_variant_new(PANGO_VARIANT_NORMAL);
    pango_attr_list_insert(attrs, variant_attr);
    
    pango_layout_set_attributes(layout, attrs);
    pango_attr_list_unref(attrs);
}
```

## رندر متن ترکیبی (فارسی + انگلیسی)

### مدیریت جهت در متن ترکیبی
```c
void render_mixed_text(cairo_t *cr)
{
    const char *mixed_text = "این متن فارسی است with English words و ادامه فارسی";
    
    PangoLayout *layout = pango_cairo_create_layout(cr);
    pango_layout_set_text(layout, mixed_text, -1);
    
    // تنظیم عرض layout
    pango_layout_set_width(layout, 400 * PANGO_SCALE);
    
    // تنظیم wrap mode
    pango_layout_set_wrap(layout, PANGO_WRAP_WORD_CHAR);
    
    // تنظیم تراز برای متن ترکیبی
    pango_layout_set_alignment(layout, PANGO_ALIGN_RIGHT);
    
    // رندر
    pango_cairo_show_layout(cr, layout);
    g_object_unref(layout);
}
```

### رنگ‌آمیزی بخش‌های مختلف
```c
void colorize_text_parts(PangoLayout *layout, const char *text)
{
    PangoAttrList *attrs = pango_attr_list_new();
    
    // پیدا کردن بخش‌های انگلیسی
    const char *ptr = text;
    int start_index = 0;
    
    while (*ptr) {
        if (is_english_char(*ptr)) {
            int end_index = start_index;
            
            // پیدا کردن انتهای بخش انگلیسی
            while (*ptr && is_english_char(*ptr)) {
                ptr++;
                end_index++;
            }
            
            // رنگ آبی برای انگلیسی
            PangoAttribute *color_attr = pango_attr_foreground_new(0x3584e4, 0x3584e4, 0x3584e4);
            color_attr->start_index = start_index;
            color_attr->end_index = end_index;
            pango_attr_list_insert(attrs, color_attr);
        } else {
            ptr++;
        }
        start_index++;
    }
    
    pango_layout_set_attributes(layout, attrs);
    pango_attr_list_unref(attrs);
}
```

## بهینه‌سازی عملکرد

### کش کردن Layout
```c
// نگهداری cache برای layout های پرکاربرد
static GHashTable *layout_cache = NULL;

PangoLayout* get_cached_layout(cairo_t *cr, const char *text, const char *font_desc)
{
    if (!layout_cache) {
        layout_cache = g_hash_table_new_full(g_str_hash, g_str_equal, g_free, g_object_unref);
    }
    
    // ایجاد کلید cache
    char *cache_key = g_strdup_printf("%s:%s", text, font_desc);
    
    PangoLayout *layout = g_hash_table_lookup(layout_cache, cache_key);
    
    if (!layout) {
        // ایجاد layout جدید
        layout = pango_cairo_create_layout(cr);
        pango_layout_set_text(layout, text, -1);
        
        PangoFontDescription *desc = pango_font_description_from_string(font_desc);
        pango_layout_set_font_description(layout, desc);
        pango_font_description_free(desc);
        
        // افزودن به cache
        g_hash_table_insert(layout_cache, g_strdup(cache_key), g_object_ref(layout));
    }
    
    g_free(cache_key);
    return layout;
}
```

### رندر تنبل (Lazy Rendering)
```c
typedef struct {
    PangoLayout *layout;
    cairo_surface_t *cached_surface;
    gboolean is_dirty;
    int cached_width;
    int cached_height;
} TextRenderer;

void text_renderer_render(TextRenderer *renderer, cairo_t *cr, int x, int y)
{
    if (renderer->is_dirty || !renderer->cached_surface) {
        // محاسبه اندازه متن
        pango_layout_get_pixel_size(renderer->layout, 
                                   &renderer->cached_width, 
                                   &renderer->cached_height);
        
        // ایجاد surface جدید
        if (renderer->cached_surface) {
            cairo_surface_destroy(renderer->cached_surface);
        }
        
        renderer->cached_surface = cairo_image_surface_create(
            CAIRO_FORMAT_ARGB32,
            renderer->cached_width,
            renderer->cached_height
        );
        
        cairo_t *cache_cr = cairo_create(renderer->cached_surface);
        pango_cairo_show_layout(cache_cr, renderer->layout);
        cairo_destroy(cache_cr);
        
        renderer->is_dirty = FALSE;
    }
    
    // رسم surface کش شده
    cairo_set_source_surface(cr, renderer->cached_surface, x, y);
    cairo_paint(cr);
}
```

## ترفندهای پیشرفته

### اندازه‌گیری دقیق متن
```c
void get_text_metrics(PangoLayout *layout, TextMetrics *metrics)
{
    PangoRectangle ink_rect, logical_rect;
    
    // اندازه‌گیری دقیق
    pango_layout_get_pixel_extents(layout, &ink_rect, &logical_rect);
    
    metrics->width = logical_rect.width;
    metrics->height = logical_rect.height;
    metrics->baseline = PANGO_PIXELS(pango_layout_get_baseline(layout));
    
    // محاسبه descent
    PangoLayoutIter *iter = pango_layout_get_iter(layout);
    metrics->descent = logical_rect.height - metrics->baseline;
    pango_layout_iter_free(iter);
}
```

### رندر با تأثیرات بصری
```c
void render_text_with_shadow(cairo_t *cr, PangoLayout *layout, int x, int y)
{
    // رسم سایه
    cairo_save(cr);
    cairo_set_source_rgba(cr, 0, 0, 0, 0.3);
    cairo_translate(cr, x + 2, y + 2);
    pango_cairo_show_layout(cr, layout);
    cairo_restore(cr);
    
    // رسم متن اصلی
    cairo_save(cr);
    cairo_set_source_rgb(cr, 0, 0, 0);
    cairo_translate(cr, x, y);
    pango_cairo_show_layout(cr, layout);
    cairo_restore(cr);
}
```

### پشتیبانی از Emoji
```c
void setup_emoji_support(PangoLayout *layout)
{
    PangoAttrList *attrs = pango_attr_list_new();
    
    // فعال‌سازی فونت‌های emoji
    PangoAttribute *family_attr = pango_attr_family_new("Noto Color Emoji, Vazirmatn");
    pango_attr_list_insert(attrs, family_attr);
    
    // تنظیم fallback
    PangoAttribute *fallback_attr = pango_attr_fallback_new(TRUE);
    pango_attr_list_insert(attrs, fallback_attr);
    
    pango_layout_set_attributes(layout, attrs);
    pango_attr_list_unref(attrs);
}
```

## تست و دیباگ

### ابزارهای مفید
```bash
# مشاهده فونت‌های نصب شده
fc-list :lang=fa

# تست رندر فونت
pango-view --font="Vazirmatn 16" --text="سلام دنیا" --output=test.png

# اطلاعات فونت
fc-query /path/to/font.ttf
```

### مثال کامل: ویژت متن فارسی
```c
// persian-text-widget.c
#include <gtk/gtk.h>

typedef struct {
    GtkWidget parent_instance;
    char *text;
    PangoLayout *layout;
    gboolean auto_direction;
} PersianTextWidget;

G_DEFINE_TYPE(PersianTextWidget, persian_text_widget, GTK_TYPE_WIDGET)

static void
persian_text_widget_snapshot(GtkWidget *widget, GtkSnapshot *snapshot)
{
    PersianTextWidget *self = PERSIAN_TEXT_WIDGET(widget);
    
    if (!self->layout) return;
    
    graphene_rect_t bounds;
    gtk_widget_get_bounds(widget, &bounds);
    
    // ایجاد cairo context
    cairo_t *cr = gtk_snapshot_append_cairo(snapshot, &bounds);
    
    // رندر متن
    if (self->auto_direction) {
        setup_rtl_layout(self->layout, self->text);
    }
    
    pango_cairo_show_layout(cr, self->layout);
    cairo_destroy(cr);
}

static void
persian_text_widget_init(PersianTextWidget *self)
{
    self->auto_direction = TRUE;
}

// توابع public
void persian_text_widget_set_text(PersianTextWidget *widget, const char *text)
{
    g_return_if_fail(PERSIAN_IS_TEXT_WIDGET(widget));
    
    g_free(widget->text);
    widget->text = g_strdup(text);
    
    if (widget->layout) {
        pango_layout_set_text(widget->layout, text, -1);
    }
    
    gtk_widget_queue_draw(GTK_WIDGET(widget));
}
```

## منابع و مراجع

- [مستندات رسمی Pango](https://docs.gtk.org/Pango/)
- [Unicode Standard](https://unicode.org/standard/standard.html)
- [OpenType Features](https://docs.microsoft.com/en-us/typography/opentype/spec/features_pt)
- [FontConfig Manual](https://www.freedesktop.org/software/fontconfig/fontconfig-user.html)

---

در مقاله بعدی به **راهنمای ترجمه نرم‌افزارهای گنوم** خواهیم پرداخت.