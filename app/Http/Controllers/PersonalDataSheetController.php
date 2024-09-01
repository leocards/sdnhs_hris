<?php

namespace App\Http\Controllers;

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
use App\Models\PersonalDataSheet;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Number;

class PersonalDataSheetController extends Controller
{
    public function store_excel_pds(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        $path = null;

        DB::beginTransaction();
        try {

            $path = $request->file('file')->store('public/PDSfiles');

            PersonalDataSheet::create([
                "file" => $path,
                "original" => $request->file('file')->getClientOriginalName(),
            ]);

            DB::commit();

            return back()->with('success', 'PDS uploaded successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            if (isset($path)) {
                Storage::delete($path);
            }

            return back()->withErrors($th->getMessage());
        }
    }

    public function store_pi(Request $request)
    {

        DB::beginTransaction();
        try {
            $userId = Auth::id();
            $user = User::find($userId);

            $user->birth_place = $request->placeofbirth;
            $user->civil_status = $request->civilstatus['status'] === "Others" ? $request->civilstatus['otherstatus'] : $request->civilstatus['status'];
            $user->height = $request->height;
            $user->weight = $request->weight;
            $user->save();

            $pds_pi = PDSPersonalInformation::updateOrCreate(
                ["id" => $request->piid],
                [
                    'user_id' => $userId,
                    'blood_type' => $request->bloodtype,
                    'gsis' => $request->gsisid,
                    'pag_ibig' => $request->pagibigid,
                    'philhealth' => $request->philhealth,
                    'sss' => $request->sss,
                    'tin' => $request->tin,
                    'agency' => $request->agencyemployee,
                    'telephone' => $request->telephone,
                    'mobile' => $request->mobile,
                    'email' => $request->email,
                    'citizenship' => $request->citizenship['citizen'],
                    'dual_by' => $request->citizenship['dualby'],
                    'citizenship_country' => $request->citizenship['dualcitizencountry']
                ]
            );

            $pds_pi->addresses()->updateOrCreate([
                'address_type' => 'permanent',
                'same' => $request->permanentaddress['isSameResidential'],
                'house_no' => $request->permanentaddress['houselotblockno'],
                'street' => $request->permanentaddress['street'],
                'subdivision' => $request->permanentaddress['subdivision'],
                'barangay' => $request->permanentaddress['barangay'],
                'municipality' => $request->permanentaddress['citymunicipality'],
                'province' => $request->permanentaddress['province'],
                'zip_code' => $request->permanentaddress['zipcode'],
            ]);

            $pds_pi->addresses()->updateOrCreate([
                'address_type' => 'residential',
                'house_no' => $request->residentialaddress['houselotblockno'],
                'street' => $request->residentialaddress['street'],
                'subdivision' => $request->residentialaddress['subdivision'],
                'barangay' => $request->residentialaddress['barangay'],
                'municipality' => $request->residentialaddress['citymunicipality'],
                'province' => $request->residentialaddress['province'],
                'zip_code' => $request->residentialaddress['zipcode'],
            ]);

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors($th->getMessage());
        }
    }

