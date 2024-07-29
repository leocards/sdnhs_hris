<?php

namespace App\Http\Controllers;

use App\Http\Requests\StaffRequest;
use App\Models\StaffTardiness;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index() 
    {
        return Inertia::render('Staff/Staff', ['staffs' => User::whereNot('id', Auth::id())->paginate(50)]);
    }

    public function create() 
    {
        return Inertia::render('Staff/NewStaff');
    }

    public function edit(User $user) 
    {
        return Inertia::render('Staff/NewStaff', [
            "user" => $user
        ]);
    }

    public function tardiness() 
    {
        return Inertia::render('Staff/StaffTardiness', ['attendance' => StaffTardiness::orderBy('created_at', 'desc')->paginate(50)]);
    }

    public function staff_list() 
    {
        $staffs = User::whereNot('id', Auth::id())->paginate(50);

        return response()->json($staffs);
    }

    public function store(StaffRequest $request) 
    {
        DB::beginTransaction();
        try {

            User::create([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'middle_name' => $request->middleName,
                'sex' => $request->sex,
                'date_of_birth' => Carbon::parse($request->birthDate)->format('Y-m-d'),
                'address' => $request->address,
                'email' => $request->email,
                'phone_number' => $request->phoneNumber,
                'staff_id' => $request->staffId,
                'department' => $request->department,
                'role' => $request->userRole,
                'position' => $request->position,
                'leave_credits' => $request->currentCredits,
                'date_hired' => Carbon::parse($request->date_hired)->format('Y-m-d'),
                'password' => Hash::make($request->password)
            ]);

            DB::commit();

            return back()->with('success', 'New staff has been added.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
            //throw $th;
        }
    }

    public function update(StaffRequest $request, User $user = null) 
    {
        DB::beginTransaction();
        try {

            $user->first_name = $request->firstName;
            $user->last_name = $request->lastName;
            $user->middle_name = $request->middleName;
            $user->sex = $request->sex;
            $user->date_of_birth = Carbon::parse($request->birthDate)->format('Y-m-d');
            $user->address = $request->address;
            $user->email = $request->email;
            $user->phone_number = $request->phoneNumber;
            $user->staff_id = $request->staffId;
            $user->department = $request->department;
            $user->role = $request->userRole;
            $user->position = $request->position;
            $user->leave_credits = $request->currentCredits;
            $user->date_hired = Carbon::parse($request->date_hired)->format('Y-m-d');
            $user->password = Hash::make($request->password);

            $user->save();

            DB::commit();

            return back()->with('success', 'Staff has been updated.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
            //throw $th;
        }
    }

    public function store_tardiness(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request->attendances as $value) {
                StaffTardiness::create([
                    'name' => $value['name'],
                    'present' => $value['present'],
                    'absent' => $value['absent']
                ]);
            }
            DB::commit();

            return back()->with('success', 'Attendance has been recorded.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }
}
