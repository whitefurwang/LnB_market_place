<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link rel="stylesheet" href="/css/app.css" />
  <title>@yield('title')</title>
</head>

<body>
  <div id="app">
    @yield('content')
  </div>
  <script src="/js/manifest.js"></script>
  <script src="/js/vendor.js"></script>
  @yield('script')
</body>

</html>