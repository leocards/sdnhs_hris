<?php

namespace App\Http\Controllers;

use App\Events\SendNotificationEvent;
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
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceRecordController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status')??"pending";
        $open = $request->query('open');

        if($status != "pending" && $status != "approved" && $status != "rejected" )
            abort(404);

        if(Auth::user()->role == "HR") {

            return Inertia::render('ServiceRecords/HrServiceRecord', [
                'pageData' => ServiceRecord::with('user:id,first_name,last_name,middle_name,avatar')
                    ->where('approved', $status)
                    ->get(),
                'status' => $status,
                "open"=>$open
            ]);
        }

        return Inertia::render('ServiceRecords/ServiceRecords', [
            'records' => ServiceRecord::where('user_id', Auth::id())
                ->where('file_name', '!=', 'Medical certificate')
                ->orderBy('created_at', 'desc')
                ->where('approved', $status)
                ->paginate(50),
            'status' => $status,
            "open"=>$open
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

            // $user = User::find(Auth::id());

            // if($user->role == "Non-teaching" || $user->role == "HOD") {
            //     if ($user->leave_credits === 45) {
            //         throw new Exception('You have already reached the credit limit.');
            //     }
            // } else if ($user->leave_credits === 30) {
            //     throw new Exception('You have already reached the credit limit.');
            // }

            $certificate = ServiceRecord::create([
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
            $notifications_to_send = collect([]);

            // if the notifier is not the HR or Principal
            // send notification to HR or Principal
            if (!in_array(Auth::user()->role, ['HR', 'HOD'])) {
                $receivers = User::whereIn('role', ['HR'])->get(['id', 'email', 'enable_email_notification']);
                foreach ($receivers as $value) {
                    $notif = Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has uploaded a certificate.",
                        'type' => 'certificate',
                        'go_to_link' => route('myapprovals.service-records').'?open='.$certificate->id
                    ]);

                    $notifications_to_send->push($notif);
                }
                $emails_to_send->push(...$receivers);
            } else {
                $receivers = User::whereIn('role', ['HR'])->where('id', '!=', Auth::id())->get(['id', 'email', 'enable_email_notification']);
                foreach ($receivers as $value) {
                    $notif = Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has uploaded \"" . $request->certificateName . "\" certificate.",
                        'type' => 'certificate',
                        'go_to_link' => route('myapprovals.service-records').'?open='.$certificate->id
                    ]);
                    $notifications_to_send->push($notif);
                }
                $emails_to_send->push(...$receivers);
            }

            DB::commit();

            $userSender = User::find(Auth::id());

            $emails_to_send->each(function ($emails) use ($request, $userSender) {
                if ($emails['enable_email_notification'])
                    Mail::to($emails['email'])
                        ->queue(
                            new ProfileUpdate(
                                "recently uploaded a service certificate: " . $request->certificateName,
                                [
                                    "name" => $userSender->name(),
                                    "position" => $userSender->position
                                ],
                                Auth::user()->email
                            )
                        );
            });

            $notifications_to_send->each(function ($notifs) {
                $notifs->load(['sender']);
                broadcast(new SendNotificationEvent($notifs, $notifs->user_id));
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

    public function userCertificates(User $user)
    {
        return response()->json(
            $user->certificates()->where('approved', 'pending')->get()
        );
    }

    public function respondCertificate(Request $request, ServiceRecord $certificate)
    {
        DB::beginTransaction();
        try {

            if($request->respond === "pending")
                throw new Exception("Certificate is neighter rejected or apporved.");

            if ($request->respond === "approved") {
                $user = $certificate->user;
                $credit_limit = $user->role == "Teaching" ? 30 : 45;

                // add the credit
                $credit = $user->leave_credits + $certificate->credits;
                // approve the certificate
                $certificate->approved = "approved";
                // get the remaining credit from the certificate
                $remaining_certificate_credit = $credit - $credit_limit;

                if($remaining_certificate_credit > 0) {
                    // store the reamining credit
                    $certificate->remaining_credits = $remaining_certificate_credit;
                } else {
                    $certificate->status = "added";
                }

                $certificate->save();

                $user->update(['leave_credits' => $credit >= $credit_limit ? $credit_limit : $credit]);

            } else {
                $certificate->approved = "rejected";
                $certificate->status = "rejected";
                $certificate->save();
            }


            $notificationResponse = Notifications::create([
                'user_id' => $certificate->user_id,
                'from_user_id' => Auth::id(),
                'message' => ': Your certificate has been '.$request->respond.' by the HR.',
                'type' => 'response',
                'go_to_link' => route('service-records').'?open='.$certificate->id
            ]);

            DB::commit();

            $notificationResponse->load(['sender']);
            broadcast(new SendNotificationEvent($notificationResponse, $notificationResponse->user_id));

            return back()->with('success', 'Certificate has been '.$request->respond.'.');
        } catch (\Throwable $th) {
            DB::rollBack();

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
