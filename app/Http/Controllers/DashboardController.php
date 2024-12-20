<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\PerformanceRating;
use App\Models\SchoolYear;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $latestSy;

    function __construct()
    {
        $this->latestSy = SchoolYear::latest()->first();
    }

    public function index()
    {
        if (in_array(Auth::user()->role, ['HR'])) {
            return Inertia::render("Dashboard", [
                "totalEmployee" => [
                    "recent" => User::whereDate('created_at', '>=', Carbon::now()->subDays(7))->whereNot('role', 'HR')->count(),
                    "recent_deduction" => User::whereDate('created_at', '>=', Carbon::now()->subDays(7))
                        ->whereNot('role', 'HR')
                        ->whereNotNull('deleted_at')
                        ->count(),
                    "total" => User::whereNot('role', 'HR')->count()
                ],
                "approved" => [
                    "recent" => Leave::where('principal_status', 'Approved')->where('hr_status', 'Approved')->whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
                    "total" => Leave::where('principal_status', 'Approved')->where('hr_status', 'Approved')->count(),
                ],
                "pending" => [
                    "recent" => Leave::where('principal_status', 'Pending')->where('hr_status', 'Pending')->whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
                    "total" => Leave::where('principal_status', 'Pending')->where('hr_status', 'Pending')->count(),
                ],
                "reject" => [
                    "recent" => Leave::where('principal_status', 'Rejected')->where('hr_status', 'Rejected')->whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
                    "total" => Leave::where('principal_status', 'Rejected')->where('hr_status', 'Rejected')->count(),
                ],
                "leave" => Leave::with('user')
                    ->when(Auth::user()->role == "HOD", function ($query) {
                        $query->where('user_id', Auth::id());
                    })
                    ->where('hr_status', 'Approved')
                    ->where(function ($query) {
                        $query->whereDate('inclusive_date_from', '<=', Carbon::now()->format('Y-m-d'))
                            ->whereDate('inclusive_date_to', '>=', Carbon::now()->format('Y-m-d'))
                            ->orWhereDate('inclusive_date_from', '<=', Carbon::now()->format('Y-m-d'))
                            ->whereNull('inclusive_date_to');
                    })
                    ->get(['id', 'user_id', 'leave_type', 'inclusive_date_from', 'inclusive_date_to']),
                "leaveApplications" => collect([
                    "approved" => Leave::select('leave_type', DB::raw('COUNT(id) as total'))
                        ->where('hr_status', 'Approved')
                        ->where('principal_status', 'Approved')
                        ->where('sy', $this->latestSy?->sy)
                        ->groupBy('leave_type')
                        ->get(),
                    "rejected" => Leave::select('leave_type', DB::raw('COUNT(id) as total'))
                        ->where('hr_status', 'Rejected')
                        ->where('principal_status', 'Rejected')
                        ->where('sy', $this->latestSy?->sy)
                        ->groupBy('leave_type')
                        ->get()
                ]),
                "appliedLeavesOfPersonnel" => Leave::select('leave_type')
                    ->whereIn('id', function ($query) {
                        $query->selectRaw('MAX(id)')
                            ->from('leaves')
                            ->where('sy', $this->latestSy?->sy)
                            ->whereIn('principal_status', ['Approved', 'Rejected'])
                            ->whereIn('hr_status', ['Approved', 'Rejected'])
                            ->groupBy('leave_type');
                    })
                    ->latest('created_at')
                    ->get(),
                "sy" => SchoolYear::latest()->first(),
                "syList" => SchoolYear::all(),
                "ratings" => $this->getMostOutstandingPersonnel(),
                "genderProportion" => User::selectRaw('sex, COUNT(*) as count')
                    ->whereNot('role', 'HR')
                    ->groupBy('sex')
                    ->pluck('count', 'sex')
                    ->toArray()
            ]);
        }

        $school_years = SchoolYear::latest()->limit(7)->get()->pluck('sy');

        return Inertia::render("Dashboard", [
            "totalEmployee" => [
                "recent" => ServiceRecord::where('user_id', Auth::id())->where('status', 'added')->whereDate('created_at', '>=', Carbon::now()->subDays(7))->sum('credits'),
                "recent_deduction" => ServiceRecord::where('user_id', Auth::id())->whereDate('deleted_at', '>=', Carbon::now()->subDays(7))
                    ->whereNotNull('deleted_at')/* ->withTrashed() */->sum('credits'),
                "total" => 0
            ],
            "approved" => [
                "recent" => Leave::where('user_id', Auth::id())->where('principal_status', 'Approved')->where('hr_status', 'Approved')->whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
                "total" => Leave::where('user_id', Auth::id())->where('principal_status', 'Approved')->where('hr_status', 'Approved')->count(),
            ],
            "pending" => [
                "recent" => Leave::where('user_id', Auth::id())->where('principal_status', 'Pending')->where('hr_status', 'Pending')->whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
                "total" => Leave::where('user_id', Auth::id())->where('principal_status', 'Pending')->where('hr_status', 'Pending')->count(),
            ],
            "reject" => [
                "recent" => Leave::where('user_id', Auth::id())->where('principal_status', 'Rejected')->where('hr_status', 'Rejected')->whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
                "total" => Leave::where('user_id', Auth::id())->where('principal_status', 'Rejected')->where('hr_status', 'Rejected')->count(),
            ],
            "leave" => Leave::with('user:id,first_name,last_name,middle_name')
                ->where('user_id', Auth::id())
                ->where('principal_status', 'Approved')
                ->where('hr_status', 'Approved')
                ->get(['id', 'leave_type', 'inclusive_date_from', 'inclusive_date_to']),
            "leaveApplications" => collect([]),
            "sy" => SchoolYear::latest()->first(),
            "sy_ratings" => PerformanceRating::where('user_id', Auth::id())->whereIn('sy', $school_years)->orderBy('sy', 'asc')->get(['sy', 'rating'])->map(function ($item) {
                // Convert rating to an integer
                $item->rating = (float) $item->rating;
                return $item;
            })
        ]);
    }

    public function leaveApplicationsJson($sy)
    {
        try {
            return response()->json(collect([
                "leaveApplications" => collect([
                    "approved" => Leave::select('leave_type', DB::raw('COUNT(id) as total'))
                        ->where('hr_status', 'Approved')
                        ->where('principal_status', 'Approved')
                        ->where('sy', $sy)
                        ->groupBy('leave_type')
                        ->get(),
                    "rejected" => Leave::select('leave_type', DB::raw('COUNT(id) as total'))
                        ->where('hr_status', 'Rejected')
                        ->where('principal_status', 'Rejected')
                        ->where('sy', $sy)
                        ->groupBy('leave_type')
                        ->get()
                ]),
                "appliedLeavesOfPersonnel" => Leave::select('leave_type')
                    ->whereIn('id', function ($query) use ($sy) {
                        $query->selectRaw('MAX(id)')
                            ->from('leaves')
                            ->where('sy', $sy)
                            ->whereIn('principal_status', ['Approved', 'Rejected'])
                            ->whereIn('hr_status', ['Approved', 'Rejected'])
                            ->groupBy('leave_type');
                    })
                    ->latest('created_at')
                    ->get()
            ]));
        } catch (\Throwable $th) {
            return response()->json($th->getMessage());
        }
    }

    public function personnelList(Request $request)
    {
        $search = $request->search;
        $sy = SchoolYear::latest()->first();

        $list = User::with(['leaveApplications' => function ($query) use ($sy) {
            $query->select(['user_id', 'leave_type'])->where('sy', $sy->sy)->distinct('leave_type');
        }])
            ->whereNot('role', 'HR')
            ->when($search, function ($query) use ($search) {
                $query->where('first_name', 'LIKE', "%{$search}%")
                    ->orWhere('middle_name', 'LIKE', "%{$search}%")
                    ->orWhere('last_name', 'LIKE', "%{$search}%");
            })
            ->orderBy('last_name', 'ASC')
            ->select(['id', 'first_name', 'middle_name', 'last_name', 'avatar', 'sex', 'role'])
            ->paginate(50);

        return response()->json($list);
    }

    public function getSY()
    {
        return response()->json(SchoolYear::latest()->first());
    }

    public function newSchoolYear(Request $request)
    {
        try {

            DB::transaction(function () use ($request) {
                $hasRecent = SchoolYear::latest()->first();

                if ($hasRecent && $this->checkIfPreviousSYHasNotEnded($hasRecent->end)) {
                    throw new Exception('The current school year has not ended yet.');
                }

                SchoolYear::create([
                    'start' => Carbon::parse($request->start)->format('Y-m-d'),
                    'end' => Carbon::parse($request->end)->format('Y-m-d'),
                    'resumption' => Carbon::parse($request->resumption)->format('Y-m-d')
                ]);

                User::whereIn('role', ['Non-teaching', 'HOD'])->update(['leave_credits' => 45]);
                User::where('role', 'Teaching')->update(['leave_credits' => 30]);
            });

            return back()->with('success', 'success');
        } catch (\Throwable $th) {
            return back()->withErrors($th->getMessage());
        }
    }

    function checkIfPreviousSYHasNotEnded($date)
    {
        // Calculate the target date 220 business days ago
        $currentDate = Carbon::today();

        // Compare the input date with the calculated target date
        return $currentDate->lessThanOrEqualTo(Carbon::parse($date));
    }

    function getMostOutstandingPersonnel($year = "all")
    {
        $users = User::select(['id', 'first_name', 'middle_name', 'last_name', 'avatar'])
            ->withAvg('performanceRatings as ratings', 'rating')
            ->where('role', 'Teaching')
            ->get();

        [$aboveThreshold, $belowThreshold] = $users->partition(function ($user) {
            return $user->ratings >= 3.5;
        });

        return collect([
            'outstanding' => $aboveThreshold->sortByDesc('ratings')->values(),
            'least_performing' => $belowThreshold->sortByDesc('ratings')->values()
        ]);
    }
}
