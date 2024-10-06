<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceRecordRequest;
use App\Mail\ProfileUpdate;
use App\Models\Notifications;
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

    public function indexJson()
    {
        return response()->json(
            ServiceRecord::where('user_id', Auth::id())
                ->where('file_name', '!=', 'Medical certificate')
                ->orderBy('created_at', 'desc')
                ->paginate(50)
        );
    }

    public function store(ServiceRecordRequest $request)
    {
        $path = null;

        DB::beginTransaction();
        try {
            $path = $request->file('file')->store('public/certificates');

            $from = Carbon::parse($request->daysRendered['from']);
            $to = $request->daysRendered['to'] ? Carbon::parse($request->daysRendered['to']) : null;
            $credits = $to ? ($from->diffInDays($to) + 1) : 1;

            User::whereId(Auth::id())->update(['leave_credits' => (Auth::user()->leave_credits + $credits)]);

            ServiceRecord::create([
                'user_id' => Auth::id(),
                'file_name' => $request->certificateName,
                'file_path' => $path,
                'date_from' => $from->format('Y-m-d'),
                'date_to' => $to ? $to->format('Y-m-d') : null,
                'credits' => $credits
            ]);

            if (!in_array(Auth::user()->role, ['HR', 'HOD'])) {
                $receivers = User::whereIn('role', ['HR', 'HOD'])->get('id');
                foreach ($receivers as $value) {
                    Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has uploaded a certificate.",
                        'type' => 'certificate',
                        'go_to_link' => route('general-search.view', [Auth::id()])
                    ]);
                }
            } else {
                $receivers = User::whereIn('role', ['HR', 'HOD'])->where('id', '!=', Auth::id())->get('id');
                foreach ($receivers as $value) {
                    Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has uploaded a certificate.",
                        'type' => 'certificate',
                        'go_to_link' => route('general-search.view', [Auth::id()])
                    ]);
                }
            }

            DB::commit();

            $userSender = User::find(Auth::id());

            Mail::queue(new ProfileUpdate("recently uploaded a service record: " . $request->certificateName, ["name" => $userSender->name(), "position" => $userSender->position], Auth::user()->email));

            return back()->with('success', 'Certificate uploaded successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors($th->getMessage());
        }
    }

    public function delete(ServiceRecord $sr)
    {
        try {
            DB::transaction(function () use ($sr) {

                $user = User::find(Auth::id());

                $credits_remain = intval($user->leave_credits) - intval($sr->credits);

                $user->leave_credits = $credits_remain < 0 ? 0 : $credits_remain;

                $user->save();

                $sr->delete();

            });

            return back()->with('success', 'Deleted successfully.');
        } catch (\Throwable $th) {
            return back()->withErrors($th->getMessage());
        }
    }
}
