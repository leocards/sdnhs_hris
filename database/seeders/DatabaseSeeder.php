<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::insert([
            'first_name' => 'Niel Jhon ',
            'last_name' => 'Banaag',
            'middle_name' => null,
            'sex' => 'Male',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'address' => 'Panabo city',
            'email' => 'banaag.nieljohn@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3578',
            'department' => 'ICT',
            'role' => 'HR',
            'position' => 'HR',
            'leave_credits' => 0,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);
    }
}
