<?php

namespace App\Http\Controllers;

use App\Models\Leave;
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
                "leaves" => Leave::with(['user:id,first_name,last_name'])->with('medical_certificate')->orderBy('created_at', 'desc')->paginate(20),
                "totalEmployee" => [
                    "recent" => User::whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
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
            "leaves" => Leave::with(['user:id,first_name,last_name'])->with('medical_certificate')->where('user_id', Auth::id())->orderBy('created_at', 'desc')->paginate(20),
            "totalEmployee" => [
                "recent" => User::whereDate('created_at', '>=', Carbon::now()->subDays(7))->count(),
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
}
