<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Buypackagemodel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackagePurchasedController extends Controller
{
    /**
     * Legacy admin URL: lists Razorpay package purchases from `buypackagemodels`.
     */
    public function index(Request $request): Response
    {
        $currentPage = max(1, (int) $request->query('page', 1));

        $purchases = Buypackagemodel::query()
            ->orderByDesc('id')
            ->paginate(15, ['*'], 'page', $currentPage)
            ->withQueryString();

        return Inertia::render('Admin/PackagePurchased/Index', [
            'purchases' => $purchases,
        ]);
    }
}
