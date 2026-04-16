<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $standbuilderCount = DB::table('standbuildermasters')->count();
        $leadsCount = DB::table('getfivequotes')->count();
        $packagesCount = DB::table('buypackagemodels')->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'standbuilders' => $standbuilderCount,
                'leads' => $leadsCount,
                'packages' => $packagesCount,
            ],
        ]);
    }
}
