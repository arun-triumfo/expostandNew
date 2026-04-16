<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Http\Request;

trait AuthorizesAdminDeletes
{
    protected function authorizeAdminDelete(Request $request): void
    {
        abort_unless($request->user('admin')?->isAdmin(), 403);
    }
}
