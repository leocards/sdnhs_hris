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
        return Inertia::render("Search/Search");
    }

    public function view_searched(User $user)
    {
        if(!$user || $user->id === Auth::id()) {
            abort(404);
        }

        return Inertia::render('Search/SearchedEmployee', [
            'user' => $user
        ]);
    }
}
