<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $unread = $request->query('filter');

        return Inertia::render('Notification/Notification', [
            'notifications' => Notifications::with('sender')->where('user_id', Auth::id())
                ->when($unread === "unread", function ($query) {
                    $query->where('viewed', '=', 0);
                })
                ->orderBy('created_at', 'desc')
                ->paginate(50)
        ]);
    }

    public function indexJson(Request $request)
    {
        $unread = $request->query('filter');

        return response()->json(Notifications::with('sender')->where('user_id', Auth::id())
            ->when($unread == "unread", function ($query) {
                $query->where('viewed', '=', 0);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(50));
    }

    public function markAsRead(Notifications $notif)
    {
        try {
            if (!$notif->viewed) {
                DB::transaction(function () use ($notif) {
                    $notif->viewed = true;
                    $notif->save();
                });
            }

            return response()->json('success');
        } catch (\Throwable $th) {

            return response()->json($th->getMessage(), 400);
        }
    }

    public function redirectFromNotification(Request $request, Notifications $notif)
    {
        try {
            if (!$notif->viewed) {
                DB::transaction(function () use ($notif) {
                    $notif->viewed = true;
                    $notif->save();
                });
            }

            return redirect(Str::remove($request->getSchemeAndHttpHost(), $notif->go_to_link))->with('open', $request->query('open') ?? '');
        } catch (\Throwable $th) {

            return back()->withErrors($th->getMessage());
        }
    }

    public function deleteNotification(Notifications $notification)
    {
        $notification->delete();

        return response()->json('success');
    }

    public function undoNotification(Notifications $notification)
    {
        if ($notification->trashed()) {
            $notification->restore();
        }

        return response()->json('success');
    }

    public function unreadNotifications()
    {
        return response()->json(Notifications::where('viewed', false)->where('user_id', Auth::id())->count());
    }

}
