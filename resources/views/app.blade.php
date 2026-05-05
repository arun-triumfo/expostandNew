<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
        <link rel="dns-prefetch" href="//www.googletagmanager.com">
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" as="style">
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@100..900&display=swap" as="style">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@100..900&display=swap" rel="stylesheet">

        <!-- Critical styles -->
        <link rel="stylesheet" type="text/css" href="/web/css/critical.css">
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="preload" href="/web/css/common.css?ver=1.0.7" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="preload" href="/web/css/responsive.css?ver=1.0.5" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="preload" href="/web/css/stand-builder-country.css?ver=1.0.8" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="preload" href="/web/css/standbuilder-detail.css?ver=1.0.5" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="preload" href="/web/css/global-responsive-fixes.css?ver=1.0.1" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
            <link rel="stylesheet" type="text/css" href="/web/css/common.css?ver=1.0.7">
            <link rel="stylesheet" type="text/css" href="/web/css/responsive.css?ver=1.0.5">
            <link rel="stylesheet" type="text/css" href="/web/css/stand-builder-country.css?ver=1.0.8">
            <link rel="stylesheet" type="text/css" href="/web/css/standbuilder-detail.css?ver=1.0.5">
            <link rel="stylesheet" type="text/css" href="/web/css/global-responsive-fixes.css?ver=1.0.1">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        </noscript>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
