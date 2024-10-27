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

        User::create([
            'first_name' => 'Niel Jhon ',
            'last_name' => 'Banaag',
            'middle_name' => null,
            'sex' => 'Male',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'birth_place' => 'Panabo City',
            'civil_status' => 'Single',
            'height' => '5.2',
            'weight' => '59',
            'address' => 'Panabo city',
            'email' => 'banaag.nieljohn@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3578',
            'department' => 'Senior High School',
            'role' => 'HR',
            'position' => 'HR',
            'leave_credits' => 0,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);

        User::create([
            'first_name' => 'Elarde',
            'last_name' => 'Abaya',
            'middle_name' => 'H.',
            'sex' => 'Male',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'birth_place' => 'Panabo City',
            'civil_status' => 'Single',
            'height' => '5.2',
            'weight' => '59',
            'address' => 'Panabo city',
            'email' => 'abaya.elarde@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3578',
            'department' => 'Junior High School',
            'role' => 'HR',
            'position' => 'Teacher I',
            'leave_credits' => 0,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);

        User::create([
            'first_name' => 'Erwin',
            'last_name' => 'Agudo',
            'middle_name' => "P.",
            'sex' => 'Male',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'birth_place' => 'Panabo City',
            'civil_status' => 'Single',
            'height' => '5.2',
            'weight' => '59',
            'address' => 'Panabo city',
            'email' => 'agudo.erwin@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3518',
            'department' => 'Senior High School',
            'role' => 'Teaching',
            'position' => 'Teacher II',
            'leave_credits' => 2,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);

        User::create([
            'first_name' => 'Karl Rainier',
            'last_name' => 'Alaba',
            'middle_name' => "M.",
            'sex' => 'Male',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'birth_place' => 'Panabo City',
            'civil_status' => 'Single',
            'height' => '5.2',
            'weight' => '59',
            'address' => 'Panabo city',
            'email' => 'alaba.karl.rainier@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3518',
            'department' => 'Senior High School',
            'role' => 'Teaching',
            'position' => 'Teacher II',
            'leave_credits' => 2,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);

        User::create([
            'first_name' => 'Anne lourde shyrrel',
            'last_name' => 'Ando',
            'middle_name' => "S.",
            'sex' => 'Female',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'birth_place' => 'Panabo City',
            'civil_status' => 'Single',
            'height' => '5.2',
            'weight' => '59',
            'address' => 'Panabo city',
            'email' => 'ando.lourde.shyrrel@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3511',
            'department' => 'Senior High School',
            'role' => 'Teaching',
            'position' => 'Teacher II',
            'leave_credits' => 0,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);

        User::create([
            'first_name' => 'Marisa',
            'last_name' => 'Balaba',
            'middle_name' => "M.",
            'sex' => 'Female',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'birth_place' => 'Panabo City',
            'civil_status' => 'Single',
            'height' => '5.2',
            'weight' => '59',
            'address' => 'Panabo city',
            'email' => 'balaba.marisa@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3513',
            'department' => 'Senior High School',
            'role' => 'Teaching',
            'position' => 'Teacher II',
            'leave_credits' => 2,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);

        User::create([
            'first_name' => 'Jeremie',
            'last_name' => 'Balagosa',
            'middle_name' => "F.",
            'sex' => 'Male',
            'date_hired' => '2024-06-20',
            'date_of_birth' => '1981-03-05',
            'birth_place' => 'Panabo City',
            'civil_status' => 'Single',
            'height' => '5.2',
            'weight' => '59',
            'address' => 'Panabo city',
            'email' => 'balagosa.jeremie@gmail.com',
            'phone_number' => '09485729385',
            'personnel_id' => 'SDNH-3218',
            'department' => 'Junior High School',
            'role' => 'Teaching',
            'position' => 'Teacher II',
            'leave_credits' => 2,
            'password' => Hash::make('12345678'),
            'leave_rendered' => null,
            'date_hired' => '2024-07-10'
        ]);
    }
}
