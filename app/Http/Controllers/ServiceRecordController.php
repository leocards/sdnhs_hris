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

            $from = Carbon::parse($request->datefrom);
            $to = $request->dateto ? Carbon::parse($request->dateto) : null;
            $credits = $to ? ($from->diffInDays($to) + 1) : 1;

            User::whereId(Auth::id())->update(['leave_credits' => (Auth::user()->leave_credits + $credits)]);

            ServiceRecord::create([
                'user_id' => Auth::id(),
                'file_name' => $request->certificateName,
                'venue' => $request->venue,
                'organizer' => $request->organizer,
                'file_path' => $path,
                'date_from' => $from->format('Y-m-d'),
                'date_to' => $to ? $to->format('Y-m-d') : null,
                'credits' => $credits
            ]);

            $emails_to_send = collect([]);

            // if the notifier is not the HR or Principal
            // send notification to HR or Principal
            if (!in_array(Auth::user()->role, ['HR', 'HOD'])) {
                $receivers = User::whereIn('role', ['HR'])->get(['id', 'email', 'enable_email_notification']);
                foreach ($receivers as $value) {
                    Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has uploaded a certificate.",
                        'type' => 'certificate',
                        'go_to_link' => route('general-search.view', [Auth::id()])
                    ]);
                }
                $emails_to_send->push(...$receivers);
            } else {
                $receivers = User::whereIn('role', ['HR'])->where('id', '!=', Auth::id())->get(['id', 'email', 'enable_email_notification']);
                foreach ($receivers as $value) {
                    Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has uploaded \"".$request->certificateName."\" certificate.",
                        'type' => 'certificate',
                        'go_to_link' => route('general-search.view', [Auth::id()])
                    ]);
                }
                $emails_to_send->push(...$receivers);
            }

            DB::commit();

            $userSender = User::find(Auth::id());

            $emails_to_send->each(function ($emails) use ($request, $userSender) {
                if($emails['enable_email_notification'])
                    Mail::to($emails['email'])
                    ->queue(
                        new ProfileUpdate(
                            "recently uploaded a service certificate: " . $request->certificateName,
                            ["name" => $userSender->name(),
                            "position" => $userSender->position],
                            Auth::user()->email
                        )
                    );
            });

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
