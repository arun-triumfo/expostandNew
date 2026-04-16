<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\PackagePurchasedController;
use App\Http\Controllers\Admin\QuotationController;
use App\Http\Controllers\Admin\StandBuilderController;
use App\Http\Controllers\Admin\TradeShowController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\CitySearchController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::post('searchcity', CitySearchController::class)->name('searchcity');

Route::middleware('guest:admin')->group(function () {
    Route::get('expo-admin', [AdminAuthController::class, 'create'])->name('admin.login');
    Route::post('expo-admin/login', [AdminAuthController::class, 'store'])->name('admin.login.store');
});

Route::middleware(['auth:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', AdminDashboardController::class)->name('admin.dashboard');
    Route::get('/view-tradeshow', [TradeShowController::class, 'index'])->name('admin.tradeshows.index');
    Route::get('/tradeshow/cities', [TradeShowController::class, 'citiesByCountry'])->name('admin.tradeshows.cities');
    Route::get('/tradeshow/create', [TradeShowController::class, 'create'])->name('admin.tradeshows.create');
    Route::post('/tradeshow', [TradeShowController::class, 'store'])->name('admin.tradeshows.store');
    Route::get('/tradeshow/{tradeshow}/edit', [TradeShowController::class, 'edit'])->name('admin.tradeshows.edit');
    Route::match(['put', 'post'], '/tradeshow/{tradeshow}', [TradeShowController::class, 'update'])->name('admin.tradeshows.update');
    Route::delete('/tradeshow/{tradeshow}', [TradeShowController::class, 'destroy'])->name('admin.tradeshows.destroy');

    Route::get('/view-blog', [BlogController::class, 'index'])->name('admin.blog.index');
    Route::get('/blog/create', [BlogController::class, 'create'])->name('admin.blog.create');
    Route::post('/blog', [BlogController::class, 'store'])->name('admin.blog.store');
    Route::get('/blog/{article}/edit', [BlogController::class, 'edit'])->name('admin.blog.edit');
    Route::match(['put', 'post'], '/blog/{article}', [BlogController::class, 'update'])->name('admin.blog.update');
    Route::delete('/blog/{article}', [BlogController::class, 'destroy'])->name('admin.blog.destroy');

    Route::get('/view-country', [CountryController::class, 'index'])->name('admin.countries.index');
    Route::get('/country/create', [CountryController::class, 'create'])->name('admin.countries.create');
    Route::post('/country', [CountryController::class, 'store'])->name('admin.countries.store');
    Route::delete('/country/{id}', [CountryController::class, 'destroy'])->whereNumber('id')->name('admin.countries.destroy');
    Route::get('/country/{id}/edit', [CountryController::class, 'edit'])->whereNumber('id')->name('admin.countries.edit');
    Route::match(['put', 'post'], '/country/{id}', [CountryController::class, 'update'])->whereNumber('id')->name('admin.countries.update');

    Route::get('/view-city', [CityController::class, 'index'])->name('admin.cities.index');
    Route::get('/city/create', [CityController::class, 'create'])->name('admin.cities.create');
    Route::post('/city', [CityController::class, 'store'])->name('admin.cities.store');
    Route::delete('/city/{id}', [CityController::class, 'destroy'])->whereNumber('id')->name('admin.cities.destroy');
    Route::get('/city/{id}/edit', [CityController::class, 'edit'])->whereNumber('id')->name('admin.cities.edit');
    Route::match(['put', 'post'], '/city/{id}', [CityController::class, 'update'])->whereNumber('id')->name('admin.cities.update');

    Route::get('/users', [UserManagementController::class, 'index'])->name('admin.users.index');
    Route::get('/users/{id}/edit', [UserManagementController::class, 'edit'])->whereNumber('id')->name('admin.users.edit');
    Route::get('/users/{id}', [UserManagementController::class, 'show'])->whereNumber('id')->name('admin.users.show');
    Route::post('/users/{id}', [UserManagementController::class, 'update'])->whereNumber('id')->name('admin.users.update');

    Route::post('/logout', [AdminAuthController::class, 'destroy'])->name('admin.logout');
});

