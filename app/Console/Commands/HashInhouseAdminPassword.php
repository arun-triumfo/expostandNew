<?php

namespace App\Console\Commands;

use App\Models\InhouseUser;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class HashInhouseAdminPassword extends Command
{
    protected $signature = 'admin:hash-password 
                            {email : Email in inhouseusers} 
                            {password : Plain password (quote if it contains # or spaces)} 
                            {--force : Allow when APP_ENV is not local}';

    protected $description = 'Store a bcrypt hash in inhouseusers.password for the given email.';

    public function handle(): int
    {
        if (! app()->isLocal() && ! $this->option('force')) {
            $this->error('Refused: run in local, or pass --force (avoid on production).');

            return self::FAILURE;
        }

        $email = strtolower(trim($this->argument('email')));
        $password = (string) $this->argument('password');
        $password = preg_replace('/^\s+|\s+$/u', '', $password) ?? $password;

        $user = InhouseUser::query()
            ->whereRaw('LOWER(TRIM(email)) = ?', [$email])
            ->first();

        if (! $user) {
            $this->error("No row in inhouseusers for email: {$email}");

            return self::FAILURE;
        }

        $user->forceFill(['password' => Hash::make($password)])->save();

        $this->info("Updated password (bcrypt) for {$email} (id {$user->id}).");

        return self::SUCCESS;
    }
}
