---
title: فلت‌هاب و فلت‌پک
author: مهیار
date: 2025-10-19
---

![](/assets/img/flatpak-deps-management-and-submission/flatpak-banner.jpg)

وجود یک سیستم بسته‌بندی و مدیریت نرم‌افزار یکپارچه همیشه از چالش‌های مهم در توزیع‌های لینوکسی بوده است. در این مقاله، به نحوه شکل‌گیری سیستم بسته‌بندی **Flatpak** و روش نصب و استفاده آن در توزیع‌های اصلی لینوکسی می‌پردازیم.

## تاریخچه

نخستین تلاش جدی برای ارائه قالبی یکپارچه و مستقل از توزیع‌های لینوکسی با پروژه‌ای به نام **XDG-App** آغاز شد. این پروژه را **الکساندر لارسن**، از توسعه‌دهندگان گنوم، پایه‌گذاری کرد.  
با گذر زمان و استقبال کاربران، XDG-App به **Flatpak** تغییر نام داد و به‌عنوان یک سیستم بسته‌بندی و توزیع نرم‌افزار در محیط ایزوله (sandbox) معرفی شد. از همان زمان، Flatpak همراه با مخزن‌مرکزی **Flathub** به زیرساختی محبوب برای انتشار و دریافت برنامه‌ها در اکوسیستم لینوکس تبدیل شد.

## فلت‌پک چیست؟

**فلت‌پک** یک سیستم بسته‌بندی و توزیع نرم‌افزار برای لینوکس است که برنامه‌ها را در محیط‌های ایزوله اجرا می‌کند. در این مدل، هر برنامه همراه با کتابخانه‌های موردنیاز خود نصب می‌شود و از دیگر برنامه‌ها مستقل است؛ در نتیجه، مشکل تداخل نسخه‌های مختلف کتابخانه‌ها از بین می‌رود.

از دیگر مزایای این روش، **امنیت بیشتر و سرعت بالاتر I/O** است. فلت‌پک ضمن تأمین امنیت به واسطه محیط ایزوله، از چک کردن مکرر پرمیشن‌های I/O جلوگیری می‌کند و در این‌گونه عملیات‌ها سرعت بهینه‌تری را نسبت به بسته‌های بومی از خود نشان می‌دهد. همچنین بسته‌های فلت‌پک را می‌توان روی توزیع‌های مختلف مانند **اوبونتو، فدورا، آرچ** و **دبیان** بدون هیچ تغییری اجرا کرد.

![معماری فلت‌پک](/assets/img/flatpak-deps-management-and-submission/diagram.svg)
<p align="center"><em>شماتیکی از نحوه ایزوله‌سازی و مدیریت وابستگی‌ها در فلت‌پک  
منبع: <a href="https://docs.flatpak.org/en/latest/basic-concepts.html">اسناد Flatpak</a></em></p>

## چرا فلت‌پک؟

یکی از مهم‌ترین ویژگی‌های فلت‌پک، **سازگاری بین توزیع‌ها** است. توسعه‌دهندگان می‌توانند یک‌بار بسته را بسازند و آن را در تمام توزیع‌ها اجرا کنند.  
از سوی دیگر، اجرای برنامه‌ها در محیط‌های ایزوله امنیت سیستم را افزایش می‌دهد، زیرا هر برنامه تنها به منابعی دسترسی دارد که صراحتاً به آن اجازه داده شده است.  
همچنین روند به‌روزرسانی برنامه‌ها بسیار سرراست و راحت است و در نتیجه آخرین نسخه برنامه در اسرع وقت در فلت‌هاب قرار داده می‌شود.

با این حال، فلت‌پک به دلیل دانلود مکرر کتابخانه‌ها ممکن است فضای بیشتری اشغال کند (گاهی کتابخانه‌های مشترک در فلت‌پک، از این مشکل تا حدودی جلوگیری می‌کنند). همچنین به دلیل ماهیت ایزوله بودن برنامه‌ها، گاهی دسترسی مستقیم به کارت گرافیک با چالش‌هایی روبه‌رو است و Benchmark‌ها‌ی مختلف نشان می‌دهند بسته‌های Flatpak و Snap در رندر با استفاده از Blender و GIMP، عملکرد ضعیف‌تری نسبت به بسته‌های بومی دارند. 

