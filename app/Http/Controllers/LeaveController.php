<?php

namespace App\Http\Controllers;

use App\Events\SendNotificationEvent;
use App\Http\Requests\LeaveRequest;
use App\Mail\LeaveApproval;
use App\Mail\ProfileUpdate;
use App\Models\DetailsOfActionLeave;
use App\Models\DetailsOfLeave;
use App\Models\Leave;
use App\Models\Medical;
use App\Models\Notifications;
use App\Models\ServiceRecord;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LeaveController extends Controller
{
    public function index()
    {
        return Inertia::render('Leave/Leave', [
            "pageData" => Leave::with(['user:id,first_name,last_name,avatar'])
                ->when(!in_array(Auth::user()->role, ['HR', 'HOD', 'Principal']), function ($query) {
                    return $query->where('user_id', Auth::id());
                })
                ->with('medical_certificate')
                ->orderBy('created_at', 'desc')
                ->paginate(50),
        ]);
    }

    public function indexJson(Request $request)
    {
        return response()->json(
            Leave::with(['user:id,first_name,last_name'])
                ->with('medical_certificate')
                ->when($request->query('filter') && $request->query('filter') != "All", function ($query) use ($request) {
                    return $query->where('hr_status', $request->query('filter'))
                        ->orWhere('principal_status', $request->query('filter'));
                })
                ->when(!in_array(Auth::user()->role, ['HR', 'HOD', 'Principal']), function ($query) {
                    return $query->where('user_id', Auth::id());
                })
                ->when($request->query('sort')['sort'], function ($query) use ($request) {
                    if ($request->query('sort')['sort'] == "Date created") {
                        $query->orderBy('created_at', $request->query('sort')['order']);
                    }
                    if ($request->query('sort')['sort'] == "Leave type") {
                        $query->orderBy('leave_type', $request->query('sort')['order']);
                    }
                    if (in_array(Auth::user()->role, ['HR', 'HOD', 'Principal']))
                        if ($request->query('sort')['sort'] == "Name") {
                            $query->join('users', 'users.id', '=', 'leaves.user_id')
                                ->orderBy('users.first_name', $request->query('sort')['order'])
                                ->select('leaves.*');
                        }
                })
                ->when($request->query('search'), function ($query) use ($request) {
                    $search = $request->query('search');
                    $query->join('users', 'users.id', '=', 'leaves.user_id')
                        ->where('leaves.leave_type', 'LIKE', '%' . $search . '%')
                        ->when(in_array(Auth::user()->role, ['HR', 'HOD', 'Principal']), function ($query) use ($search) {
                            $query->orWhere('users.first_name', 'LIKE', '%' . $search . '%');
                        })
                        ->select('leaves.*');
                })
                ->paginate(50)
        );
    }

    public function view(Leave $leave = null, User $user = null)
    {
        if ($leave)
            $leave->load(['details_of_leave', 'details_of_action_leave', 'medical_certificate', 'user']);

        return Inertia::render('Leave/ApplicationForLeavePDF', [
            "user" => $user?->only(['id', 'first_name', 'last_name']),
            "leave" => $leave,
            "hr" => User::where('role', 'HR')->first()->completeName(),
            "open" => session('open')
        ]);
    }

    public function apply_for_leave()
    {
        return Inertia::render('Leave/ApplyLeave');
    }

    public function store(Request $request)
    {
        $path = null;

        DB::beginTransaction();
        try {

            if($request->leavetype['type'] !== "Maternity Leave")
                if (Auth::user()->leave_credits < (int) $request->numDaysApplied) {
                    throw new Exception("You don't have enough leave credits.", 1);
                }

            $leave = Leave::create([
                'user_id' => Auth::id(),
                'date_of_filing_from' => Carbon::parse($request->dateOfFiling['from'])->format('Y-m-d'),
                'date_of_filing_to' => $request->dateOfFiling['to'] ? Carbon::parse($request->dateOfFiling['to'])->format('Y-m-d') : null,
                'salary' => $request->salary,
                'leave_type' => $request->leavetype['type'],
                'leave_type_others' => $request->leavetype['type'] === "Others" ? $request->leavetype['others'] : null,
                'num_days_applied' => $request->numDaysApplied,
                'inclusive_date_from' => Carbon::parse($request->inclusiveDates['from'])->format('Y-m-d'),
                'inclusive_date_to' => Carbon::parse($request->inclusiveDates['to'])->format('Y-m-d') ?? null,
                'is_not_requested' => $request->commutation['notRequested'] ?? null,
                'is_requested' => $request->commutation['requested'] ?? null,
            ]);

            $checkedFields = [
                $request->detailsOfLeave['vacation_special']['withinPhilippines']['checked'] ?? false,
                $request->detailsOfLeave['vacation_special']['abroad']['checked'] ?? false,
                $request->detailsOfLeave['sick']['inHospital']['checked'] ?? false,
                $request->detailsOfLeave['sick']['outPatient']['checked'] ?? false,
                !empty($request->detailsOfLeave['benefitsForWomen']),
                $request->detailsOfLeave['study']['degree'] ?? false,
                $request->detailsOfLeave['study']['examReview'] ?? false,
                $request->detailsOfLeave['other']['monetization'] ?? false,
                $request->detailsOfLeave['other']['terminal'] ?? false,
            ];

            $leave->details_of_leave()->create([
                'is_philippines' => $checkedFields[0] ? true : null,
                'is_philippines_input' => $checkedFields[0] ? $request->detailsOfLeave['vacation_special']['withinPhilippines']['input'] : null,
                'is_abroad' => $checkedFields[1] ? true : null,
                'is_abroad_input' => $checkedFields[1] ? $request->detailsOfLeave['vacation_special']['abroad']['input'] : null,
                'is_in_hospital' => $checkedFields[2] ? true : null,
                'is_in_hospital_input' => $checkedFields[2] ? $request->detailsOfLeave['sick']['inHospital']['input'] : null,
                'is_out_patient' => $checkedFields[3] ? true : null,
                'is_out_patient_input' => $checkedFields[3] ? $request->detailsOfLeave['sick']['outPatient']['input'] : null,
                'special_leave_women' => $checkedFields[4] ? $request->benefitsForWomen : null,
                'is_master_degree' => $checkedFields[5] ? true : null,
                'is_review' => $checkedFields[6] ? true : null,
                'is_monetization' => $checkedFields[7] ? true : null,
                'is_terminal_leave' => $checkedFields[8] ? true : null
            ]);

            // $leave->details_of_action_leave()->create([
                // 'as_of' => $request->certificationLeaveCredits['asOf'],
                // 'total_earned_vacation' => $request->certificationLeaveCredits['totalEarned']['vacationLeave'],
                // 'total_earned_sick' => $request->certificationLeaveCredits['totalEarned']['sickLeave'],
                // 'less_application_vacation' => $request->certificationLeaveCredits['lessThisApplication']['vacationLeave'],
                // 'less_application_sick' => $request->certificationLeaveCredits['lessThisApplication']['sickLeave'],
                // 'balanced_vacation' => $request->certificationLeaveCredits['balance']['vacationLeave'],
                // 'balanced_sick' => $request->certificationLeaveCredits['balance']['sickLeave'],
                // 'is_for_approval' => $request->recommendation['forApproval'],
                // 'is_for_disapproval' => $request->recommendation['forDisapproval']['checked'] ? true : null,
                // 'is_for_disapproval_input' => $request->recommendation['forDisapproval']['checked'] ? $request->recommendation['forDisapproval']['input'] : null,
                // 'approved_for_days_with_pay' => $request->approvedFor['daysWithPay'],
                // 'approved_for_days_with_out_pay' => $request->approvedFor['daysWithOutPay'],
                // 'approved_for_others' => $request->approvedFor['others'],
                // 'disapproved' => $request->disapprovedDueTo
            // ]);

            // Not hr or principal user
            if (!in_array(Auth::user()->role, ['HR', 'HOD'])) {
                $receivers = User::whereIn('role', ['HR', 'HOD'])->get('id');
                foreach ($receivers as $value) {
                    $notification = Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has submitted an Application for leave.",
                        'type' => 'leave',
                        'go_to_link' => route('leave.view', [$leave->id, Auth::id()])
                    ]);

                    $notification->load(['sender']);

                    broadcast(new SendNotificationEvent($notification, $value['id']));
                }
            } else {
                $receivers = User::whereIn('role', ['HR', 'HOD'])->where('id', '!=', Auth::id())->get('id');
                foreach ($receivers as $value) {
                    $notification = Notifications::create([
                        'user_id' => $value['id'],
                        'from_user_id' => Auth::id(),
                        'message' => " has submitted an Application for leave.",
                        'type' => 'leave',
                        'go_to_link' => route('leave.view', [$leave->id, Auth::id()])
                    ]);

                    $notification->load(['sender']);

                    broadcast(new SendNotificationEvent($notification, $value['id']));
                }
            }

            if ($request->hasFile('medicalForMaternity')) {
                $path = $request->file('medicalForMaternity')->store('public/medical');

                Medical::create([
                    'leave_id' => $leave->id,
                    'file_name' => "Medical 41",
                    'file_path' => $path,
                ]);
            }

            DB::commit();
            return back()->with('success', 'Application for leave has been submitted.');
        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors($th->getMessage());
        }
    }

    public function application_for_leave_action(Request $request, User $user, Leave $leave)
    {
        $request->validate([
            "respond" => ["in:rejected,approved"],
            "message" => ['required_if:respond,rejected', 'max:1000']
        ]);

        DB::beginTransaction();
        try {

            $notificationResponse = null;

            if ($request->respond === "approved") {
                if (Auth::user()->role === "HR") {
                    $leave->hr_status = "Approved";

                    $notificationResponse = Notifications::create([
                        'user_id' => $user->id,
                        'from_user_id' => Auth::id(),
                        'message' => ': Your application for leave has been approved by the HR.',
                        'type' => 'response',
                        'go_to_link' => route('leave.view', [$leave->id, $user->id])
                    ]);

                } else {
                    $leave->principal_status = "Approved";

                    $notificationResponse = Notifications::create([
                        'user_id' => $user->id,
                        'from_user_id' => Auth::id(),
                        'message' => ': Your application for leave has been approved by the Principal.',
                        'type' => 'response',
                        'go_to_link' => route('leave.view', [$leave->id, $user->id])
                    ]);
                }
                $user->leave_credits = ($user->leave_credits - ((int) $leave->num_days_applied));
                $user->save();
            } else {
                if (Auth::user()->role === "HR") {
                    $leave->hr_status = "Rejected";
                    $leave->hr_reject_msg = $request->message;

                    $notificationResponse = Notifications::create([
                        'user_id' => $user->id,
                        'from_user_id' => Auth::id(),
                        'message' => ': Your application for leave has been rejected by the HR.',
                        'type' => 'response',
                        'go_to_link' => route('leave.view', [$leave->id, $user->id])
                    ]);
                } else {
                    $leave->principal_status = "Rejected";
                    $leave->principal_reject_msg = $request->message;

                    $notificationResponse = Notifications::create([
                        'user_id' => $user->id,
                        'from_user_id' => Auth::id(),
                        'message' => ': Your application for leave has been rejected by the HR.',
                        'type' => 'response',
                        'go_to_link' => route('leave.view', [$leave->id, $user->id])
                    ]);
                }
            }
            $leave->save();

            /* Send email */
            $userSender = User::find(Auth::id());

            if($notificationResponse) {
                $notificationResponse->load(['sender']);
                broadcast(new SendNotificationEvent($notificationResponse, $notificationResponse->user_id));
            }

            if($userSender->role != "HR" && $user->enable_email_notification)
                Mail::to($user->email)
                    ->queue(new LeaveApproval(["name" => $userSender->name(), "position" => $userSender->position], $user->name(), $request->query('respond'), $request->message));

            DB::commit();

            return back()->with('success', 'Respond sent successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }

    public function upload_medical(Request $request, Leave $leave_id)
    {
        $request->validate([
            "file" => ['required', 'mimes:pdf,jpeg,jpg,png', 'max:10240']
        ]);

        $path = null;

        DB::beginTransaction();
        try {
            if ($request->auth != Auth::id()) throw new Exception("Unauthorized access");

            if ($request->hasFile('file')) {
                $path = $request->file('file')->store('public/medical');

                Medical::where('leave_id', $leave_id->id)->whereNull('is_old_version')->update(['is_old_version' => true]);

                Medical::create([
                    'leave_id' => $leave_id->id,
                    'file_name' => "Medical certificate",
                    'file_path' => $path,
                ]);

                $notification = null;

                if (!in_array(Auth::user()->role, ['HR', 'HOD'])) {
                    $receivers = User::whereIn('role', ['HR', 'HOD'])->get('id');
                    foreach ($receivers as $value) {
                        $notification = Notifications::create([
                            'user_id' => $value['id'],
                            'from_user_id' => Auth::id(),
                            'message' => ": has uploaded medical certificate.",
                            'type' => 'medical',
                            'go_to_link' => route('leave.view', [$leave_id->id, Auth::id()])
                        ]);
                    }
                } else {
                    $receivers = User::whereIn('role', ['HR', 'HOD'])->where('id', '!=', Auth::id())->get('id');
                    foreach ($receivers as $value) {
                        $notification = Notifications::create([
                            'user_id' => $value['id'],
                            'from_user_id' => Auth::id(),
                            'message' => ": has uploaded medical certificate.",
                            'type' => 'medical',
                            'go_to_link' => route('leave.view', [$leave_id->id, Auth::id()])
                        ]);
                    }
                }

                $userSender = User::find(Auth::id());

                if($notification) {
                    $notification->load(['sender']);
                    broadcast(new SendNotificationEvent($notification, $notification->user_id));
                }

                Mail::to(env("MAIL_FROM_ADDRESS"))
                    ->queue(new ProfileUpdate("recently uploaded a medical certificate.", ["name" => $userSender->name(), "position" => $userSender->position], Auth::user()->email));

                DB::commit();

                return back()->with('success', 'Medical certificate uploaded successfully.');
            } else {
                throw new Exception("Missing file");
            }
        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors($th->getMessage());
        }
    }
}
