<?php

namespace App\Http\Controllers;

use App\Http\Requests\PersonnelRequest;
use App\Models\PersonnelTardiness;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    public function index() 
    {
        return Inertia::render('Personnel/Personnel', [
            'pageData' => User::whereNot('id', Auth::id())
                ->orderBy('first_name', 'ASC')
                ->paginate(50)
        ]);
    }

    public function create() 
    {
        return Inertia::render('Personnel/NewPersonnel');
    }

    public function edit(User $user) 
    {
        return Inertia::render('Personnel/NewPersonnel', [
            "user" => $user
        ]);
    }

    public function tardiness() 
    {
        return Inertia::render('Personnel/PersonnelTardiness', ['attendance' => PersonnelTardiness::orderBy('created_at', 'desc')->paginate(50)]);
    }

    public function indexJson(Request $request): JsonResponse
    {
        $personnel = User::whereNot('id', Auth::id())
            ->when($request->query('filter'), function ($query) use ($request) {
                $filter = $request->query('filter');

                if(in_array($filter, ['Junior High School', 'Senior High School', 'Accounting']))
                    $query->where('department', 'LIKE', $filter)->whereNot('role', 'HOD');

                if(in_array($filter, ['Non-teaching', 'Teaching', 'HOD']))
                    $query->where('role', 'LIKE', $filter);

            })
            ->when($request->query('sort'), function ($query) use ($request) {
                $sort = $request->query('sort');
                
                if($sort['sort'] === "Name")
                    $query->orderBy('first_name', $sort['order']);

                if($sort['sort'] === "Email")
                    $query->orderBy('email', $sort['order']);

                if($sort['sort'] === "Position")
                    $query->orderBy('position', $sort['order']);

                if($sort['sort'] === "Department")
                    $query->orderBy('department', $sort['order']);

            })
            ->paginate(50);

        return response()->json($personnel);
    }

    public function store(PersonnelRequest $request) 
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
                'personnel_id' => $request->personnelId,
                'department' => $request->userRole != "HOD" ? $request->department : null,
                'role' => $request->userRole,
                'position' => $request->position,
                'leave_credits' => $request->userRole != "HOD" ? $request->currentCredits : null,
                'date_hired' => Carbon::parse($request->date_hired)->format('Y-m-d'),
                'password' => Hash::make($request->password)
            ]);

            DB::commit();

            return back()->with('success', 'New personnel has been added.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
            //throw $th;
        }
    }

    public function update(PersonnelRequest $request, User $user = null) 
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
            $user->personnel_id = $request->personnelId;
            $user->department = $request->department;
            $user->role = $request->userRole;
            $user->position = $request->position;
            $user->leave_credits = $request->currentCredits;
            $user->date_hired = Carbon::parse($request->date_hired)->format('Y-m-d');
            $user->password = Hash::make($request->password);

            $user->save();

            DB::commit();

            return back()->with('success', 'Personnel has been updated.');
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
                PersonnelTardiness::create([
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