## مدیریت وابستگی‌ها در فلت‌پک

فلت‌پک برای مدیریت وابستگی‌ها از مفهومی به نام **Runtime** استفاده می‌کند. Runtime مجموعه‌ای از کتابخانه‌ها و ابزارهای پایه است که برنامه‌ها برای اجرا به آن نیاز دارند.  
در کنار آن، **SDK** برای توسعه‌دهندگان جهت ساخت بسته، ارائه می‌شود.

بسته به نوع برنامه، می‌توان از Runtime‌های مختلف مانند **GNOME Platform**، **KDE Platform** یا **Freedesktop** استفاده کرد.
لیست کامل Runtime‌ها را می‌توانید در **[اسناد فلت‌پک](https://docs.flatpak.org/en/latest/available-runtimes.html)** مشاهده کنید.

برای نصب Runtime‌ها می‌توانید از دستورات خود فلت‌پک استفاده کنید:

```bash
flatpak install flathub org.gnome.Platform
flatpak install flathub org.gnome.Sdk
```

## پورتال‌های XDG

پورتال‌های XDG نقش مهمی در تعامل ایمن میان برنامه‌های ایزوله و سیستم میزبان دارند.  
به‌عنوان مثال، زمانی که برنامه‌ای نیاز به باز کردن فایل دارد، درخواست خود را به پورتال ارسال می‌کند. پورتال یک دیالوگ استاندارد بازکردن فایل مطابق با محیط میزکار کاربر نمایش می‌دهد و پس از انتخاب کاربر، تنها فایل انتخاب‌شده در اختیار برنامه قرار می‌گیرد.

این سیستم شامل پورتال‌های متعددی مانند **File Chooser**، **Screenshot**، **Camera**، **Notification** و **Print** بوده و کتابخانه‌های مدرن مانند **GTK ۴** و **Qt ۶** نیز از این پورتال‌ها پشتیبانی می‌کنند.

## ساخت و اجرای یک بسته فلت‌پک

برای شروع، ابزار `flatpak-builder` را نصب کنید:

```bash
sudo apt install flatpak-builder     # اوبونتو/دبیان  
sudo dnf install flatpak-builder     # فدورا
```

حال یک فایل Manifest با نام آیدی برنامه ایجاد کنید (در مثال ما، نام فایل `my.example.app` خواهد بود):

```json
{
  "app-id": "my.example.app",
  "runtime": "org.gnome.Platform",
  "runtime-version": "49",
  "sdk": "org.gnome.Sdk",
  "command": "exampleapp",
  "finish-args": [
    "--share=ipc",
    "--socket=wayland",
    "--device=dri",
    "--filesystem=home"
  ],
  "modules": [
    {
      "name": "myapp",
      "sources": [
        {
          "type": "git",
          "url": "https://github.com/example/app.git",
          "tag": "v1.0.0"
        }
      ]
    }
  ]
}
```
> پ.ن: این نمونه بسیار مختصر از یک برنامه فلت‌پک است. هنگام ثبت برنامه در [Flathub](https://flathub.org)، ممکن است به دلایل مختلفی در این فایل بازنگری انجام شود.  
> برای اطلاعات بیشتر [اسناد فلت‌پک](https://docs.flatpak.org/en/latest/manifests.html) را مطالعه کنید.

اکنون می‌توانید بسته را بسازید و به‌صورت محلی اجرا کنید:

```bash
flatpak-builder --repo=myrepo build-dir my.example.app.json
flatpak install --user myrepo my.example.app
```

## انتشار در فلت‌هاب

![](/assets/img/flatpak-deps-management-and-submission/flathub-ss.png)
<p align="center"><em>نمایه‌ای از بازارچه Flathub<br>
منبع: <a href="https://flathub.org">فلت‌هاب</a></em></p>
فلت‌هاب، اصلی‌ترین مخزن بسته‌های فلت‌پک است. در این قسمت به‌صورت خلاصه، به نحوه ثبت برنامه‌های خود در فلت‌هاب می‌پردازیم.

موارد مهم هنگام ثبت برنامه‌ها عبارت‌اند از:
- بیلد شدن برنامه بدون نیاز به اینترنت
- داشتن تگ گیت برای هرکدام از نسخه‌ها
- وجود فایل Manifest بهینه (موارد جزئی هنگام ثبت برنامه به شما تذکر داده خواهد شد)
- وجود فایل AppStream Manifest در پوشه data برنامه
- پاس شدن [Linter Check](https://docs.flathub.org/docs/for-app-authors/linter) فایل Manifest شما (قبل از درخواست باید برای ثبت [Exception](https://docs.flathub.org/docs/for-app-authors/linter#exceptions) اقدام کنید.)
- کار کردن روی برنامه مطابق با [راهنمای کیفیت](https://docs.flathub.org/docs/for-app-authors/metainfo-guidelines/quality-guidelines) فلت‌هاب
> پ.ن: موارد بسیار زیادند، اما در اینجا به خلاصه‌ای از آن‌ها اشاره شده است. جهت مطالعه بیشتر به [اسناد فلت‌هاب](https://docs.flathub.org/docs/for-app-authors/requirements) مراجعه کنید.

## نمونه‌ای از فایل AppStream Manifest

```xml
<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
  <id>my.example.app</id>
  <name>Example App</name>
  <summary>Does Some Pretty good job</summary>
  <metadata_license>CC0-1.0</metadata_license>
  <project_license>GPL-3.0-or-later</project_license>
  <description>
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
  </description>
  <icon type="stock">my.example.app</icon>
  <branding>
  <color type="primary" scheme_preference="light">#ffa348</color>
  <color type="primary" scheme_preference="dark">#57e389</color>
  </branding>
  <launchable type="desktop-id">my.example.app</launchable>
  <categories>
    <category>Development</category>
  </categories>
  <provides>
    <binary>exampleapp</binary>
  </provides>
  <content_rating type="oars-1.1"/>
  <screenshots>
    <screenshot type="default">
      <image>https://i.imgur.com/m47btCj.jpeg</image>
      <caption>My Example App ScreenShot</caption>
    </screenshot>
  </screenshots>
  <releases>
    <release version="1.0.1" date="2025-09-26">
      <description>
        <p>Update 1</p>
        <p>Update 2</p>
      </description>
    </release>
    <release version="1.0.0" date="2025-09-22">
      <description>
        <p>Update 1</p>
        <p>Update 2</p>
      </description>
    </release>
  </releases>
  <url type="homepage">https://github.com/BuddySirJava/exampleapp</url>
  <url type="vcs-browser">https://github.com/BuddySirJava/exampleapp</url>
  <url type="bugtracker">https://github.com/BuddySirJava/exampleapp/issues</url>
  <developer id="io.github.buddysirjava">
    <name>Mahyar Darvishi</name>
  </developer>
</component>
```

پس از اطمینان از موارد ذکر شده از [مخزن فلت‌هاب](https://github.com/flathub/flathub/) Fork گرفته و فایل manifest خود را به new-pr branch اضافه کنید و یک Pull Request در new-pr Branch باز کنید. تا حد امکان با کسانی که درخواست شما را بررسی می‌کنند همکاری کنید تا برنامه شما هرچه زودتر ثبت شود. درخواست شما پس از بازبینی نهایی قبول شده و به شما یک مخزن گیت‌هاب همراه با فایل manifest شما اختصاص داده خواهد شد که با به‌روزرسانی آن می‌توانید برنامه خود را بدون بازبینی دوباره در فلت‌هاب به‌روزرسانی کنید.
یکی از ویژگی‌های جذاب این سایت، بررسی کیفیت صفحه بازار برنامه شما است. شما می‌توانید در به‌روزرسانی‌های بعدی به موارد ذکر شده در صفحه برنامه خودتان بپردازید و آن را به‌روزرسانی کنید.

## نتیجه‌گیری

فلت‌پک روشی مدرن، ایمن و توزیع‌پذیر برای اجرای نرم‌افزارها در لینوکس است. اگرچه ممکن است فضای بیشتری نسبت به بسته‌های بومی استفاده شود، اما در مقابل کاربر را از مزایایی مانند **سازگاری بین توزیع‌ها، امنیت بالا** و **دسترسی سریع به نسخه‌های جدید** بهره‌مند می‌سازد.