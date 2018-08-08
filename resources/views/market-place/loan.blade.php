@extends('layouts.default')

@section('title', 'Loan')

@section('content')
  <router-link to="/market-place" exact>Market Place</router-link>
  <router-view/>
@endsection

@section('script')
  <script src="/js/app.js"></script>
@endsection