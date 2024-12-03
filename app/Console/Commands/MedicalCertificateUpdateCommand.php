<?php

namespace App\Console\Commands;

use App\Events\SendNotificationEvent;
use App\Mail\NotifyMedical;
use App\Models\Leave;
use App\Models\Notifications;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MedicalCertificateUpdateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:medical-certificate-update-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notification to user for with medical certificate overdue 3 or more days.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $leave = Leave::with('user:id,first_name,middle_name,last_name,email')
            ->doesntHave('medical_certificate')
            ->where('leave_type', 'Sick Leave')
            ->where(function ($query) {
                $query->whereDate('inclusive_date_from', '<=', Carbon::today()->subDays(3))
                    ->whereNull('inclusive_date_to')
                    ->orWhereNotNull('inclusive_date_to')
                    ->whereDate('inclusive_date_to', '<=', Carbon::today()->subDays(3));
            })
            ->get(['id', 'user_id']);

        $hr = User::where('role', 'HR')->first();

        $leave->each(function ($leave) use ($hr) {
            $notificationResponse = Notifications::create([
                'user_id' => $leave->user->id,
                'from_user_id' => $hr->id,
                'message' => ': Your medical certificate was due for submission.',
                'type' => 'medical',
                'go_to_link' => route('leave.view', [$leave->id, $leave->user->id])
            ]);

            if($notificationResponse) {
                $notificationResponse->load(['sender']);
                broadcast(new SendNotificationEvent($notificationResponse, $notificationResponse->user_id));
            }

            $emailTo = $leave->user->email;
            $emailToUser = $leave->user->name;
            $hrFrom = $hr->name;

            Mail::to($emailTo)
                ->queue(new NotifyMedical($emailToUser, $hrFrom));
        });
    }
}
