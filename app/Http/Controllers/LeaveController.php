<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveRequest;
use App\Mail\LeaveApproval;
use App\Mail\ProfileUpdate;
use App\Models\DetailsOfActionLeave;
use App\Models\DetailsOfLeave;
use App\Models\Leave;
use App\Models\Medical;
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

class LeaveController extends Controller
{
    public function index()
    {

        return Inertia::render('Leave/Leave', ["leaves" => Leave::with(['user:id,first_name,last_name'])->with('medical_certificate')->orderBy('created_at', 'desc')->paginate(50)]);
    }

    public function view(Leave $leave = null, User $user = null)
    {
        if($leave)
            $leave->load(['details_of_leave', 'details_of_action_leave']);

        return Inertia::render('Leave/LeaveView', [
            "user" => $user?->only(['id', 'first_name', 'last_name']),
            "leave" => $leave
        ]);
    }

    public function apply_for_leave()
    {
        return Inertia::render('Leave/ApplyLeave');
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {

            if(Auth::user()->leave_credits < (integer) $request->numDaysApplied) {
                throw new Exception("You don't have enough leave credits.", 1);
            }

            $leave = Leave::create([
                'user_id' => Auth::id(),
                'date_of_filing' => Carbon::parse($request->dateOfFiling)->format('Y-m-d'),
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

            DetailsOfLeave::create([
                'leave_id' => $leave->id,
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

            DetailsOfActionLeave::create([
                'leave_id' => $leave->id,
                'as_of' => $request->certificationLeaveCredits['asOf'],
                'total_earned_vacation' => $request->certificationLeaveCredits['totalEarned']['vacationLeave'],
                'total_earned_sick' => $request->certificationLeaveCredits['totalEarned']['sickLeave'],
                'less_application_vacation' => $request->certificationLeaveCredits['lessThisApplication']['vacationLeave'],
                'less_application_sick' => $request->certificationLeaveCredits['lessThisApplication']['sickLeave'],
                'balanced_vacation' => $request->certificationLeaveCredits['balance']['vacationLeave'],
                'balanced_sick' => $request->certificationLeaveCredits['balance']['sickLeave'],
                'is_for_approval' => $request->recommendation['forApproval'],
                'is_for_disapproval' => $request->recommendation['forDisapproval']['checked'] ? true : null,
                'is_for_disapproval_input' => $request->recommendation['forDisapproval']['checked'] ? $request->recommendation['forDisapproval']['input'] : null,
                'approved_for_days_with_pay' => $request->approvedFor['daysWithPay'],
                'approved_for_days_with_out_pay' => $request->approvedFor['daysWithOutPay'],
                'approved_for_others' => $request->approvedFor['others'],
                'disapproved' => $request->disapprovedDueTo
            ]);

            DB::commit();
            return back()->with('success', 'Application for leave has been submitted.');
        } catch (\Throwable $th) {
            DB::rollBack();

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

            if($request->respond === "approved") {
                if(Auth::user()->role === "HR") {
                    $leave->hr_status = "Approved";
                } else {
                    $leave->principal_status = "Approved";
                }
                $user->leave_credits = ($user->leave_credits - ((integer) $leave->num_days_applied));
                $user->save();
            } else {
                if(Auth::user()->role === "HR") {
                    $leave->hr_status = "Rejected";
                    $leave->hr_reject_msg = $request->message;
                } else {
                    $leave->principal_status = "Rejected";
                    $leave->principal_reject_msg = $request->message;
                }
            }
            $leave->save();

            /* Send email */
            Mail::to($user->email)
                ->queue(new LeaveApproval(User::find(Auth::id()), $user->name(), $request->query('respond'), $request->message));

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
            if($request->auth != Auth::id()) throw new Exception("Unauthorized access");

            if($request->hasFile('file')) {
                $path = $request->file('file')->store('public/medical');

                Medical::where('leave_id', $leave_id->id)->whereNull('is_old_version')->update(['is_old_version' => true]);

                Medical::create([
                    'leave_id' => $leave_id->id,
                    'file_name' => "Medical certificate",
                    'file_path' => $path,
                ]);
                
                Mail::to(env("MAIL_FROM_ADDRESS"))
                    ->queue(new ProfileUpdate("have recently uploaded a medical certificate.", Auth::user()));
                
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
