<?php

namespace App\Http\Controllers;

use App\Models\Leave;
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
                    "recent" => User::whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
                    "recent_deduction" => User::whereDate('created_at', '>=', Carbon::now()->subDays(7))->whereNotNull('deleted_at')->count(),
                    "total" => User::count()
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
                "syList" => SchoolYear::all()
            ]);
        }

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
            "sy" => SchoolYear::latest()->first()
        ]);
    }

    public function leaveApplicationsJson($sy) {
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

                if($hasRecent && $this->is220BusinessDays($hasRecent->created_at)) {
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

    function is220BusinessDays($date)
    {
        // Calculate the target date 220 business days ago
        $targetDate = Carbon::today();
        $businessDays = 0;

        while ($businessDays < 220) {
            $targetDate->subDay();
            if (!$targetDate->isWeekend()) {
                $businessDays++;
            }
        }

        // Compare the input date with the calculated target date
        return Carbon::parse($date)->isSameDay($targetDate);
    }
}
