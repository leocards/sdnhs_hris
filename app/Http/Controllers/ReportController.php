<?php

namespace App\Http\Controllers;

use App\Imports\IPCRImport;
use App\Imports\SALNImport;
use App\Models\PerformanceRating;
use App\Models\Saln;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;

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
            "list" => collect([
                "jhs" => DB::table('users')
                    ->select(DB::raw("CONCAT(UPPER(last_name), ', ', UPPER(first_name), ' ', UPPER(IFNULL(CONCAT(SUBSTRING(middle_name, 1, 1), '. '), ''))) AS name, sex"))
                    ->where('department', 'Junior High School')
                    ->get(),
                "shs" => DB::table('users')
                    ->select(DB::raw("CONCAT(UPPER(last_name), ', ', UPPER(first_name), ' ', UPPER(IFNULL(CONCAT(SUBSTRING(middle_name, 1, 1), '. '), ''))) AS name, sex"))
                    ->where('department', 'Senior High School')
                    ->get(),
                "accounting" => DB::table('users')
                    ->select(DB::raw("CONCAT(UPPER(last_name), ', ', UPPER(first_name), ' ', UPPER(IFNULL(CONCAT(SUBSTRING(middle_name, 1, 1), '. '), ''))) AS name, sex"))
                    ->where('department', 'Accounting')
                    ->get(),
                "principal" => User::where('role', 'HOD')->get('sex')
            ]),
            "ipcr" => PerformanceRating::with(['user:id,first_name,last_name,middle_name,position,personnel_id'])
                ->join('users', 'performance_ratings.user_id', '=', 'users.id')
                ->whereYear('performance_ratings.created_at', $request->query('ipcr') ?? $this->date->format("Y"))
                ->orderBy('users.last_name')
                ->select('performance_ratings.*')
                ->get(),
            "saln" => Saln::with(['user' => function ($query) {
                $query->select(['id','first_name','last_name','middle_name','position','personnel_id'])->with(['pdsPersonalInformation:id,user_id,tin']);
            }])
                ->whereYear('created_at', $request->query('saln') ?? $this->date->format("Y"))->get(),
            "principal" => User::where('role', 'HOD')->first(['first_name', 'last_name', 'middle_name', 'position']),
            "hr" => Auth::user()->role == "HR" ? ["name" => Auth::user()->name] : User::where('role', 'HR')->first(['first_name', 'last_name', 'middle_name', 'position']),
        ]);
    }

    public function getIPCRUnlisted()
    {
        return response()->json(
            User::whereDoesntHave('performanceRatings', function ($query) {
               $query->whereYear('created_at', $this->date->format('Y'));
            })
            ->with('performanceRatings:id')
            ->get(['id', 'first_name', 'middle_name', 'last_name'])
        );
    }

    public function getSALNUnlisted()
    {
        return response()->json(
            User::whereDoesntHave('saln', function ($query) {
               $query->whereYear('created_at', $this->date->format('Y'));
            })
            ->with('saln:id')
            ->get(['id', 'first_name', 'middle_name', 'last_name'])
        );
    }

    public function searchIPCR(Request $request)
    {
        $search = $request->search;

        return response()->json(
            User::when($search, function ($query) use ($search) {
                $query->searchByFullName($search);
            })->whereDoesntHave('performanceRatings', function ($query) {
               $query->whereYear('created_at', $this->date->format('Y'));
            })
            ->with('performanceRatings:id')
            ->get(['id', 'first_name', 'middle_name', 'last_name'])
        );
    }

    public function searchSALN()
    {

    }

    public function upload_ipcr(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        // import the file and read its contents.
        $data = Excel::toCollection(new IPCRImport, $request->file('file'));

        DB::beginTransaction();

        try {
            // check if there is data.
            if ($data->count() > 0) {
                // check if there is data
                if ($data[0]->count() !== 0) {

                    foreach ($data[0] as $key => $value) {

                        // check if there is number indicator in the data to verify if it is the valid content to add
                        if (is_int($value[0])) {
                            $searchName = strtolower($value[1]);
                            $searchName = explode(',', $searchName);
                            $searchName = array_map(function($str) {
                                // Remove spaces
                                $str = preg_replace('/\b\w\.\s*/', '', $str);

                                // Remove middle initial (like 'h.' or 'k.')
                                return Str::trim($str);
                            }, $searchName);

                            $user = User::whereIn(DB::raw('first_name'), $searchName)
                                ->whereIn(DB::raw('last_name'), $searchName)
                                ->first(['id']);

                            // validate if user exist and check if it has already been added otherwise add the rating.
                            if ($user){
                                $existIPCR = PerformanceRating::where('user_id', $user->id)->whereYear('created_at', $this->date->format("Y"))->exists();
                                if(!$existIPCR)
                                    PerformanceRating::create([
                                        'user_id' => $user->id,
                                        'rating' => $value[3]
                                    ]);
                            }
                        } else {
                            // break the loop if there is no number indicator.
                            break;
                        }
                    }
                } else {
                    throw new Exception("The sheet is empty.", 1);
                }
            } else {
                throw new Exception("The uploaded file is empty.", 1);
            }

            DB::commit();

            return back()->with('success', 'Uploaded successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }

    }

    public function upload_saln(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        // import the file and read its contents.
        $data = Excel::toCollection(new SALNImport, $request->file('file'));

        DB::beginTransaction();

        try {
            // check if there is data.
            if ($data->count() > 0) {
                // check if there is data
                if ($data[0]->count() !== 0) {

                    foreach ($data[0] as $key => $value) {

                        // check if there is number indicator in the data to verify if it is the valid content to add
                        if (is_int($value[0])) {
                            $searchLName = strtolower($value[1]);
                            $searchFName = strtolower($value[2]);
                            $user = User::searchByLastAndFirstName($searchLName, $searchFName)->first('id');

                            // validate if user exist and check if it has already been added otherwise add the rating.
                            if ($user){
                                $existIPCR = Saln::where('user_id', $user->id)->whereYear('created_at', $this->date->format("Y"))->exists();
                                if(!$existIPCR)
                                    Saln::create([
                                        'user_id' => $user->id,
                                        "networth" => $value[6],
                                        "spouse" => $value[7],
                                        "joint" => $value[8] === "/" ? true : false,
                                        'rating' => $value[3]
                                    ]);
                            }
                        } else {
                            // break the loop if there is no number indicator.
                            break;
                        }
                    }
                } else {
                    throw new Exception("The sheet is empty.", 1);
                }
            } else {
                throw new Exception("The uploaded file is empty.", 1);
            }

            DB::commit();

            return back()->with('success', 'Uploaded successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }

    public function addIPCRRow(Request $request)
    {
        $user = User::where('id', $request->add['personnelid']['id'])->first();

        if (!$user) {
            return back()->withErrors("Personnel does not exist");
        }

        $request->validate([
            "add.personnelid.name" => [
                'required',
                function ($attribute, $value, $fail) use ($user) {
                    if (PerformanceRating::where('user_id', $user->id)
                        ->whereYear('created_at', $this->date->format("Y"))
                        ->exists()
                    ) {
                        $fail('The personnel already exists.');
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
        $user = User::where('personnel_id', $request->add['personnelid']['id'])->first();

        if (!$user) {
            return back()->withErrors("Personnel does not exist");
        }

        $request->validate([
            "add.personnelid.name" => [
                'required',
                function ($attribute, $value, $fail) use ($user) {
                    if (Saln::where('user_id', $user->id)
                        ->whereYear('created_at', $this->date->format("Y"))
                        ->exists()
                    ) {
                        $fail('The personnel already exists.');
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

    public  function updateIPCRRow(Request $request, PerformanceRating $ipcrId)
    {
        $ipcrId->rating = $request->add['rating'];
        $ipcrId->save();

        return back()->with(['success' => 'Updated successfully']);
    }

    public  function updateSALNRow(Request $request, Saln $salnId)
    {
        $salnId->networth = $request->add['networth'];
        $salnId->spouse = $request->add['spouse'];
        $salnId->joint = $request->add['isjoint'];
        $salnId->save();

        return back()->with(['success' => 'Updated successfully']);
    }

    public  function deleteIPCRRow(PerformanceRating $ipcrId)
    {
        $ipcrId->delete();

        return back()->with(['success' => 'Deleted successfully']);
    }

    public  function deleteSALNRow(Saln $salnId)
    {
        $salnId->delete();

        return back()->with(['success' => 'Deleted successfully']);
    }
}
