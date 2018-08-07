@extends('layouts.default')

@section('title', 'Loan')

@section('content')
  <router-link to="/market-place" exact>List</router-link>
  <router-view/>
@endsection

@section('script')
  <script src="/js/app.js"></script>
@endsection