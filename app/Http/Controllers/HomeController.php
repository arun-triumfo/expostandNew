<?php

namespace App\Http\Controllers;

use App\Services\Home\HomePageService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private HomePageService $homePageService
    ) {}

    public function index(): Response
    {
        $data = $this->homePageService->getHomePageData();

        return Inertia::render('Home', [
            'countrydata' => $data['countries'],
            'citydata' => $data['cities'],
            'appUrl' => rtrim((string) config('app.url'), '/'),
        ]);
    }
}
