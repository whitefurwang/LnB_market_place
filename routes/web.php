<?php

Route::get('/', function () {
    return redirect('/market-place');
});

Route::get('/market-place', function () {
    return view('market-place/index');
});

Route::get('/market-place/loan/{serial}', function () {
    return view('market-place/loan');
});
