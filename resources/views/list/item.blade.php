@extends('layouts.default')

@section('title', 'Item')

@section('content')
  <router-link to="/list" exact>List</router-link>
  <router-view/>
@endsection

@section('script')
  <script src="/js/app.js"></script>
@endsection