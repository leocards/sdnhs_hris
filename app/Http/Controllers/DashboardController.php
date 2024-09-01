<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        if (in_array(Auth::user()->role, ['HR', 'HOD', 'Principal'])) {
            return Inertia::render("Dashboard", [
                "leaves" => Leave::with(['user:id,first_name,last_name,avatar'])->with('medical_certificate')->orderBy('created_at', 'desc')->paginate(20),
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
                ]
            ]);
        }

        return Inertia::render("Dashboard", [
            "leaves" => Leave::with(['user:id,first_name,last_name,avatar'])->with('medical_certificate')->where('user_id', Auth::id())->orderBy('created_at', 'desc')->paginate(20),
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
            ]
        ]);
    }
}
