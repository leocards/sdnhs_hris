<?php

namespace App\Http\Controllers;

use App\Models\StatementOfAssetsLiabilityAndNetwork;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
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

    public function store(Request $request, $idToUpdate)
    {
        DB::beginTransaction();
        try {

            $saln = StatementOfAssetsLiabilityAndNetwork::updateOrCreate(['id' => $idToUpdate],[
                "user_id" => Auth::id(),
                "asof" => Carbon::parse($request->asof)->format('Y-m-d'),
                "date" => Carbon::parse($request->date)->format('Y-m-d'),
                "isjoint" => $request->isjoint,
            ]);

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
                }
            }

            if ($request->liabilities[0]['nature']) {
                foreach ($request->liabilities as $value) {
                    $saln->salnLiability()->updateOrCreate(['id' => $value['liabilityid']], [
                        'nature' => $value['nature'],
                        'creditors' => $value['nameofcreditors'],
                        'balances' => $value['outstandingbalances']
                    ]);
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

            DB::commit();

            if($idToUpdate)
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
        try {
            $saln->isApproved = $request->isApprove;
            $saln->save();

            return back();
        } catch (\Throwable $th) {
            return back()->withErrors($th->getMessage());
        }
    }
}
