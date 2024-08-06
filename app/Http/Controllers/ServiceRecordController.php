<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceRecordRequest;
use App\Mail\ProfileUpdate;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceRecordController extends Controller
{
    public function index()
    {
        return Inertia::render('ServiceRecords/ServiceRecords', [
            'records' => ServiceRecord::where('user_id', Auth::id())
                ->where('file_name', '!=', 'Medical certificate')
                ->orderBy('created_at', 'desc')
                ->paginate(50)
        ]);
    }

    public function store(ServiceRecordRequest $request)
    {
        $path = null;

        DB::beginTransaction();
        try {
            $path = $request->file('file')->store('public/certificates');

            $from = Carbon::parse($request->daysRendered['from']);
            $to = $request->daysRendered['to'] ? Carbon::parse($request->daysRendered['to']) : null;

            User::whereId(Auth::id())->update(['leave_credits' => (Auth::user()->leave_credits + ($to ? ($from->diffInDays($to) + 1) : 1))]);

            ServiceRecord::create([
                'user_id' => Auth::id(),
                'file_name' => $request->certificateName,
                'file_path' => $path,
                'date_from' => $from->format('Y-m-d'),
                'date_to' => $to ? $to->format('Y-m-d') : null
            ]);

            DB::commit();

            $userSender = User::find(Auth::id());

            Mail:: queue(new ProfileUpdate("recently uploaded a service record: ".$request->certificateName, ["name" => $userSender->name(), "position" => $userSender->position], Auth::user()->email));

            return back()->with('success', 'Certificate uploaded successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors($th->getMessage());
        }
    }
}
