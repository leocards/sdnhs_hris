<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
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
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
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
            'position' => $request->position,
            //'leave_credits' => $request->currentCredits,
            'date_hired' => Carbon::parse($request->date_hired)->format('Y-m-d'),
        ]);


        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

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