    public function store_fb(Request $request)
    {
        DB::beginTransaction();
        try {

            if ($request->spouse['surname']) {
                PDSFamilyBackground::updateOrCreate(
                    ['id' => $request->spouse['spouseid']],
                    [
                        'user_id' => Auth::id(),
                        'family_type' => 'spouse',
                        'surname' => $request->spouse['surname'],
                        'first_name' => $request->spouse['firstname'],
                        'middle_name' => $request->spouse['middlename'],
                        'extension_name' => $request->spouse['extensionname'],
                        'occupation' => $request->spouse['occupation'],
                        'business_name' => $request->spouse['employerbusiness'],
                        'business_address' => $request->spouse['businessaddress'],
                        'telephone' => $request->spouse['telephone'],
                    ]
                );
            }

            PDSFamilyBackground::updateOrCreate(
                ['id' => $request->father['fatherid']],
                [
                    'user_id' => Auth::id(),
                    'family_type' => 'father',
                    'surname' => $request->father['surname'],
                    'first_name' => $request->father['firstname'],
                    'middle_name' => $request->father['middlename'],
                    'extension_name' => $request->father['extensionname'] ?? null,
                ]
            );

            PDSFamilyBackground::updateOrCreate(
                ['id' => $request->mother['motherid']],
                [
                    'user_id' => Auth::id(),
                    'family_type' => 'mother',
                    'surname' => $request->mother['surname'],
                    'first_name' => $request->mother['firstname'],
                    'middle_name' => $request->mother['middlename'] ?? null,
                ]
            );

            foreach ($request->children as $key => $value) {
                PDSFamilyBackground::updateOrCreate(
                    ['id' => $value['childid']],
                    [
                        'user_id' => Auth::id(),
                        'family_type' => 'child',
                        'full_name' => $value['name'],
                        'birthdate' => Carbon::parse($value['dateOfBirth'])->format('Y-m-d'),
                    ]
                );
            }

            if (!empty($request->deletedChild))
                PDSFamilyBackground::whereIn('id', $request->deletedChild)->delete();

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }

    public function store_eb(Request $request)
    {
        DB::beginTransaction();
        try {
            function createEducationalBackground(string $type, array $data)
            {
                PDSEducationalBackground::updateOrCreate(
                    ['id' => $data['ebid']],
                    [
                        'user_id' => Auth::id(),
                        'education_type' => $type,
                        'school' => $data['nameofschool'],
                        'course' => $data['basiceddegreecourse'],
                        'from' => $data['period']['from'],
                        'to' => $data['period']['to'],
                        'highest_earned' => $data['highestlvl'],
                        'year_graduated' => $data['yeargraduated'],
                        'honors' => $data['scholarshiphonor'],
                    ]
                );
            }

            if ($request->attained['isElementary'])
                createEducationalBackground('elementary', $request->elementary);

            if ($request->attained['isSecondary'])
                createEducationalBackground('secondary', $request->secondary);

            if ($request->attained['isVocational'])
                createEducationalBackground('vocational', $request->vocational);

            if ($request->attained['isCollege'])
                createEducationalBackground('college', $request->college);

            if ($request->attained['isGraduate'])
                createEducationalBackground('graduate', $request->graduatestudies);

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors($th->getMessage());
        }
    }

    public function store_cs(Request $request)
    {
        DB::beginTransaction();
        try {

            $cs = $request->cs;
            $deleted = $request->deletedCS;

            foreach ($cs as $value) {
                PDSCivilServiceEligibility::updateOrCreate(
                    ['id' => $value['csid']],
                    [
                        'user_id' => Auth::id(),
                        'career_service' => $value['eligibility'],
                        'rating' => $value['rating'],
                        'examination' => Carbon::parse($value['dateofexaminationconferment'])->format('Y-m-d'),
                        'place_examination' => $value['placeofexaminationconferment'],
                        'license_number' => $value['license']['number'],
                        'license_date_validity' => Carbon::parse($value['license']['dateofvalidity'])->format('Y-m-d'),
                    ]
                );
            }

            if(!empty($deleted))
                PDSCivilServiceEligibility::whereIn('id', $deleted)->delete();

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollback();

            return back()->withErrors($th->getMessage());
        }
    }

    public function store_we(Request $request)
    {
        DB::beginTransaction();
        try {

            $cs = $request->we;
            $deleted = $request->deletedWE;

            foreach ($cs as $value) {
                PDSWorkExperience::updateOrCreate(
                    ['id' => $value['weid']],
                    [
                        'user_id' => Auth::id(),
                        'from' => Carbon::parse($value['inclusivedates']['from'])->format('Y-m-d'),
                        'to' => Carbon::parse($value['inclusivedates']['to'])->format('Y-m-d'),
                        'position_title' => $value['positiontitle'],
                        'company' => $value['department'],
                        'monthly_salary' => preg_replace('/\B(?=(\d{3})+(?!\d))/', ',', $value['monthlysalary']),
                        'salary_grade' => $value['salarygrade'],
                        'status' => $value['statusofappointment'],
                        'is_government_service' => $value['isgovernment'] === "Y"? true:false,
                    ]
                );
            }

            if(!empty($deleted))
                PDSWorkExperience::whereIn('id', $deleted)->delete();

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollback();

            return back()->withErrors($th->getMessage());
        }
    }

    public function store_vw(Request $request)
    {
        DB::beginTransaction();
        try {

            $cs = $request->vw;
            $deleted = $request->deletedVW;

            foreach ($cs as $value) {
                PDSVoluntaryWork::updateOrCreate(
                    ['id' => $value['vwid']],
                    [
                        'user_id' => Auth::id(),
                        'from' => Carbon::parse($value['inclusivedates']['from'])->format('Y-m-d'),
                        'to' => Carbon::parse($value['inclusivedates']['to'])->format('Y-m-d'),
                        'organization' => $value['nameandaddress'],
                        'num_hours' => $value['numberofhours'],
                        'position' => $value['positionornatureofwork'],
                    ]
                );
            }

            if(!empty($deleted))
                PDSVoluntaryWork::whereIn('id', $deleted)->delete();

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollback();

            return back()->withErrors($th->getMessage());
        }
    }

    public function store_ld(Request $request)
    {
        DB::beginTransaction();
        try {

            $cs = $request->ld;
            $deleted = $request->deletedLD;

            foreach ($cs as $value) {
                PDSLearningDevelopment::updateOrCreate(
                    ['id' => $value['ldid']],
                    [
                        'user_id' => Auth::id(),
                        'title' => $value['title'],
                        'from' => Carbon::parse($value['inclusivedates']['from'])->format('Y-m-d'),
                        'to' => Carbon::parse($value['inclusivedates']['to'])->format('Y-m-d'),
                        'num_hours' => $value['numberofhours'],
                        'type_of_ld' => $value['typeofld'],
                        'conducted_by' => $value['conductedsponsoredby'],
                    ]
                );
            }

            if(!empty($deleted))
                PDSLearningDevelopment::whereIn('id', $deleted)->delete();

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollback();

            return back()->withErrors($th->getMessage());
        }
    }

    public function store_oi(Request $request)
    {
        DB::beginTransaction();
        try {

            $skill = $request->skills;
            $membership = $request->membership;
            $nonacademicrecognition = $request->nonacademicrecognition;
            $deleted = $request->deletedOI;

            foreach ($skill as $value) {
                PDSOtherInformation::updateOrCreate(
                    ['id' => $value['oiid']],
                    [
                        'user_id' => Auth::id(),
                        'info_type' => "skills",
                        'detail' => $value["detail"],
                    ]
                );
            }

            foreach ($nonacademicrecognition as $value) {
                PDSOtherInformation::updateOrCreate(
                    ['id' => $value['oiid']],
                    [
                        'user_id' => Auth::id(),
                        'info_type' => "recognition",
                        'detail' => $value["detail"],
                    ]
                );
            }

            foreach ($membership as $value) {
                PDSOtherInformation::updateOrCreate(
                    ['id' => $value['oiid']],
                    [
                        'user_id' => Auth::id(),
                        'info_type' => "association",
                        'detail' => $value["detail"],
                    ]
                );
            }

            if(!empty($deleted))
                PDSOtherInformation::whereIn('id', $deleted)->delete();

            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollback();

            return back()->withErrors($th->getMessage());
        }
    }

    public function store_c4(Request $request)
    {
        DB::beginTransaction();
        try {
            $c4 = $request->all();

            foreach($c4 as $key => $value) {
                if($key === "q34"){
                    $this->storeCs4Data($value['choicea']['c4id'], '34', 'a', $value['choicea']['choices']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '34', 'b', $value['choiceb']['choices'], $value['choiceb']['details']);
                } else if($key === "q35") {
                    $this->storeCs4Data($value['choicea']['c4id'], '35', 'a', $value['choicea']['choices'], $value['choicea']['details']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '35', 'b', $value['choiceb']['choices'], null, $value['choiceb']['datefiled'], $value['choiceb']['statusofcase']);
                } else if($key === "q36") {
                    $this->storeCs4Data($value['c4id'], '36', 'question', $value['choices'], $value['details']);
                }
                else if($key === "q37") {
                    $this->storeCs4Data($value['c4id'], '37', 'question', $value['choices'], $value['details']);
                } else if($key === "q38") {
                    $this->storeCs4Data($value['choicea']['c4id'], '38', 'a', $value['choicea']['choices'], $value['choicea']['details']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '38', 'b', $value['choiceb']['choices'], $value['choiceb']['details']);
                } else if($key === "q39") {
                    $this->storeCs4Data($value['c4id'], '39', 'question', $value['choices'], $value['details']);
                } else if($key === "q40") {
                    $this->storeCs4Data($value['choicea']['c4id'], '40', 'a', $value['choicea']['choices'], $value['choicea']['details']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '40', 'b', $value['choiceb']['choices'], $value['choiceb']['details']);
                    $this->storeCs4Data($value['choicec']['c4id'], '40', 'c', $value['choicec']['choices'], $value['choicec']['details']);
                } else if($key === "q41") {
                    foreach ($value as $key => $val) {
                        PDSReferences::updateOrCreate(
                            ['id' => $val['c4id']],
                            [
                                'user_id' => Auth::id(),
                                'name' => $val['name'],
                                'address' => $val['address'],
                                'telephone' => $val['telno'],
                            ]
                        );
                    }
                } else {
                    PDSGovernmentId::updateOrCreate(
                        ['id' => $value['c4id']],
                        [
                            'user_id' => Auth::id(),
                            'government_id' => $value['governmentissuedid'],
                            'id_number' => $value['licensepasswordid'],
                            'issued' => $value['issued'],
                        ]
                    );
                }
            }




            DB::commit();

            return back()->with('success', 'Saved successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }

    function storeCs4Data($id = null, string $q, string $set, string $choice, string $details = null, $dateFiled = null, string $caseStatus = null)
    {
        PDSc4::updateOrCreate(
            ['id' => $id],
            [
                'user_id' => Auth::id(),
                'question' => $q,
                'sets' => $set,
                'choices' => $choice === "Yes" ? true : false,
                'details' => $details,
                'date_filed' => $dateFiled ? Carbon::parse($dateFiled)->format('Y-m-d') : null,
                'case_status' => $caseStatus,
            ]
        );
    }
}