/*
| Stand builder admin (legacy URLs at site root, same as old site)
*/
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/package-purchased', [PackagePurchasedController::class, 'index'])->name('package-purchased');
    Route::get('/package-purchased/page/{page}', function (int $page) {
        return redirect()->route('package-purchased', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('package-purchased.page');

    Route::get('/standbuilders', [StandBuilderController::class, 'index'])->name('standbuilders');
    Route::get('/standbuilders/page/{page}', function (int $page) {
        return redirect()->route('standbuilders', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('standbuilders.page');

    Route::post('/filterstandbuilder', [StandBuilderController::class, 'filterStandbuilder'])->name('filterstandbuilder');
    Route::post('/seachstandbuldrdata', [StandBuilderController::class, 'searchStandbuilder'])->name('seachstandbuldrdata');
    Route::post('/viewstandbuildercomment', [StandBuilderController::class, 'viewCommentstandbuilder'])->name('viewstandbuildercomment');
    Route::post('/insertstanddbuildercomment', [StandBuilderController::class, 'insertComntStndbldr'])->name('insertstanddbuildercomment');
    Route::post('/update-featured-standbuilders', [StandBuilderController::class, 'updateFeaturedStandbuilders'])->name('update.featured.standbuilders');
    Route::get('/get-countries-by-continent', [StandBuilderController::class, 'getCountriesByContinent'])->name('getCountriesByContinent');
    Route::get('/cityvalustandbuilder', [StandBuilderController::class, 'getCityByCountry'])->name('cityvalustandbuilder');

    Route::get('/edit-standbuilders', [StandBuilderController::class, 'edit'])->name('edit-standbuilders');
    Route::get('/view-standbuilders', [StandBuilderController::class, 'show'])->name('view-standbuilders');
    Route::post('/update-standbuilders', [StandBuilderController::class, 'update'])->name('update-standbuilders');

    Route::get('/add-standbuilders', function () {
        return Inertia::render('Admin/Standbuilders/Stub', [
            'title' => 'Add stand builder',
            'userId' => null,
        ]);
    })->name('add-standbuilders');

    Route::get('/quotation', [QuotationController::class, 'index'])->name('quotation');
    Route::get('/quotation/page/{page}', function (int $page) {
        return redirect()->route('quotation', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation.page');

    Route::get('/quotation-qualified', [QuotationController::class, 'index'])->name('quotation-qualified');
    Route::get('/quotation-qualified/page/{page}', function (int $page) {
        return redirect()->route('quotation-qualified', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation-qualified.page');

    Route::get('/quotation-distributed', [QuotationController::class, 'index'])->name('quotation-distributed');
    Route::get('/quotation-distributed/page/{page}', function (int $page) {
        return redirect()->route('quotation-distributed', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation-distributed.page');

    Route::get('/quotation-accepted', [QuotationController::class, 'index'])->name('quotation-accepted');
    Route::get('/quotation-accepted/page/{page}', function (int $page) {
        return redirect()->route('quotation-accepted', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation-accepted.page');

    Route::get('/quotation-contacted', [QuotationController::class, 'index'])->name('quotation-contacted');
    Route::get('/quotation-contacted/page/{page}', function (int $page) {
        return redirect()->route('quotation-contacted', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation-contacted.page');

    Route::get('/quotation-final', [QuotationController::class, 'index'])->name('quotation-final');
    Route::get('/quotation-final/page/{page}', function (int $page) {
        return redirect()->route('quotation-final', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation-final.page');

    Route::get('/quotation-commision', [QuotationController::class, 'index'])->name('quotation-commision');
    Route::get('/quotation-commision/page/{page}', function (int $page) {
        return redirect()->route('quotation-commision', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation-commision.page');

    Route::get('/quotation-dead', [QuotationController::class, 'index'])->name('quotation-dead');
    Route::get('/quotation-dead/page/{page}', function (int $page) {
        return redirect()->route('quotation-dead', array_merge(request()->query(), ['page' => $page]));
    })->whereNumber('page')->name('quotation-dead.page');

    Route::post('/viewquotecomment', [QuotationController::class, 'viewQuoteComment'])->name('viewquotecomment');
    Route::post('/insertquotecomment', [QuotationController::class, 'insertQuoteComment'])->name('insertquotecomment');
    Route::post('/assignupdate', [QuotationController::class, 'assignUpdate'])->name('assignupdate');
    Route::get('/delete-quotation', [QuotationController::class, 'deleteQuote'])->name('delete-quotation');
    Route::get('/send-quotation', [QuotationController::class, 'sendQuotation'])->name('send-quotation');
    Route::post('/send-quotation', [QuotationController::class, 'processSendQuotation'])->name('send-quotation.process');
    Route::get('/view-quotation', [QuotationController::class, 'viewQuotation'])->name('view-quotation');
    Route::get('/edit-quotation', [QuotationController::class, 'edit'])->name('edit-quotation');
    Route::post('/update-quotation', [QuotationController::class, 'update'])->name('update-quotation');

    Route::get('/add-quotation', function () {
        return Inertia::render('Admin/Quotations/Stub', ['title' => 'Add quotation']);
    })->name('add-quotation');
});

Route::get('/welcome-breeze', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

/*
| Public SEO routes (legacy-compatible)
*/
Route::get('/blog', [PublicPageController::class, 'blogIndex'])->name('blog.index');
Route::get('/blog/{slug}', [PublicPageController::class, 'blogShow'])->name('blog.show');
Route::get('/trade-shows', [PublicPageController::class, 'tradeShows'])->name('trade-shows.index');
Route::get('/trade-shows/{slug}', [PublicPageController::class, 'tradeShowDetail'])->name('trade-shows.show');
Route::get('/{country}/{city}', [PublicPageController::class, 'cityPage'])
    ->where('country', '^(?!blog$|trade-shows$|admin$|expo-admin$|login$|register$|dashboard$|profile$|welcome-breeze$).+')
    ->name('public.city');
Route::get('/{slug}', [PublicPageController::class, 'countryOrProvider'])
    ->where('slug', '^(?!blog$|trade-shows$|admin$|expo-admin$|login$|register$|dashboard$|profile$|welcome-breeze$).+')
    ->name('public.country-or-provider');
