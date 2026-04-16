<?php

namespace App\Providers;

use App\Models\TradeshowData;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('tradeshow', fn (string $value) => TradeshowData::whereKey($value)->firstOrFail());

        Vite::prefetch(concurrency: 3);

        Authenticate::redirectUsing(function ($request) {
            return $request->is('admin', 'admin/*')
                ? route('admin.login')
                : route('login');
        });

        RedirectIfAuthenticated::redirectUsing(function ($request) {
            if ($request->routeIs('admin.login', 'admin.login.store')) {
                return route('admin.dashboard');
            }

            return route('dashboard');
        });
    }
}
