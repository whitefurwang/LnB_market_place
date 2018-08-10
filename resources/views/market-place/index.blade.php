@extends('layouts.default')

@section('title', 'Market Place')

@section('content')
  @include('includes.header')
  <div class="container-fluid">
    <div class="row">
      <main class="col">
        <router-view/>
      </main>
    </div>
  </div>
@endsection

@section('script')
  <script src="/js/app.js"></script>
@endsection