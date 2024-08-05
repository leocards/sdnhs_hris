<?php

namespace App\Http\Controllers;

use App\Models\PerformanceRating;
use App\Models\Saln;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    private $date;

    function __construct()
    {
        $this->date = Carbon::now();
    }

    public function index(Request $request)
    {
        return Inertia::render('Reports/Reports', [
            "ipcr" => PerformanceRating::with(['user:id,first_name,last_name,middle_name,position'])
                ->join('users', 'performance_ratings.user_id', '=', 'users.id')
                ->whereYear('performance_ratings.created_at', $request->query('ipcr') ?? $this->date->format("Y"))
                ->orderBy('users.last_name')
                ->select('performance_ratings.*')
                ->get(),
            "saln" => Saln::with(['user:id,first_name,last_name,middle_name,position'])->whereYear('created_at', $request->query('saln') ?? $this->date->format("Y"))->get(),
        ]);
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

    public function addIPCRRow(Request $request)
    {
        $user = User::where('personnel_id', $request->add['personnelid'])->first();

        if(!$user) {
            return back()->withErrors("Personnel ID does not exist");
        }

        $request->validate([
            "add.personnelid" => [
                'required', 
                function ($attribute, $value, $fail) use ($user) {
                    if (PerformanceRating::where('user_id', $user->id)
                        ->whereYear('created_at', $this->date->format("Y"))
                        ->exists()) {
                        $fail('The personnel ID already exists.');
                    }
                }
            ],
            'add.rating' => ['required']
        ]);

        DB::beginTransaction();
        try {

            PerformanceRating::create([
                'user_id' => $user->id,
                'rating' => $request->add['rating']
            ]);

            DB::commit();

            return back()->with(['success' => 'Added successfully']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }

    public function addSALNRow(Request $request)
    {
        $user = User::where('personnel_id', $request->add['personnelid'])->first();

        if(!$user) {
            return back()->withErrors("Personnel ID does not exist");
        }

        $request->validate([
            "add.personnelid" => [
                'required', 
                function ($attribute, $value, $fail) use ($user) {
                    if (Saln::where('user_id', $user->id)
                        ->whereYear('created_at', $this->date->format("Y"))
                        ->exists()) {
                        $fail('The personnel ID already exists.');
                    }
                }
            ],
            "add.networth" => ['required'],
            "add.isjoint" => ['boolean'],
        ]);

        DB::beginTransaction();
        try {

            Saln::create([
                "user_id" => $user->id,
                "networth" => $request->add['networth'],
                "spouse" => $request->add['spouse'],
                "joint" => $request->add['isjoint']
            ]);

            DB::commit();

            return back()->with(['success' => 'Added successfully']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }
}
