<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        if (in_array(Auth::user()->role, ['HR', 'HOD', 'Principal'])) {
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
                "leave" => Leave::when(Auth::user()->role != "HR", function ($query) {
                        $query->where('user_id', Auth::id());
                    })
                    ->when(Auth::user()->role !== "HOD", function ($query) {
                        $query->where('principal_status', 'Approved');
                    })
                    ->where('hr_status', 'Approved')
                    ->get(['id', 'leave_type', 'inclusive_date_from', 'inclusive_date_to']),
                "leaveApplications" => collect([
                    "approved" => Leave::select('leave_type', DB::raw('COUNT(id) as total'))
                        ->where('hr_status', 'Approved')
                        ->where('principal_status', 'Approved')
                        ->groupBy('leave_type')
                        ->get(),
                    "rejected" => Leave::select('leave_type', DB::raw('COUNT(id) as total'))
                        ->where('hr_status', 'Rejected')
                        ->where('principal_status', 'Rejected')
                        ->groupBy('leave_type')
                        ->get()
                ])
            ]);
        }

        return Inertia::render("Dashboard", [
            "totalEmployee" => [
                "recent" => ServiceRecord::where('user_id', Auth::id())->whereDate('created_at', '>=', Carbon::now()->subDays(7))->sum('credits'),
                "recent_deduction" => ServiceRecord::where('user_id', Auth::id())->whereDate('deleted_at', '>=', Carbon::now()->subDays(7))
                    ->whereNotNull('deleted_at')->withTrashed()->sum('credits'),
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
            "leave" => Leave::where('user_id', Auth::id())->where('principal_status', 'Approved')->where('hr_status', 'Approved')
                ->get(['id', 'leave_type', 'inclusive_date_from', 'inclusive_date_to']),
            "leaveApplications" => collect([])
        ]);
    }

    public function personnelList(Request $request)
    {
        $search = $request->search;

        $list = User::with(['leaveApplications' => function ($query) {
                $query->select('leave_type')->whereYear('inclusive_date_from', Carbon::now()->format('Y'))->distinct('leave_type');
            }])
            ->when($search, function ($query) use ($search) {
                $query->where('first_name', 'LIKE', "%{$search}%")
                    ->orWhere('middle_name', 'LIKE', "%{$search}%")
                    ->orWhere('last_name', 'LIKE', "%{$search}%");
            })
            ->orderBy('last_name', 'ASC')
            ->select(['id', 'first_name', 'middle_name', 'last_name', 'avatar'])
            ->paginate(50);

        return response()->json($list);
    }
}
