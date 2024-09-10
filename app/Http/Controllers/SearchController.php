<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index()
    {
        return Inertia::render("Search/Search", [
            "personnels" => User::orderBy('last_name')->get(['id', 'first_name', 'middle_name', 'last_name', 'position', 'department', 'leave_credits', 'avatar']),
        ]);
    }

    public function view_searched(User $user)
    {
        return Inertia::render('Search/SearchedEmployee', [
            'user' => $user,
            'leave' => $user->getLeaveRendered(),
            'open' => session('open')
        ]);
    }

    public function indexJson(Request $request)
    {
        return response()->json(
            User::where('first_name', 'LIKE', "%".$request->query('search')."%")
                ->orWhere('last_name', 'LIKE', "%".$request->query('search')."%")
                ->orWhere('middle_name', 'LIKE', "%".$request->query('search')."%")
                ->get(['id', 'first_name', 'middle_name', 'last_name', 'position', 'department', 'leave_credits'])
        );
    }
}
