<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render("Dashboard", [
            "leaves" => Leave::with(['user:id,first_name,last_name'])->with('medical_certificate')->orderBy('created_at', 'desc')->paginate(20),

        ]);
    }
}
