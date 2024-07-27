<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Reports');
    }

    public function saln_index()
    {
        return Inertia::render("Reports/SALNPrint");
    }
}
