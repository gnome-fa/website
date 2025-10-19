---
title: فلت هاب و فلت پک
author: مهیار
date: 2025-01-13
---

![](/assets/img/flatpak-deps-management-and-submission/flatpak-banner.jpg)

وجود یک سیستم بسته بندی و مدیریت نرم افزار یکپارچه همیشه از چالش های مهم در توزیع های لینوکسی بوده است. در این مقاله، به نحوه شکل‌گیری سیستم بسته بندی **Flatpak** و روش نصب و استفاده آن در توزیع های اصلی لینوکسی میپردازیم.

## تاریخچه

نخستین تلاش جدی برای ارائه قالبی یکپارچه و مستقل از توزیع های لینوکسی با پروژه‌ای به نام **XDG-App** آغاز شد. این پروژه را **الکساندر لارسن**، از توسعه دهندگان گنوم، پایه گذاری کرد.  
با گذر زمان و استقبال کاربران، XDG-App به **Flatpak** تغییر نام داد و به‌عنوان یک سیستم بسته بندی و توزیع نرم افزار در محیط ایزوله (sandbox) معرفی شد. از همان زمان، Flatpak همراه با مخزن مرکزی **Flathub** به زیرساختی محبوب برای انتشار و دریافت برنامه ها در اکوسیستم لینوکس تبدیل شد.

## فلت پک چیست؟

**فلت پک** یک سیستم بسته بندی و توزیع نرم‌افزار برای لینوکس است که برنامه ها را در محیط های ایزوله اجرا می‌کند. در این مدل، هر برنامه همراه با کتابخانه‌های مورد نیاز خود نصب می‌شود و از دیگر برنامه ها مستقل است؛ در نتیجه، مشکل تداخل نسخه‌های مختلف کتابخانه‌ها از بین می‌رود.

از دیگر مزایای این روش، **امنیت بیشتر و سرعت بالا تر I/O** است. فلت پک ضمن تامین امنیت به واسطه محیط ایزوله، از چک کردن مکرر پرمیشن های I/O جلوگیری می کند و در اینگونه عملیات ها سرعت بهینه تری را نسبت به بسته های بومی از خود نشان می دهد. همچنین بسته‌های فلت پک را می‌توان روی توزیع های مختلف مانند **اوبونتو، فدورا، آرچ** و **دبیان** بدون هیچ تغییری اجرا کرد.

![معماری فلت پک](/assets/img/flatpak-deps-management-and-submission/diagram.svg)
<p align="center"><em>شماتیکی از نحوه ایزوله‌سازی و مدیریت وابستگی ها در فلت پک  
منبع: <a href="https://docs.flatpak.org/en/latest/basic-concepts.html">اسناد Flatpak</a></em></p>

## چرا فلت پک؟

یکی از مهم‌ترین ویژگی‌های فلت پک، **سازگاری بین توزیع ها** میباشد. توسعه‌دهندگان می‌توانند  یکبار بسته را بسازند و آن را در تمام توزیع ها اجرا کنند.  
از سوی دیگر، اجرای برنامه ها در محیط های ایزوله امنیت سیستم را افزایش می‌دهد، زیرا هر برنامه تنها به منابعی دسترسی دارد که صراحتاً به آن اجازه داده شده است.  
همچنین روند بروزرسانی برنامه ها بسیار سرراست و راحت می باشد و در نتیجه آخرین نسخه برنامه در اسرع وقت در فلت هاب قرار داده میشوند.

با این حال، فلت پک به دلیل دانلود مکرر کتابخانه ها ممکن است فضای بیشتری اشکال کند (گاها کتابخانه های مشترک در فلت پک، از این مشکل تا حدودی جلوگیری میکنند). همچنین به دلیل ماهیت ایزوله بودن برنامه ها، گاها دسترسی مستقیم به کارت گرافیک با چالش هایی روبرو می باشد و Benchmark های مختلف نشان می دهد بسته های Flatpak و Snap در رندر با استفاده از Blender و GIMP، عملکرد ضعیف تری نسبت به بسته های بومی دارند. 

## مدیریت وابستگی ها در فلت پک

فلت پک برای مدیریت وابستگی ها از مفهومی به نام **Runtime** استفاده می‌کند. Runtime مجموعه‌ای از کتابخانه‌ها و ابزارهای پایه است که برنامه ها برای اجرا به آن نیاز دارند.  
در کنار آن، **SDK** برای توسعه‌دهندگان جهت ساخت بسته، ارائه میشود.

