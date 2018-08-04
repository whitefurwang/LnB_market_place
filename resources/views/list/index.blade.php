@extends('layouts.default')

@section('title', 'List')

@section('content')
  <router-link to="/list" exact>List</router-link>
  <router-view/>
@endsection

@section('script')
  <script src="/js/app.js"></script>
@endsection