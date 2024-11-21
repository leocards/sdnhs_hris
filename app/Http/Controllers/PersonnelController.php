<?php

namespace App\Http\Controllers;

use App\Events\SendNotificationEvent;
use App\Http\Requests\PersonnelRequest;
use App\Mail\AccountCreation;
use App\Models\Notifications;
use App\Models\PersonnelTardiness;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    public function index()
    {
        return Inertia::render('Personnel/Personnel', [
            'pageData' => User::with(['statementOfAssestLiabilities' => function ($query) {
                $query->select('id', 'user_id', 'isApproved', 'asof', 'isjoint')
                      ->whereNull('isApproved');
            }])->whereNot('id', Auth::id())
                ->orderBy('last_name', 'ASC')
                ->paginate(50),
            'statistics' => collect([
                'jhs' => User::where('department', 'Junior High School')->count(),
                'shs' => User::where('department', 'Senior High School')->count(),
                'accounting' => User::where('department', 'Accounting')->count(),
                'admin' => User::where('role', 'HR')->count()
            ]),
            "pds_uploads" => User::whereHas('personalDataSheetExcel')->pluck('id')
        ]);
    }

    public function create()
    {
        return Inertia::render('Personnel/NewPersonnel', [
            'userRoles' => User::where('role', 'HOD')->orWhere('role', 'HR')->pluck('role')
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Personnel/NewPersonnel', [
            "user" => $user,
            'userRoles' => User::where('role', 'HOD')->orWhere('role', 'HR')->pluck('role')
        ]);
    }

    public function tardiness()
    {
        return Inertia::render('Personnel/PersonnelTardiness', [
            'attendance' => PersonnelTardiness::with(['users:id,first_name,last_name,middle_name,avatar,created_at'])
                ->whereYear('created_at', Carbon::now()->format('Y'))
                ->orderBy(
                    User::select('first_name')
                        ->whereColumn('personnel_tardinesses.user_id', 'users.id')
                        ->orderBy('last_name')
                        ->limit(1)
                )
                ->paginate(50),
            'years' => PersonnelTardiness::selectRaw('YEAR(created_at) as year')
                ->distinct()
                ->orderBy('year', 'desc')
                ->pluck('year'),
            'personnels' => User::whereNotIn('role', ['HR', 'HOD'])
                ->get(['id', 'first_name', 'last_name', 'middle_name'])
                ->map(function ($user) {
                    return collect([
                        'personnelId' => $user->id,
                        'name' => $user->name
                    ]);
                }),
            'existing' => (PersonnelTardiness::with(['users:id,first_name,last_name,middle_name,avatar,created_at'])
            ->whereYear('created_at', Carbon::now()->format('Y'))
            ->orderBy(
                User::select('first_name')
                    ->whereColumn('personnel_tardinesses.user_id', 'users.id')
                    ->orderBy('last_name')
                    ->limit(1)
            )->get())
        ]);
    }

    public function tardinessJson(Request $request): JsonResponse
    {
        $year = $request->query('year');
        $month = $request->query('month');

        return response()->json(
            PersonnelTardiness::with('users')
                ->when($year && ($year !== Carbon::now()->format('Y') && $year !== "All"), function ($query) use ($year, $month) {
                    $query->whereYear('created_at', $year)
                        ->when($month && $month !== "All", function ($query) use ($year, $month) {
                            $query->whereMonth('created_at', $month);
                        });
                })
                ->orderBy(
                    User::select('first_name')
                        ->whereColumn('personnel_tardinesses.user_id', 'users.id')
                        ->orderBy('last_name')
                        ->limit(1)
                )
                ->paginate(50)
        );
    }

    public function indexJson(Request $request): JsonResponse
    {
        $personnel = User::whereNot('id', Auth::id())
            ->when($request->query('filter'), function ($query) use ($request) {
                $filter = $request->query('filter');

                if (in_array($filter, ['Junior High School', 'Senior High School', 'Accounting']))
                    $query->where('department', 'LIKE', $filter)->whereNot('role', 'HOD');

                if (in_array($filter, ['Non-teaching', 'Teaching', 'HOD']))
                    $query->where('role', 'LIKE', $filter);
            })
            ->when($request->query('sort'), function ($query) use ($request) {
                $sort = $request->query('sort');

                if ($sort['sort'] === "Name")
                    $query->orderBy('first_name', $sort['order']);

                if ($sort['sort'] === "Email")
                    $query->orderBy('email', $sort['order']);

                if ($sort['sort'] === "Position")
                    $query->orderBy('position', $sort['order']);

                if ($sort['sort'] === "Department")
                    $query->orderBy('department', $sort['order']);
            })
            ->paginate(50);

        return response()->json($personnel);
    }

    public function store(PersonnelRequest $request)
    {
        DB::beginTransaction();
        try {

            $credits = in_array($request->userRole, ['HOD', 'Non-teaching']) ? 45 : 30;

            $user = User::create([
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
                'leave_credits' => $credits,
                'date_hired' => Carbon::parse($request->dateHired)->format('Y-m-d'),
                'password' => Hash::make($request->password),
                'avatar' => '/storage/assets/profile.png',
                'enable_email_notification' => true
            ]);

            DB::commit();

            Mail::to($user->email)
                    ->queue(new AccountCreation(
                        $user->name(),
                        $user->email,
                        "[Login here!](".route('login').")"
                    ));

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
            $user->date_hired = Carbon::parse($request->dateHired)->format('Y-m-d');
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

    public function delete(User $user)
    {
        $user->delete();

        return back()->with('success', 'Successfully deleted.');
    }

    public function store_tardiness(Request $request)
    {
        DB::beginTransaction();
        try {
            foreach ($request->attendances as $value) {
                PersonnelTardiness::create([
                    'user_id' => $value['personnelId'],
                    'name' => $value['name'],
                    'present' => $value['present'],
                    'absent' => $value['absent']
                ]);

                $receiver = User::where('id', $value['personnelId'])->first();

                $notificationResponse = Notifications::create([
                    'user_id' => $receiver->id,
                    'from_user_id' => Auth::id(),
                    'message' => ' has uploaded attendance.',
                    'type' => 'profile',
                    'go_to_link' => route('general-search.view', [$receiver->id]).'?view=attendance'
                ]);

                if($notificationResponse) {
                    $notificationResponse->load(['sender']);
                    broadcast(new SendNotificationEvent($notificationResponse, $receiver->id));
                }
            }


            DB::commit();

            return back()->with('success', 'Attendance has been recorded.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }

    public function update_tardiness(Request $request, PersonnelTardiness $tardiness)
    {
        $attendance = $request->attendances;

        $tardiness->absent = $attendance[0]['absent'];
        $tardiness->present = $attendance[0]['present'];
        $tardiness->save();

        return back()->with("success", "Successfully updated.");
    }

    public function tardiness_search(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $result = User::where('personnel_id', 'LIKE', "%$search%")
            ->orWhere('first_name', 'LIKE', "%$search%")
            ->orWhere('last_name', 'LIKE', "%$search%")
            ->orWhere('middle_name', 'LIKE', "%$search%")
            ->whereNotIn('role', ['HR', 'HOD'])
            ->get(['id', 'first_name', 'last_name', 'middle_name'])
            ->map(function ($user) {
                return collect([
                    'personnelId' => $user->id,
                    'name' => $user->name
                ]);
            });

        return response()->json($result);
    }

    public function delete_tardiness(PersonnelTardiness $tardiness)
    {
        $tardiness->delete();

        return back()->with('success', 'Successfully deleted.');
    }
}
