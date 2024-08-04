<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        if(!in_array(Auth::user()->role, ['HR', 'HOD', 'Principal']))
        {
            return Inertia::render("Dashboard", [
                "leaves" => Leave::with(['user:id,first_name,last_name'])->with('medical_certificate')->where('user_id', Auth::id())->orderBy('created_at', 'desc')->paginate(20),
            ]);
        }

        return Inertia::render("Dashboard", [
            "leaves" => Leave::with(['user:id,first_name,last_name'])->with('medical_certificate')->orderBy('created_at', 'desc')->paginate(20),
        ]);
    }
}
