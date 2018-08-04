<?php

Route::get('/', function () {
    return redirect('/list');
});

Route::get('/list', function () {
    return view('list/index');
});

Route::get('/list/item/{serial}', function () {
    return view('list/item');
});