بسته به نوع برنامه، می‌توان از Runtime های مختلف مانند **GNOME Platform**، **KDE Platform** یا **Freedesktop** استفاده کرد.
لیست کامل Runtime ها را می توانید در **[اسناد فلت پک](https://docs.flatpak.org/en/latest/available-runtimes.html)** مشاهده کنید.

برای نصب Runtime ها می‌توانید از دستورات خود فلت پک استفاده کنید:

```bash
flatpak install flathub org.gnome.Platform
flatpak install flathub org.gnome.Sdk
```

## پورتال های XDG

پورتال های XDG نقش مهمی در تعامل ایمن میان برنامه های ایزوله و سیستم میزبان دارند.  
به عنوان مثال، زمانی که برنامه ای نیاز به باز کردن فایل دارد، درخواست خود را به پورتال ارسال می‌کند. پورتال یک دیالوگ استاندارد بازکردن فایل مطابق با محیط میزکار کاربر نمایش می‌دهد و پس از انتخاب کاربر، تنها فایل انتخاب شده در اختیار برنامه قرار می‌گیرد.

این سیستم شامل پورتال های متعددی مانند **File Chooser**، **Screenshot**، **Camera**، **Notification** و **Print** بوده و کتابخانه های مدرن مانند **GTK 4** و **Qt 6** نیز از این پورتال ها پشتیبانی می‌کنند.

## ساخت و اجرای یک بسته فلت پک

برای شروع، ابزار `flatpak-builder` را نصب کنید:

```bash
sudo apt install flatpak-builder     # اوبونتو/دبیان  
sudo dnf install flatpak-builder     # فدورا
```


حال یک فایل Manifest با اسم آیدی برنامه اجرا کنید (در مثال ما، اسم فایل `my.example.app` خواهد بود):

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
> پ.ن: این نمونه بسیار مختصر از یک برنامه فلت پک می باشد. هنگام ثبت برنامه در [Flathub](https://flathub.org)، ممکن است به دلایل مختلفی در این فایل بازنگری انجام شود.  
> برای اطلاعات بیشتر [اسناد فلت پک](https://docs.flatpak.org/en/latest/manifests.html) را مطالعه کنید.



اکنون می‌توانید بسته را بسازید و به‌صورت محلی اجرا کنید:

```bash
flatpak-builder --repo=myrepo build-dir my.example.app.json
flatpak install --user myrepo my.example.app
```



## انتشار در فلت هاب

![](/assets/img/flatpak-deps-management-and-submission/flathub-ss.png)
<p align="center"><em>نمایه‌ای از بازارچه Flathub<br>
منبع: <a href="https://flathub.org">فلت هاب</a></em></p>
فلت هاب، اصلی ترین مخزن بسته های فلت پک میباشد. در این قسمت به صورت خلاصه، به نحوه ثبت برنامه های خود در فلت هاب می پردازیم.

موارد مهم هنگام ثبت برنامه ها عبارت اند از:
- بیلد شدن برنامه بدون نیاز به اینترنت
- داشتن تگ گیت برای هرکدام از ورژن ها
- وجود فایل Manifest بهینه (موارد جزئی هنگام ثبت برنامه به شما تذکر داده خواهد شد)
- وجود فایل AppStream Manifest در پوشه data برنامه
- پاس شدن [Linter Check](https://docs.flathub.org/docs/for-app-authors/linter) فایل  Manifest شما (قبل درخواست باید برای ثبت [Exception](https://docs.flathub.org/docs/for-app-authors/linter#exceptions) اقدام کنید.)
- کار کردن روی برنامه مطابق با [راهنما کیفیت](https://docs.flathub.org/docs/for-app-authors/metainfo-guidelines/quality-guidelines) فلت هاب
> پ.ن: موارد بسیار زیاد هستند اما در اینجا به خلاصه ای از آنها اشاره شد. جهت مطالعه بیشتر به [اسناد فلت هاب](https://docs.flathub.org/docs/for-app-authors/requirements) مراجعه کنید.

## نمونه ای از فایل AppStream Manifest

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

پس از اطمینان از موارد ذکر شده از [مخزن فلت هاب](https://github.com/flathub/flathub/) Fork گرفته و فایل manifest خود را به new-pr branch اضافه کنید و یک Pull Request در new-pr Branch باز کنید. تا حد امکان با کسانی که درخواست شما را بررسی می کنند همکاری کنید تا برنامه شما هرچه زودتر ثبت شود. درخواست شما پس از بازبینی نهایی قبول شده و به شما یک مخزن گیت هاب همراه با فایل manifest شما اختصاص داده خواهد شد که با آپدیت آن می توانید برنامه خود را بدون بازبینی دوباره در فلت هاب آپدیت کنید.
یکی از ویژگی های جذاب این سایت، بررسی کیفیت صفحه بازار برنامه شما می باشد. شما می توانید در آپدیت های بعدی به موارد ذکر شده در صفحه برنامه خودتان بپردازید و آن را بروزرسانی کنید.

## نتیجه‌گیری

فلت پک روشی مدرن، ایمن و توزیع پذیر برای اجرای نرم‌افزار ها در لینوکس است. اگرچه ممکن است فضای بیشتری نسبت به بسته های بومی استفاده شود، اما در مقابل کاربر را از مزایایی مانند **سازگاری بین توزیع ها، امنیت بالا** و **دسترسی سریع به نسخه‌های جدید** بهره مند می سازد.