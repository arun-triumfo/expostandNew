<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class InhouseUser extends Authenticatable
{
    use HasFactory;

    protected $table = 'inhouseusers';

    protected $fillable = [
        'name',
        'email',
        'password',
        'mobile',
        'designation',
        'role',
        'profilepic',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Legacy data may use plain-text passwords; bcrypt hashes are stored after first successful login.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'updated_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function isActive(): bool
    {
        return (string) $this->status === '1' || $this->status === 1;
    }

    /**
     * Only users with role "admin" may delete records in admin modules.
     */
    public function isAdmin(): bool
    {
        return strcasecmp(trim((string) $this->role), 'admin') === 0;
    }
}
