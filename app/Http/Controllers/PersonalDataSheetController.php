<?php

namespace App\Http\Controllers;

use App\Imports\PDSImport;
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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Number;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class PersonalDataSheetController extends Controller
{
    public function store_excel_pds(Request $request, User $user)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // 10MB max size
        ]);

        $data = Excel::toCollection(new PDSImport, $request->file('file'));

        $path = null;

        // dd($data["C3"]);

        DB::beginTransaction();
        try {

            /* $path = $request->file('file')->store('public/PDSfiles');

            PersonalDataSheet::create([
                'user_id' => $user->id,
                "file" => $path,
                "original" => $request->file('file')->getClientOriginalName(),
            ]); */


            $this->getC1Data($data["C1"], $user);
            $this->getC2Data($data["C2"], $user);
            $this->getC3Data($data["C3"], $user);
            $this->getC4Data($data["C4"], $user);

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
                foreach($data as $value) {
                    PDSEducationalBackground::updateOrCreate(
                        ['id' => $value['ebid']],
                        [
                            'user_id' => Auth::id(),
                            'education_type' => $type,
                            'school' => $value['nameofschool'],
                            'course' => $value['basiceddegreecourse'],
                            'from' => $value['period']['from'],
                            'to' => $value['period']['to'],
                            'highest_earned' => $value['highestlvl'],
                            'year_graduated' => $value['yeargraduated'],
                            'honors' => $value['scholarshiphonor'],
                        ]
                    );
                }
            }

            createEducationalBackground('elementary', $request->elementary);

            createEducationalBackground('secondary', $request->secondary);

            createEducationalBackground('vocational', $request->vocational);

            createEducationalBackground('college', $request->college);

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

            if (!empty($deleted))
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
                        'to' => Carbon::parse($value['inclusivedates']['to'])->isValid() ? Carbon::parse($value['inclusivedates']['to'])->format('Y-m-d') : $value['inclusivedates']['to'],
                        'position_title' => $value['positiontitle'],
                        'company' => $value['department'],
                        'monthly_salary' => preg_replace('/\B(?=(\d{3})+(?!\d))/', ',', $value['monthlysalary']),
                        'salary_grade' => $value['salarygrade'],
                        'status' => $value['statusofappointment'],
                        'is_government_service' => $value['isgovernment'] === "Y" ? true : false,
                    ]
                );
            }

            if (!empty($deleted))
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

            if (!empty($deleted))
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

            if (!empty($deleted))
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

            if (!empty($deleted))
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

            foreach ($c4 as $key => $value) {
                if ($key === "q34") {
                    $this->storeCs4Data($value['choicea']['c4id'], '34', 'a', $value['choicea']['choices']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '34', 'b', $value['choiceb']['choices'], $value['choiceb']['details']);
                } else if ($key === "q35") {
                    $this->storeCs4Data($value['choicea']['c4id'], '35', 'a', $value['choicea']['choices'], $value['choicea']['details']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '35', 'b', $value['choiceb']['choices'], null, $value['choiceb']['datefiled'], $value['choiceb']['statusofcase']);
                } else if ($key === "q36") {
                    $this->storeCs4Data($value['c4id'], '36', 'question', $value['choices'], $value['details']);
                } else if ($key === "q37") {
                    $this->storeCs4Data($value['c4id'], '37', 'question', $value['choices'], $value['details']);
                } else if ($key === "q38") {
                    $this->storeCs4Data($value['choicea']['c4id'], '38', 'a', $value['choicea']['choices'], $value['choicea']['details']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '38', 'b', $value['choiceb']['choices'], $value['choiceb']['details']);
                } else if ($key === "q39") {
                    $this->storeCs4Data($value['c4id'], '39', 'question', $value['choices'], $value['details']);
                } else if ($key === "q40") {
                    $this->storeCs4Data($value['choicea']['c4id'], '40', 'a', $value['choicea']['choices'], $value['choicea']['details']);
                    $this->storeCs4Data($value['choiceb']['c4id'], '40', 'b', $value['choiceb']['choices'], $value['choiceb']['details']);
                    $this->storeCs4Data($value['choicec']['c4id'], '40', 'c', $value['choicec']['choices'], $value['choicec']['details']);
                } else if ($key === "q41") {
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

    function getC1Data($data, User $user)
    {
        $c1 = collect([
            'personalInfo' => collect([
                'birthPlace' => $data[0][3],
                'height' => $data[6][3],
                'weight' => $data[8][3],
                'blood' => $data[9][3],
                'gsis' => $data[11][3],
                'pag-ibig' => $data[13][3],
                'philhealth' => $data[15][3],
                'sss' => $data[16][3],
                'tin' => $data[17][3],
                'agency' => $data[18][3],
                'residential' => collect([
                    'houseNo' => $this->validateAddress($data[2][8], "houseNo"),
                    'street' => $this->validateAddress($data[2][11], "street"),
                    'subdivision' => $this->validateAddress($data[4][8], "subdivision"),
                    'brgy' => $this->validateAddress($data[4][11], "brgy"),
                    'city' => $this->validateAddress($data[6][8], "city"),
                    'province' => $this->validateAddress($data[6][11], "province"),
                    'zip' => $data[8][8]
                ]),
                'permanent' => collect([
                    'houseNo' => $this->validateAddress($data[9][8], "houseNo"),
                    'street' => $this->validateAddress($data[9][11], "street"),
                    'subdivision' => $this->validateAddress($data[11][8], "subdivision"),
                    'brgy' => $this->validateAddress($data[11][11], "brgy"),
                    'city' => $this->validateAddress($data[13]->only([7, 8, 9])->filter()->implode(''), "city"),
                    'province' => $this->validateAddress($data[13]->only([10, 11, 12])->filter()->implode(''), "province"),
                    'zip' => $data[15][8]
                ]),
                'telephone' => $data[16][8],
                'mobile' => $data[17][8],
                'email' => $data[18][8],
            ]),
            'family' => collect([
                'spouse' => collect([
                    'surname' => $data[20][3],
                    'firstname' => $data[21][3],
                    'middlename' => $data[22][3],
                    'occupation' => $data[23][3],
                    'employer' => $data[24][3],
                    'business' => $data[25][3],
                    'telephone' => $data[26][3],
                ]),
                'father' => collect([
                    'surname' => $data[27][3],
                    'firstname' => $data[28][3],
                    'middlename' => $data[29][3]
                ]),
                'mother' => collect([
                    'surname' => $data[31][3],
                    'firstname' => $data[32][3],
                    'middlename' => $data[33][3]
                ]),
                'children' => $this->getChildren(($data->slice(21))->take(12))
            ]),
            'education' => $this->getEducation(collect($data->slice(37)), $user->id)
        ]);

        $user->birth_place = $user->birth_place ?? $c1['personalInfo']['birthPlace'];
        $user->height = $user->height ?? $c1['personalInfo']['height'];
        $user->weight = $user->weight ?? $c1['personalInfo']['weight'];
        $user->save();

        $c1_pi = PDSPersonalInformation::create([
            'user_id' => $user->id,
            'blood_type' => $c1['personalInfo']['blood'],
            'gsis' => $c1['personalInfo']['gsis'],
            'pag_ibig' => $c1['personalInfo']['pag-ibig'],
            'philhealth' => $c1['personalInfo']['philhealth'],
            'sss' => $c1['personalInfo']['sss'],
            'tin' => $c1['personalInfo']['tin'],
            'agency' => $c1['personalInfo']['agency'],
            'telephone' => $c1['personalInfo']['telephone'],
            'mobile' => $c1['personalInfo']['mobile'],
            'email' => $c1['personalInfo']['email'],
        ]);

        $c1_pi->addresses()->create([
            'address_type' => 'permanent',
            'house_no' => $c1['personalInfo']['permanent']['houseNo'],
            'street' => $c1['personalInfo']['permanent']['street'],
            'subdivision' => $c1['personalInfo']['permanent']['subdivision'],
            'barangay' => $c1['personalInfo']['permanent']['brgy'],
            'municipality' => $c1['personalInfo']['permanent']['city'],
            'province' => $c1['personalInfo']['permanent']['province'],
            'zip_code' => $c1['personalInfo']['permanent']['zip'],
        ]);
        $c1_pi->addresses()->create([
            'address_type' => 'residential',
            'house_no' => $c1['personalInfo']['residential']['houseNo'],
            'street' => $c1['personalInfo']['residential']['street'],
            'subdivision' => $c1['personalInfo']['residential']['subdivision'],
            'barangay' => $c1['personalInfo']['residential']['brgy'],
            'municipality' => $c1['personalInfo']['residential']['city'],
            'province' => $c1['personalInfo']['residential']['province'],
            'zip_code' => $c1['personalInfo']['residential']['zip'],
        ]);

        if ($c1['family']['spouse']['surname']) {
            PDSFamilyBackground::create([
                'user_id' => $user->id,
                'family_type' => 'spouse',
                'surname' => $c1['family']['spouse']['surname'],
                'first_name' => $c1['family']['spouse']['firstname'],
                'middle_name' => $c1['family']['spouse']['middlename'],
                'occupation' => $c1['family']['spouse']['occupation'],
                'business_name' => $c1['family']['spouse']['employer'],
                'business_address' => $c1['family']['spouse']['business'],
                'telephone' => $c1['family']['spouse']['telephone'],
            ]);
        }

        PDSFamilyBackground::create([
            'user_id' => $user->id,
            'family_type' => 'father',
            'surname' => $c1['family']['father']['surname'],
            'first_name' => $c1['family']['father']['firstname'],
            'middle_name' => $c1['family']['father']['middlename'],
        ]);

        PDSFamilyBackground::create(
            [
                'user_id' => $user->id,
                'family_type' => 'mother',
                'surname' => $c1['family']['mother']['surname'],
                'first_name' => $c1['family']['mother']['firstname'],
                'middle_name' => $c1['family']['mother']['middlename'],
            ]
        );

        foreach ($c1['family']['children'] as $value) {
            if ($value['name'])
                PDSFamilyBackground::create([
                    'user_id' => $user->id,
                    'family_type' => 'child',
                    'full_name' => $value['name'],
                    'birthdate' => $value['birthday'] ? Carbon::parse($value['birthday'])->format('Y-m-d') : null,
                ]);
        }

        PDSEducationalBackground::insert($c1['education']->toArray());
    }

    function validateAddress($value, $field)
    {
        $fields = collect([
            "houseNo" => "House/Block/Lot No.",
            "street" => "Street",
            "subdivision" => "Subdivision/Village",
            "brgy" => "Barangay",
            "city" => "City/Municipality",
            "province" => "Province"
        ]);

        if ($fields[$field] == $value) return null;

        return $value;
    }

    function getChildren($data)
    {
        return $data->map(function ($value) {
            if ((!$value[8] && !$value[12])) return null;
            if ($value[8] == "(Continue on separate sheet if necessary)") return null;

            return collect([
                'name' => $value[8],
                'birthday' => $value[12],
            ]);
        })->filter(fn($filter) => $filter);
    }

    function getEducation($data, $userId)
    {
        $educationType = ['elementary' => 'elementary', 'secondary' => 'secondary', 'senior high' => 'senior high', 'vocational / trade course' => 'vocational', 'college' => 'college', 'graduate studies' => 'graduate'];

        $result = collect();
        $previousLevel = null;

        foreach ($data as $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                break; // Exit the loop if the condition is true
            }

            $educlevel = ($value->only([0, 1, 2]))->filter()->implode('');
            $schoolName = ($value->only([3, 4, 5]))->filter()->implode('');

            if ($educlevel || ($schoolName && !$educlevel)) {
                $edType = $educlevel ? $educationType[Str::lower(Str::squish($value[1]))] : $previousLevel;
                $previousLevel = $edType;

                $periodfrom = !is_string($value[9]) ? (!preg_match('/^\d{4}$/', $value[9]) ? Date::excelToDateTimeObject($value[9])->format('Y-m-d') : $value[9]) : $value[9];
                $periodto = !is_string($value[10]) ? (!preg_match('/^\d{4}$/', $value[10]) ? Date::excelToDateTimeObject($value[10])->format('Y-m-d') : $value[10]) : $value[10];

                $result->push(collect([
                    'user_id' => $userId,
                    'education_type' => $edType,
                    'school' => $schoolName,
                    'course' => ($value->only([6, 7, 8]))->filter()->implode(''),
                    'from' => $periodfrom,
                    'to' => $periodto,
                    'highest_earned' => $value[11],
                    'year_graduated' => $value[12],
                    'honors' => $value[13],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));
            }
        }

        return $result;
    }

    function getC2Data($data, User $user)
    {
        $cs = $this->getCS($data, $user->id);
        $we = $this->getWE(collect(($data->slice($cs['index']))->values()), $user->id);

        PDSCivilServiceEligibility::insert($cs['data']->toArray());
        PDSWorkExperience::insert($we->toArray());

        return collect([
            'cs' => $cs,
            'we' => $we
        ]);
    }

    function getCS($data, $userId)
    {
        $result = collect();
        $lastIndex = 0;
        foreach ($data as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                $lastIndex = $key;
                break;
            }

            if($value->only([0,5,6,8,11,12])->filter()->implode('') !== " ") {
                $result->push(collect([
                    'user_id' => $userId,
                    'career_service' => $value[0],
                    'rating' => $value[5],
                    'examination' => !is_string($value[6]) ? (!preg_match('/^\d{4}$/', $value[6]) ? Date::excelToDateTimeObject($value[6])->format('Y-m-d') : $value[6]) : $value[6],
                    'place_examination' => $value[8],
                    'license_number' => $value[11],
                    'license_date_validity' => $value[12],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));
            }
        }

        return collect([
            'data' => $result,
            'index' => ($lastIndex + 1)
        ]);
    }

    function getWE($data, $userId)
    {
        $result = collect();
        foreach ($data as $key => $value) {
            if ($key >= 4) {
                if ($value[0] == "(Continue on separate sheet if necessary)") break;

                $dateFrom = !is_string($value[0]) ? (!preg_match('/^\d{4}$/', $value[0]) ? Date::excelToDateTimeObject($value[0])->format('Y-m-d') : $value[0]) : $value[0];
                $dateTo = !is_string($value[2]) ? (!preg_match('/^\d{4}$/', $value[2]) ? Date::excelToDateTimeObject($value[2])->format('Y-m-d') : $value[2]) : $value[2];

                $result->push(collect([
                    'user_id' => $userId,
                    'from' => $dateFrom,
                    'to' => $dateTo,
                    'position_title' => $value[3],
                    'company' => $value[6],
                    'monthly_salary' => !Str::contains(Str::squish($value[9]), ',') ? number_format((int) Str::replace(' ', '', Str::squish($value[9]))) : Str::replace(' ', '', Str::squish($value[9])),
                    'salary_grade' => $value[10],
                    'status' => $value[11],
                    'is_government_service' => $value[12] == "Y" ? true : false,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));
            }
        }

        return $result;
    }

    function getC3Data($data, User $user)
    {
        $c3Data = $data;
        $result = collect([
            'voluntary' => collect(),
            'l_and_d' => collect(),
            'other' => collect(),
        ]);
        $lastIndex = 0;

        foreach ($c3Data as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                if($c3Data[$key + 2][0] == "(Start from the most recent L&D/training program and include only the relevant L&D/training taken for the last five (5) years for Division Chief/Executive/Managerial positions)") {
                    $lastIndex = $key + 1;
                } else {
                    $lastIndex = $key;
                }
                break;
            }

            $result['voluntary']->push(collect([
                'user_id' => $user->id,
                'organization' => $value[0],
                'from' => !is_string($value[4]) ? ((!preg_match('/^\d{4}$/', $value[4]) && !empty($value[4])) ? Date::excelToDateTimeObject($value[4])->format('Y-m-d') : $value[4]) : $value[4],
                'to' => !is_string($value[5]) ? ((!preg_match('/^\d{4}$/', $value[5]) && !empty($value[5])) ? Date::excelToDateTimeObject($value[5])->format('Y-m-d') : $value[5]) : $value[5],
                'num_hours' => $value[6],
                'position' => $value[7],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        foreach ($c3Data->slice($lastIndex + 4) as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                $lastIndex = $key;
                break;
            }

            $result['l_and_d']->push(collect([
                'user_id' => $user->id,
                'title' => $value->only([0, 1, 2, 3])->filter()->implode('') == 'N/A' ? null : ($value->only([0, 1, 2, 3]))->filter()->implode(''),
                'from' => !is_string($value[4]) ? ((!preg_match('/^\d{4}$/', $value[4]) && !empty($value[4])) ? Date::excelToDateTimeObject($value[4])->format('Y-m-d') : $value[4]) : $value[4],
                'to' => !is_string($value[5]) ? ((!preg_match('/^\d{4}$/', $value[5]) && !empty($value[5])) ? Date::excelToDateTimeObject($value[5])->format('Y-m-d') : $value[5]) : $value[5],
                'num_hours' => $value[6],
                'type_of_ld' => $value[7],
                'conducted_by' => $value->only([8, 9, 10])->filter()->implode(''),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        foreach ((($c3Data->slice($lastIndex + 3))->values()) as $key => $value) {
            if ($value[0] == "(Continue on separate sheet if necessary)") {
                break;
            }

            if ($value[0] && $value[0] != 'N/A')
                $result['other']->push(collect([
                    'user_id' => $user->id,
                    'info_type' => "skills",
                    'detail' => $value[0],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));

            if ($value[2] && $value[2] != 'N/A')
                $result['other']->push(collect([
                    'user_id' => $user->id,
                    'info_type' => "recognition",
                    'detail' => $value[2],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));

            if ($value[8] && $value[8] != 'N/A')
                $result['other']->push(collect([
                    'user_id' => $user->id,
                    'info_type' => "association",
                    'detail' => $value[8],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]));
        }

        PDSVoluntaryWork::insert($result['voluntary']->toArray());
        PDSLearningDevelopment::insert($result['l_and_d']->toArray());
        PDSOtherInformation::insert($result['other']->toArray());
    }

    function getC4Data($data, User $user)
    {
        $c4 = collect([
            "34b" => $data[0]->only([6, 7, 8])->filter()->implode(''),
            "35a" => $data[4]->only([6, 7, 8])->filter()->implode(''),
            "35b" => collect([
                'date' => $data[9]->only([10, 11])->filter()->implode(''),
                'status' => $data[10]->only([10, 11])->filter()->implode(' '),
            ]),
            "36" => $data[14]->only([6, 7, 8])->filter()->implode(''),
            "37" => $data[18]->only([6, 7, 8])->filter()->implode(''),
            "38a" => $data[21][10],
            "38b" => $data[24][10],
            "39" => $data[28]->only([6, 7, 8])->filter()->implode(''),
            "40a" => $data[33]->only([10, 11])->filter()->implode(''),
            "40b" => $data[35][11],
            "40c" => $data[37][11],
            "41" => collect([
                collect([
                    "user_id" => $user->id,
                    "name" => $data[41]->only([0, 1, 2, 3, 4])->filter()->implode(''),
                    "address" => $data[41][5],
                    "telephone" => $data[41]->only([6, 7, 8])->filter()->implode(''),
                    "created_at" => Carbon::now(),
                    "updated_at" => Carbon::now(),
                ]),
                collect([
                    "user_id" => $user->id,
                    "name" => $data[42]->only([0, 1, 2, 3, 4])->filter()->implode(''),
                    "address" => $data[42][5],
                    "telephone" => $data[42]->only([6, 7, 8])->filter()->implode(''),
                    "created_at" => Carbon::now(),
                    "updated_at" => Carbon::now(),
                ]),
                collect([
                    "user_id" => $user->id,
                    "name" => $data[43]->only([0, 1, 2, 3, 4])->filter()->implode(''),
                    "address" => $data[43][5],
                    "telephone" => $data[43]->only([6, 7, 8])->filter()->implode(''),
                    "created_at" => Carbon::now(),
                    "updated_at" => Carbon::now(),
                ])
            ]),
            "governmentId" => $data[50][3],
            "idNo" => $data[51][3],
            "issuance" => $data[53][3],
        ]);

        PDSc4::create([
            'user_id' => $user->id,
            'question' => '34',
            'sets' => 'a',
            'choices' => null,
            'details' => null,
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '34',
            'sets' => 'b',
            'choices' => $c4['34b'] ? true : false,
            'details' => $c4['34b'] == " " ? null : $c4['34b'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '35',
            'sets' => 'a',
            'choices' => $c4['35a'] ? true : false,
            'details' => $c4['35a'] == " " ? null : $c4['35a'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '35',
            'sets' => 'b',
            'choices' => $c4['35b']['date'] ? true : false,
            'date_filed' => $c4['35b']['date'] ? Carbon::parse($c4['35b']['date'])->format('Y-m-d') : null,
            'case_status' => $c4['35b']['status']
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '36',
            'sets' => 'question',
            'choices' => $c4['36'] ? true : false,
            'details' => $c4['36'] == " " ? null : $c4['36'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '37',
            'sets' => 'question',
            'choices' => $c4['37'] ? true : false,
            'details' => $c4['37'] == " " ? null : $c4['37'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '38',
            'sets' => 'a',
            'choices' => $c4['38a'] ? true : false,
            'details' => $c4['38a'] == " " ? null : $c4['38a'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '38',
            'sets' => 'b',
            'choices' => $c4['38b'] ? true : false,
            'details' => $c4['38b'] == " " ? null : $c4['38b'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '39',
            'sets' => 'question',
            'choices' => $c4['39'] ? true : false,
            'details' => $c4['39'] == " " ? null : $c4['39'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '40',
            'sets' => 'a',
            'choices' => $c4['40a'] ? true : false,
            'details' => $c4['40a'] == " " ? null : $c4['40a'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '40',
            'sets' => 'b',
            'choices' => $c4['40b'] ? true : false,
            'details' => $c4['40b'] == " " ? null : $c4['40b'],
        ]);
        PDSc4::create([
            'user_id' => $user->id,
            'question' => '40',
            'sets' => 'c',
            'choices' => $c4['40c'] ? true : false,
            'details' => $c4['40c'] == " " ? null : $c4['40c'],
        ]);

        PDSReferences::insert($c4['41']->toArray());

        PDSGovernmentId::create([
            'user_id' => $user->id,
            'government_id' => $c4['governmentId'],
            'id_number' => $c4['idNo'],
            'issued' => $c4['issuance'],
        ]);
    }
}
