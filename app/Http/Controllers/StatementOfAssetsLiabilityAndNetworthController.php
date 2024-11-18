<?php

namespace App\Http\Controllers;

use App\Events\SendNotificationEvent;
use App\Models\Notifications;
use App\Models\PerformanceRating;
use App\Models\Saln;
use App\Models\StatementOfAssetsLiabilityAndNetwork;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatementOfAssetsLiabilityAndNetworthController extends Controller
{
    public function index()
    {
        return Inertia::render('Saln/StatementOfAssetsLiabilityAndNetworth', [
            'saln' => StatementOfAssetsLiabilityAndNetwork::withSum('salnLiability', 'balances')
                ->withSum('salnAssets', 'cost')
                ->where('user_id', Auth::id())
                ->latest()
                ->paginate(50)
        ]);
    }

    public function create(StatementOfAssetsLiabilityAndNetwork $saln = null)
    {
        if ($saln) {
            $saln->load(['salnSpouse', 'salnChildren', 'salnAssets', 'salnLiability', 'salnBiFc.bifc', 'salnRelative.relatives']);
        }

        return Inertia::render('Saln/AddSaln', [
            'declarant' => User::where('id', Auth::id())->with('pdsPersonalInformation:id,user_id')->first('id'),
            'saln_user' => $saln
        ]);
    }

    public function store(Request $request, $idToUpdate = null)
    {
        DB::beginTransaction();
        try {
            $asof = Carbon::parse($request->asof)->format('Y');
            $exist = StatementOfAssetsLiabilityAndNetwork::whereYear('asof', $asof)
                ->where('user_id', Auth::id())
                ->exists();

            if ($exist)
                throw new Exception('You have already submitted your SALN as of ' . Carbon::parse($request->asof)->format('m-d-Y'));


            $saln = StatementOfAssetsLiabilityAndNetwork::updateOrCreate(['id' => $idToUpdate], [
                "user_id" => Auth::id(),
                "asof" => Carbon::parse($request->asof)->format('Y-m-d'),
                "date" => Carbon::parse($request->date)->format('Y-m-d'),
                "isjoint" => $request->isjoint,
            ]);

            $realassets = 0;

            $personalassets = 0;

            $liabilities = 0;

            if ($request->spouse['familyname'])
                $saln->salnSpouse()->updateOrCreate(
                    ['id' => $request->spouse['spouseid']],
                    [
                        'family_name' => $request->spouse['familyname'],
                        'first_name' => $request->spouse['firstname'],
                        'middle_name' => $request->spouse['middleinitial'],
                        'position' => $request->spouse['position'],
                        'office' => $request->spouse['office'],
                        'office_address' => $request->spouse['officeaddress'],
                        'government_id' => $request->spouse['governmentissuedid'],
                        'government_id_no' => $request->spouse['idno'],
                        'date_issued' => $request->spouse['dateissued'],
                    ]
                );

            if ($request->children[0]['name']) {
                foreach ($request->children as $value) {
                    $saln->salnChildren()->updateOrCreate(['id' => $value['childid']], [
                        'name' => $value['name'],
                        'date_of_birth' => Carbon::parse($value['dateofbirth'])->format('Y-m-d'),
                        'age' => Carbon::parse($value['dateofbirth'])->age,
                    ]);
                }
            }

            if ($request->assets['real'][0]['description']) {
                foreach ($request->assets['real'] as $value) {
                    $saln->salnAssets()->updateOrCreate(['id' => $value['realid']], [
                        'asset_type' => "real",
                        'description' => $value['description'],
                        'kind' => $value['kind'],
                        'location' => $value['exactlocation'],
                        'assessed_value' => $value['assessedvalue'],
                        'current_market_value' => $value['currentfairmarketvalue'],
                        'year' => $value['acquisition']['year'],
                        'mode' => $value['acquisition']['mode'],
                        'cost' => $value['acquisitioncost']
                    ]);

                    $realassets = $realassets + floatval($value['acquisitioncost']);
                }
            }

            if ($request->assets['personal'][0]['description']) {
                foreach ($request->assets['personal'] as $value) {
                    $saln->salnAssets()->updateOrCreate(['id' => $value['personalid']], [
                        'asset_type' => "personal",
                        'description' => $value['description'],
                        'year' => $value['yearacquired'],
                        'cost' => $value['acquisitioncost']
                    ]);

                    $personalassets = $personalassets + floatval($value['acquisitioncost']);
                }
            }

            if ($request->liabilities[0]['nature']) {
                foreach ($request->liabilities as $value) {
                    $saln->salnLiability()->updateOrCreate(['id' => $value['liabilityid']], [
                        'nature' => $value['nature'],
                        'creditors' => $value['nameofcreditors'],
                        'balances' => $value['outstandingbalances']
                    ]);

                    $liabilities = $liabilities + floatval($value['outstandingbalances']);
                }
            }

            if ($request->biandfc['nobiandfc']) {
                $bifcs = $saln->salnBiFc()->updateOrCreate(['id' => $request->biandfc['biandfcid']], ['has_bi_fc' => $request->biandfc['nobiandfc']]);
            } else {
                $bifcs = $saln->salnBiFc()->updateOrCreate(['id' => $request->biandfc['biandfcid']], ['has_bi_fc' => $request->biandfc['nobiandfc']]);

                foreach ($request->biandfc['bifc'] as $value) {
                    $bifcs->bifc()->updateOrCreate(['id' => $value['bifcid']], [
                        'name' => $value['name'],
                        'address' => $value['address'],
                        'nature' => $value['nature'],
                        'date' => Carbon::parse($value['date'])->format('Y-m-d'),
                    ]);
                }
            }

            if ($request->relativesingovernment['norelative']) {
                $bifcs = $saln->salnRelative()->updateOrCreate(['id' => $request->relativesingovernment['relativesingovernmentid']], ['has_relative' => $request->relativesingovernment['norelative']]);
            } else {
                $bifcs = $saln->salnRelative()->updateOrCreate(['id' => $request->relativesingovernment['relativesingovernmentid']], ['has_relative' => $request->relativesingovernment['norelative']]);

                foreach ($request->relativesingovernment['relatives'] as $value) {
                    $bifcs->relatives()->updateOrCreate(['id' => $value['relativeid']], [
                        'name' => $value['name'],
                        'relationship' => $value['relationship'],
                        'position' => $value['position'],
                        'agency_address' => $value['agencyandaddress'],
                    ]);
                }
            }

            $saln = Saln::where('user_id', Auth::id())
                ->where('year', $asof)
                ->first();

            $networth = ($realassets + $personalassets) - $liabilities;

            if ($saln) {
                $saln->networth = $networth;
                $saln->spouse = $request->spouse['firstname'] .' '. $request->spouse['middleinitial'] .'. '. $request->spouse['familyname'] .'/'. $request->spouse['office'] .'/'. $request->spouse['officeaddress'];
                $saln->joint = $request->isjoint;
                $saln->year = $asof;
            } else {
                Saln::create([
                    "user_id" => Auth::id(),
                    "networth" => $networth,
                    "spouse" => $request->spouse['familyname'] ? $request->spouse['firstname'] .' '. $request->spouse['middleinitial'] .'. '. $request->spouse['familyname'] .'/'. $request->spouse['office'] .'/'. $request->spouse['officeaddress'] : "",
                    "joint" => $request->isjoint == "joint" ? true : false,
                    "year" => $asof
                ]);
            }

            DB::commit();

            if ($idToUpdate)
                return back()->with('success', 'SALN updated successfully.');
            else
                return redirect(route('saln'))->with('success', 'SALN saved successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->withErrors($th->getMessage());
        }
    }

    public function setApproveSaln(Request $request, StatementOfAssetsLiabilityAndNetwork $saln)
    {
        DB::beginTransaction();
        try {
            $saln->isApproved = $request->isApprove;
            $saln->save();

            $notificationResponse = Notifications::create([
                'user_id' => $saln->user_id,
                'from_user_id' => Auth::id(),
                'message' => ': Your SALN has been approved by the HR.',
                'type' => 'response',
                'go_to_link' => route('saln')
            ]);

            DB::commit();

            $notificationResponse->load(['sender']);
            broadcast(new SendNotificationEvent($notificationResponse, $notificationResponse->user_id));

            return back()->with('success', 'SALN has been approved.');
        } catch (\Throwable $th) {
            DB::rollback();

            return back()->withErrors($th->getMessage());
        }
    }

    public function jsonSalnView(StatementOfAssetsLiabilityAndNetwork $saln)
    {
        $declarant = User::where('id', $saln->user_id)->first(['id']);

        $assets = $saln->salnAssets->groupBy('asset_type');

        $realAssets = $assets->get('real', collect())->chunk(4);
        $realPersonal = $assets->get('real', collect())->chunk(4);
        $children = $saln->salnChildren->chunk(4);
        $liabilities = $saln->salnLiability->chunk(4);
        $salnbifc = $saln->salnBiFc;
        $bifc = $saln->salnBiFc->bifc->chunk(4);
        $salnrelatives = $saln->salnRelative;
        $relatives = $saln->salnRelative->relatives->chunk(4);
        $spouse = $saln->salnSpouse;

        $salnPages = collect([]);

        $is_more_pages = true;
        while ($is_more_pages) {
            $real = $this->getValue($realAssets->splice(0, 1));
            $personal = $this->getValue($realPersonal->splice(0, 1));
            $liability = $this->getValue($liabilities->splice(0, 1));

            $saln_totals = collect([
                'personal' => $this->totals($personal, 'cost'),
                'real' => $this->totals($real, 'cost'),
                'liability' => $this->totals($liability, 'balances'),
                'networth' => ($this->totals($personal, 'cost') + $this->totals($real, 'cost')) - $this->totals($liability, 'balances')
            ]);

            $salnPages->push([
                "children" => $this->getValue($children->splice(0, 1)),
                "real" => $real,
                "personal" => $personal,
                "liabilities" => $liability,
                "bifc" => collect([
                    "salnbifc" => $salnbifc,
                    "bifc" => $this->getValue($bifc->splice(0, 1))
                ]),
                "relatives" => collect([
                    "salnrelatives" => $salnrelatives,
                    "relatives" => $this->getValue($relatives->splice(0, 1))
                ]),
                "saln_totals" => $saln_totals
            ]);

            if (
                $realAssets->count() === 0 &&
                $realPersonal->count() === 0 &&
                $children->count() === 0 &&
                $liabilities->count() === 0 &&
                $bifc->count() === 0 &&
                $relatives->count() === 0
            ) {
                $is_more_pages = false;
            }
        }

        return response()->json(["spouse" => $spouse, "declarant" => $declarant->pdsGovernment, "pages" => $salnPages]);
    }

    function getValue($data)
    {
        return $data->count() > 0 ? $data[0] : null;
    }

    function totals(Collection $data, string $attribute)
    {
        return $data->reduce(fn($carry, $item) => ($carry + $item[$attribute]), 0);
    }
}
