<?php

namespace App\Http\Controllers;

use App\Models\PersonalDataSheet;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PersonalDataSheetController extends Controller
{
    public function store_pds(Request $request) 
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        $path = null;

        DB::beginTransaction();
        try {

            $path = $request->file('file')->store('public/PDSfiles');

            PersonalDataSheet::create([
                "file" => $path,
                "original" => $request->file('file')->getClientOriginalName(),
            ]);
            
            DB::commit();

            return back()->with('success', 'PDS uploaded successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors($th->getMessage());
        }
    }
}
