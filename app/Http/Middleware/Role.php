<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $hr, string $hod = null): Response
    {
        if($request->user()->hasRole($hr) || $request->user()->hasRole($hod))
            return $next($request);

        return redirect()->back()->with('message', 'Unauthorized access');
    }
}
