---
title: طراحی رابط کاربری راست‌به‌چپ در GNOME Shell
author: فاطمه کریمی
date: 2024-02-05
tags: GNOME Shell، RTL، طراحی
---

# طراحی رابط کاربری راست‌به‌چپ در GNOME Shell

GNOME Shell محیط دسکتاپ مدرن و زیبای گنوم است که طراحی آن برای پشتیبانی از زبان‌های راست‌به‌چپ چالش‌های خاصی دارد.

## اصول طراحی RTL

### جهت‌گیری بصری
در طراحی RTL باید به نکات زیر توجه کرد:

- **جریان بصری** از راست به چپ
- **موقعیت عناصر تعاملی** در سمت راست
- **آیکون‌های جهت‌دار** باید معکوس شوند

### چیدمان عناصر

```javascript
// در GNOME Shell (GJS)
const rtlBox = new St.BoxLayout({
    style_class: 'rtl-container',
    pack_start: false,  // شروع از راست
    x_align: Clutter.ActorAlign.END
});

// افزودن عناصر به ترتیب RTL
rtlBox.add_child(closeButton);
rtlBox.add_child(minimizeButton);
rtlBox.add_child(titleLabel);
```

## چالش‌های رایج

### 1. نوار بالا (Top Bar)

نوار بالا در حالت RTL باید تغییرات زیر را داشته باشد:

```css
/* استایل RTL برای نوار بالا */
.panel.rtl {
    direction: rtl;
}

.panel.rtl .panel-corner {
    -panel-corner-radius: 0px 0px 0px 6px;
}

.panel.rtl .panel-button {
    padding: 0 8px 0 4px; /* معکوس شده */
}
```

### 2. منوی برنامه‌ها (App Grid)

```javascript
// تنظیم چیدمان grid برای RTL
const appGrid = new IconGrid.IconGrid({
    allow_incomplete_pages: false,
    fillParent: true,
    rtl: true  // فعال‌سازی حالت RTL
});

// تنظیم جهت صفحه‌بندی
if (this.textDirection === Clutter.TextDirection.RTL) {
    this._grid.set_layout_manager(new Clutter.GridLayout({
        orientation: Clutter.Orientation.HORIZONTAL,
        row_spacing: this._spacing,
        column_spacing: this._spacing
    }));
}
```

### 3. پنجره‌های Overview

```css
/* تنظیمات RTL برای overview */
.window-picker.rtl {
    padding: 0 24px 0 0; /* فاصله از سمت راست */
}

.window-clone.rtl {
    border-radius: 8px 8px 0px 8px; /* گوشه‌های مناسب RTL */
}

.workspace-thumbnail.rtl {
    margin: 0 0 12px 12px;
}
```

## پیاده‌سازی تم RTL

### ساختار فایل‌های CSS

```
theme/
├── gnome-shell.css
├── gnome-shell-rtl.css    // تم RTL
└── assets/
    ├── icons/
    │   ├── arrow-left.svg
    │   └── arrow-right.svg
    └── backgrounds/
```

### مثال کامل تم RTL

