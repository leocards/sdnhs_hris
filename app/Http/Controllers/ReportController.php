<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Reports');
    }

    public function upload_saln(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        $path = null;

        DB::beginTransaction();
        try {
            


        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
