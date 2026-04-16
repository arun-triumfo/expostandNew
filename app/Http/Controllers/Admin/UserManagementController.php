<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserMaster;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /** @var list<string> */
    private const USERTYPES = ['standbuilder', 'exhibitor', 'agency', 'organiser', 'hostessagency'];

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $usertype = trim((string) $request->query('usertype', ''));
        $status = $request->query('status', '');
        $verifystatus = $request->query('verifystatus', '');

        $query = UserMaster::query()->select([
            'id', 'name', 'email', 'phone', 'usertype', 'status', 'verifystatus', 'profilepic', 'created_at',
        ]);

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('phone', 'like', '%'.$search.'%');
            });
        }

        if ($usertype !== '') {
            $query->where('usertype', $usertype);
        }

        if ($status !== '' && $status !== null) {
            $query->where('status', $status);
        }

        if ($verifystatus !== '' && $verifystatus !== null) {
            $query->where('verifystatus', $verifystatus);
        }

        $users = $query
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(function (UserMaster $u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'phone' => $u->phone,
                    'usertype' => $u->usertype,
                    'status' => (string) $u->status,
                    'status_label' => (string) $u->status === '1' ? 'Active' : 'Inactive',
                    'verifystatus' => (string) $u->verifystatus,
                    'verified_label' => (string) $u->verifystatus === '1' ? 'Verified' : 'Not verified',
                    'profilepic' => $u->profilepic,
                    'created_at' => $u->created_at,
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => [
                'totalUsers' => UserMaster::count(),
                'verifiedUsers' => UserMaster::query()->where('verifystatus', '1')->count(),
                'activeUsers' => UserMaster::query()->where('status', '1')->count(),
                'standbuilders' => UserMaster::query()->where('usertype', 'standbuilder')->count(),
                'exhibitors' => UserMaster::query()->where('usertype', 'exhibitor')->count(),
                'agencies' => UserMaster::query()->where('usertype', 'agency')->count(),
                'organisers' => UserMaster::query()->where('usertype', 'organiser')->count(),
                'hostessagencies' => UserMaster::query()->where('usertype', 'hostessagency')->count(),
            ],
            'filters' => [
                'search' => $search,
                'usertype' => $usertype,
                'status' => $status === '' ? '' : (string) $status,
                'verifystatus' => $verifystatus === '' ? '' : (string) $verifystatus,
            ],
            'usertypeOptions' => self::USERTYPES,
        ]);
    }

    public function show(int $id): Response
    {
        $user = UserMaster::query()->findOrFail($id);

        return Inertia::render('Admin/Users/Show', [
            'user' => $this->userPayload($user),
        ]);
    }

    public function edit(int $id): Response
    {
        $user = UserMaster::query()->findOrFail($id);

        $usertypeOptions = array_values(array_unique(array_merge(self::USERTYPES, [(string) $user->usertype])));

        return Inertia::render('Admin/Users/Edit', [
            'user' => $this->userPayload($user),
            'usertypeOptions' => $usertypeOptions,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = UserMaster::query()->findOrFail($id);

        $usertypeRule = Rule::in(array_values(array_unique(array_merge(self::USERTYPES, [(string) $user->usertype]))));

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('usermasters', 'email')->ignore($user->id)],
            'phone' => ['required', 'string', 'max:30'],
            'usertype' => ['required', 'string', $usertypeRule],
            'status' => ['required', 'in:0,1'],
            'verifystatus' => ['required', 'in:0,1'],
            'password' => ['nullable', 'string', 'min:8', 'max:255'],
            'profilepic' => ['nullable', 'image', 'max:2048'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'];
        $user->usertype = $validated['usertype'];
        $user->status = $validated['status'];
        $user->verifystatus = $validated['verifystatus'];

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        if ($request->hasFile('profilepic')) {
            $file = $request->file('profilepic');
            $imageName = time().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('uploads/profilepics'), $imageName);
            $user->profilepic = $imageName;
        }

        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function userPayload(UserMaster $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'usertype' => $user->usertype,
            'status' => (string) $user->status,
            'verifystatus' => (string) $user->verifystatus,
            'profilepic' => $user->profilepic,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