```css
/* gnome-shell-rtl.css */

/* متغیرهای RTL */
:root {
    --rtl-padding-start: 12px;
    --rtl-padding-end: 6px;
    --rtl-margin-start: 8px;
    --rtl-margin-end: 0px;
}

/* پنل اصلی */
#panel {
    direction: rtl;
    font-family: 'Vazirmatn', sans-serif;
}

#panel .panel-corner {
    -panel-corner-background-color: rgba(0, 0, 0, 0.8);
    -panel-corner-border-width: 2px;
    -panel-corner-border-color: rgba(255, 255, 255, 0.1);
    -panel-corner-radius: 0px 0px 0px 6px;
}

/* منوی کاربر */
#panel .panel-button.user-menu {
    padding: 0 var(--rtl-padding-start) 0 var(--rtl-padding-end);
}

/* تقویم */
.calendar {
    direction: rtl;
    text-align: right;
}

.calendar-month-label {
    font-family: 'Vazirmatn', sans-serif;
    font-weight: bold;
}

.calendar-day-base {
    text-align: center;
    width: 2.4em;
    height: 2.4em;
}

/* پیام‌ها */
.message-list {
    direction: rtl;
}

.message {
    border-radius: 12px 4px 12px 12px;
    margin: var(--rtl-margin-start) var(--rtl-margin-end) 8px 0;
}

.message-icon-bin {
    margin: 0 0 0 12px; /* آیکون در سمت چپ */
}

.message-content {
    text-align: right;
    padding: 8px 12px 8px 0;
}

/* نوتیفیکیشن‌ها */
.notification-banner {
    direction: rtl;
    border-radius: 8px 8px 8px 0px;
}

.notification-banner .notification-icon {
    margin: 0 0 0 12px;
}

/* Overview */
.overview-controls {
    direction: rtl;
}

.dash {
    margin: 0 24px 0 0;
}

.dash-item-container {
    margin: 0 0 4px 4px;
}

/* فضای کاری */
.workspace-thumbnails {
    direction: rtl;
    padding: 0 0 0 12px;
}

.workspace-thumbnail {
    border-radius: 4px 8px 8px 4px;
}

/* منوی اپلیکیشن‌ها */
.app-grid {
    direction: rtl;
}

.app-folder-popup {
    border-radius: 18px 18px 18px 6px;
}

/* جستجو */
.search-section {
    direction: rtl;
}

.search-section-content {
    text-align: right;
}

.list-search-result {
    padding: 8px 12px 8px 0;
}

.list-search-result-title {
    text-align: right;
}

.list-search-result-description {
    text-align: right;
    color: rgba(255, 255, 255, 0.7);
}
```

## اکستنشن‌های مفید برای RTL

### 1. اکستنشن تغییر جهت سریع

```javascript
// extension.js
const { GObject, St } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

var RTLToggle = GObject.registerClass(
class RTLToggle extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'RTL Toggle');
        
        this.add_child(new St.Icon({
            icon_name: 'format-text-direction-rtl-symbolic',
            style_class: 'system-status-icon'
        }));
        
        this.connect('button-press-event', this._toggleRTL.bind(this));
    }
    
    _toggleRTL() {
        const currentDirection = St.Widget.get_default_direction();
        const newDirection = currentDirection === St.TextDirection.RTL 
            ? St.TextDirection.LTR 
            : St.TextDirection.RTL;
            
        St.Widget.set_default_direction(newDirection);
        Main.loadTheme(); // بارگذاری مجدد تم
    }
});

function init() {
    return new RTLToggle();
}
```

### 2. تنظیمات خودکار بر اساس زبان سیستم

```javascript
const { Gio } = imports.gi;

function detectSystemLanguage() {
    const settings = new Gio.Settings({ schema: 'org.gnome.system.locale' });
    const region = settings.get_string('region');
    
    // زبان‌های RTL
    const rtlLanguages = ['fa', 'ar', 'he', 'ur'];
    
    return rtlLanguages.some(lang => region.startsWith(lang));
}

function init() {
    if (detectSystemLanguage()) {
        St.Widget.set_default_direction(St.TextDirection.RTL);
    }
}
```

## تست و رفع اشکال

### ابزارهای توسعه

1. **Looking Glass**: `Alt+F2` و تایپ `lg`
2. **Inspector**: `Ctrl+Shift+Alt+I`
3. **Browser Console**: برای دیباگ CSS

### نکات تست

```bash
# تست با زبان‌های مختلف
gsettings set org.gnome.system.locale region 'fa_IR.UTF-8'

# بازنشانی تم
gsettings set org.gnome.shell.extensions.user-theme name ""
gsettings set org.gnome.shell.extensions.user-theme name "MyRTLTheme"

# مشاهده لاگ‌ها
journalctl -f _COMM=gnome-shell
```

## منابع و ابزارها

- **GNOME Shell Theme Creator**: ابزار آنلاین برای ساخت تم
- **Extension Creator**: قالب آماده برای اکستنشن‌ها
- **RTL Tester**: اپلیکیشن تست چیدمان RTL

---

در مقاله بعدی روش‌های **بهینه‌سازی عملکرد** در اپلیکیشن‌های فارسی را بررسی خواهیم کرد.