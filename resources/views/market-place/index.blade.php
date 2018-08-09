@extends('layouts.default')

@section('title', 'Market Place')

@section('content')
  <nav class='navbar navbar-expand-lg navbar-light bg-light'>
    <div class="collapse navbar-collapse">
      <div class="navbar-nav">
        <router-link
          to="/market-place"
          exact
          class='nav-item nav-link'
          linkActiveClass='active'
        >Market Place</router-link>
      </div>
    </div>
  </nav>
  <router-view/>
@endsection

@section('script')
  <script src="/js/app.js"></script>
@endsection