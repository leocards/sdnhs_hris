<?php

namespace App\Http\Controllers;

use App\Models\PersonnelTardiness;
use App\Models\ServiceRecord;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\PDSc4;
use App\Models\PDSCivilServiceEligibility;
use App\Models\PDSEducationalBackground;
use App\Models\PDSFamilyBackground;
use App\Models\PDSGovernmentId;
use App\Models\PDSLearningDevelopment;
use App\Models\PDSOtherInformation;
use App\Models\PDSPersonalInformation;
use App\Models\PDSReferences;
use App\Models\PDSVoluntaryWork;
use App\Models\PDSWorkExperience;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index()
    {
        return Inertia::render("Search/Search", [
            "personnels" => User::orderBy('last_name')
                ->get(['id', 'first_name', 'middle_name', 'last_name', 'position', 'department', 'leave_credits', 'avatar']),
        ]);
    }

    public function view_searched(User $user)
    {
        return Inertia::render('Search/SearchedEmployee', [
            'user' => $user,
            'leave' => $user->getLeaveRendered(),
            'open' => session('open'),
        ]);
    }

    public function getPds($userId)
    {
        return response()->json(collect([
            'personalInformation' => PDSPersonalInformation::where('user_id', $userId)->first(),
            'familyBackground' => PDSFamilyBackground::where('user_id', $userId)->get(),
            'educationalBackground' => PDSEducationalBackground::where('user_id', $userId)->get()->map(function ($data) {
                return collect([
                    'type' => $data->education_type,
                    'nameofschool' => $data->school??"",
                    'basiceddegreecourse' => $data->course??"",
                    'period' => collect([ 'from' => $data->from??"", 'to' => $data->to??"" ]),
                    'highestlvl' => $data->highest_earned??"",
                    'yeargraduated' => $data->year_graduated??"",
                    'scholarshiphonor' => $data->honors??"",
                ]);
            }),
            'civilservice' => PDSCivilServiceEligibility::where('user_id', $userId)->get(),
            'workexperience' => PDSWorkExperience::where('user_id', $userId)->get(),
            'voluntarywork' => PDSVoluntaryWork::where('user_id', $userId)->get(),
            'learningdevelopment' => PDSLearningDevelopment::where('user_id', $userId)->get(),
            'otherinformation' => PDSOtherInformation::where('user_id', $userId)->get(),
            'c4' => PDSc4::where('user_id', $userId)->get(),
            'references' => PDSReferences::where('user_id', $userId)->get(),
            'governmentid' => PDSGovernmentId::where('user_id', $userId)->first()
        ]));
    }

    public function indexJson(Request $request)
    {
        $search = $request->query('search');

        return response()->json(
            User::where('first_name', 'LIKE', "{$search}%")
                ->orWhere('last_name', 'LIKE', "{$search}%")
                ->orWhere('middle_name', 'LIKE', "{$search}%")
                ->orWhereHas('certificates', function ($query) use ($search) {
                    $query->where('file_name', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsPersonalInformation', function ($query) use ($search) {
                    $query->where('email', 'LIKE', "{$search}%")
                        ->orWhere('blood_type', 'LIKE', "{$search}%")
                        ->orWhere('gsis', 'LIKE', "{$search}%")
                        ->orWhere('pag_ibig', 'LIKE', "{$search}%")
                        ->orWhere('philhealth', 'LIKE', "{$search}%")
                        ->orWhere('sss', 'LIKE', "{$search}%")
                        ->orWhere('tin', 'LIKE', "{$search}%")
                        ->orWhere('agency', 'LIKE', "{$search}%")
                        ->orWhere('telephone', 'LIKE', "{$search}%")
                        ->orWhere('mobile', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsEducationalBackground', function ($query) use ($search) {
                    $query->where('school', 'LIKE', "{$search}%")
                        ->orWhere('course', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsCivilServiceEligibility', function ($query) use ($search) {
                    $query->where('career_service', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsWorkExperience', function ($query) use ($search) {
                    $query->where('position_title', 'LIKE', "{$search}%")
                        ->orWhere('company', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsVoluntaryWork', function ($query) use ($search) {
                    $query->where('organization', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsLearningDevelopment', function ($query) use ($search) {
                    $query->where('title', 'LIKE', "{$search}%");
                })
                ->orWhereHas('pdsOtherInformation', function ($query) use ($search) {
                    $query->where('detail', 'LIKE', "{$search}%");
                })
                ->get(['id', 'first_name', 'middle_name', 'last_name', 'position', 'department', 'leave_credits'])
        );
    }

    public function attendances(User $user)
    {
        $attendances = PersonnelTardiness::where('user_id', $user->id)->get(['id', 'present', 'absent', 'created_at as year']);

        return response()->json($attendances);
    }

    public function certificates(User $user)
    {
        $certificates = ServiceRecord::where('user_id', $user->id)->get(['id', 'file_name', 'file_path', 'date_from', 'date_to', 'credits']);

        return response()->json($certificates);
    }
}
