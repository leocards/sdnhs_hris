<?php

namespace App\Http\Controllers;

use App\Events\SendNotificationEvent;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Notifications;
use App\Models\PDSEducationalBackground;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $pds = User::find(Auth::id());
        $pds_cs = $request->query('c');
        $pds_cs_section = $request->query('section');

        if(!$pds_cs || $pds_cs === "C1") {
            if($pds_cs_section === "I" || !$pds_cs_section)
                $pds->load(['pdsPersonalInformation']);
            if($pds_cs_section === "II")
                $pds->load(['pdsFamilyBackground']);
            if($pds_cs_section === "III") {
                $newPdsEducationalBackground = PDSEducationalBackground::where('user_id', Auth::id())->get()->map(function ($data) {
                    return collect([
                        'type' => $data->education_type,
                        'ebid' => $data->id,
                        'nameofschool' => $data->school??"",
                        'basiceddegreecourse' => $data->course??"",
                        'period' => collect([ 'from' => $data->from??"", 'to' => $data->to??"" ]),
                        'highestlvl' => $data->highest_earned??"",
                        'yeargraduated' => $data->year_graduated??"",
                        'scholarshiphonor' => $data->honors??"",
                    ]);
                });

                $pds->pds_educational_background = $newPdsEducationalBackground;
            }
        } else if($pds_cs === "C2") {
            if($pds_cs_section === "IV" || !$pds_cs_section)
                $pds->load(['pdsCivilServiceEligibility']);
            if($pds_cs_section === "V")
                $pds->load(['pdsWorkExperience']);
        } else if($pds_cs === "C3") {
            if($pds_cs_section === "VI" || !$pds_cs_section)
                $pds->load(['pdsVoluntaryWork']);
            if($pds_cs_section === "VII")
                $pds->load(['pdsLearningDevelopment']);
            if($pds_cs_section === "VIII")
                $pds->load(['pdsOtherInformation']);
        } else if($pds_cs === "C4") {
            $pds->load(['pdsCs4', 'pdsReference', 'pdsGovernment']);
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'userinfo' => $pds,
            'userRoles' => User::where('role', 'HOD')->orWhere('role', 'HR')->pluck('role'),
            'isApprovedPds' => User::with('pdsPersonalInformation:id,user_id,is_approved')->where('id', Auth::id())->first('id')
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'middle_name' => $request->middleName,
            'sex' => $request->sex,
            'date_of_birth' => Carbon::parse($request->birthDate)->format('Y-m-d'),
            'address' => $request->address,
            'email' => $request->email,
            'phone_number' => $request->phoneNumber,
            'peronnel_id' => $request->personnelId,
            'department' => $request->department,
            'role' => $request->userRole,
            'position' => Auth::user()->role == "HR" ? null:$request->position,
            'date_hired' => Carbon::parse($request->dateHired)->format('Y-m-d'),
        ]);


        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        $userSender = User::find(Auth::id());
        $hr = User::where('role', 'HR')->first();
        $pronoun = $userSender->sex == "Male" ? "his" : "her";

        $notificationResponse = Notifications::create([
            'user_id' => $hr->id,
            'from_user_id' => Auth::id(),
            'message' => ' updated '.$pronoun.' profile',
            'type' => 'profile',
            'go_to_link' => route('general-search.view', [$userSender->id])
        ]);
        if($notificationResponse) {
            $notificationResponse->load(['sender']);
            broadcast(new SendNotificationEvent($notificationResponse, $hr->id));
        }

        return back()->with(['success' => "Profile updated successfully."]);
    }

    public function upload_avatar(Request $request)
    {
        $request->validate([
            'image' => 'required|mimes:png,jpg,jpeg|max:10240', // 10MB max size
        ]);

        $path = null;

        DB::beginTransaction();
        try {

            $path = $request->file('image')->store('public/avatar');

            $user = User::find(Auth::id());

            $user->avatar = str_replace('public', '/storage', $path);

            $user->save();

            DB::commit();

            return back()->with('success', 'Successfully uploaded.');

        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors($th->getMessage());
        }
    }

    public function enableEmails(Request $request)
    {
        $user = User::find(Auth::id());

        $isEnableFor = $request->enableFor;
        $isEnabled = $request->enable;

        if($isEnableFor == "notification")
            $user->enable_email_notification = $isEnabled;

        if($isEnableFor == "message")
            $user->enable_email_message_notification = $isEnabled;

        if($isEnableFor == "note")
            $user->enable_email_note_reminder = $isEnabled;

        $user->save();

        return response()->json('success', 200);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
