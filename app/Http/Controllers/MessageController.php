<?php

namespace App\Http\Controllers;

use App\Events\SendMessageEvent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        return Inertia::render('Messages/Messages', [
            'unreadmessages' => $this->countUnreadMessages()
        ]);
    }

    public function countUnreadMessages()
    {
        return Message::whereHas('conversations', function ($query) {
                $query->where('sender', '!=', Auth::id())->whereNull('seen_at');
            })
            ->where(function ($query) {
                $query->where('sender_id', Auth::id())->orWhere('receiver_id', Auth::id());
            })->pluck('id');
    }

    public function searchUser(string $search)
    {
        return response()->json(
            User::when($search, function ($query) use ($search) {
                    $query->searchByFullName($search);
                })
                ->get(['id', 'first_name', 'last_name', 'middle_name', 'avatar'])
                ->map(function ($user) {
                    $user->messageId = Message::where('sender_id', Auth::id())
                        ->where('receiver_id', $user->id)
                        ->orWhere('sender_id', $user->id)
                        ->where('receiver_id', Auth::id())
                        ->value('id');

                    return $user;
                })
        );
    }

    public function messages()
    {
        return Message::where('sender_id', Auth::id())
            ->orWhere('receiver_id', Auth::id())
            ->get()
            ->map(function ($message) {
                $message['conversations'] = $message->conversations()->latest()->first();

                if($message->sender_id == Auth::id()) {
                    // get the receiver
                    $message['user'] = $message->userReceiver()->first();

                    return $message;
                }
                $message['user'] = $message->userSender()->first();

                return $message;
            })
            ->sortByDesc('conversations.created_at')
            ->values();
    }

    public function conversations($userId, Message $messageId = null)
    {
        if(!$messageId)
            $messageId = Message::where('sender_id', Auth::id())
                ->where('receiver_id', $userId)
                ->orWhere('sender_id', $userId)
                ->where('receiver_id', Auth::id())
                ->first();

        return response()->json($messageId ? $messageId->conversations()->latest()->paginate(50) : null);
    }

    public function send(Request $request, User $user, Message $messageId = null)
    {
        $newMessage = empty($messageId);

        DB::beginTransaction();
        try {
            if(!$messageId) {
                // check if the message between user already exist
                $messageId = Message::where('sender_id', Auth::id())
                    ->where('receiver_id', $user->id)
                    ->orWhere('sender_id', $user->id)
                    ->where('receiver_id', Auth::id())
                    ->first();

                // create message connection and store message to conversation
                if(!$messageId) {
                    $messageId = Message::create([
                        'sender_id' => Auth::id(),
                        'receiver_id' => $user->id
                    ]);
                }
            }

            $convo = $messageId->conversations()->create([
                'message' => $request->message,
                'sender' => Auth::id()
            ]);

            $messageId->conversations()->where('sender', $user->id)->whereNull('seen_at')->update(['seen_at' => Carbon::now()]);

            DB::commit();

            $message = collect([
                'id' => $messageId->id,
                'sender_id' => Auth::id(),
                'receiver_id' => $user->id,
                'conversations' => collect([ 'id' => $convo->id , 'sender' => $convo->sender, 'message' => $convo->message, 'seen_at' => null, 'created_at' => $convo->created_at]),
                'user' => collect([
                    'id' => $user->id, 'name' => $user->name, 'avatar' => $user->avatar
                ])
            ]);

            broadcast(
                new SendMessageEvent(
                    $message['id'],
                    $message['sender_id'],
                    $message['receiver_id'],
                    $message['conversations'],
                    collect([
                        'id' => Auth::id(), 'name' => Auth::user()->name, 'avatar' => Auth::user()->avatar
                    ]),
                )
            )->toOthers();

            return response()->json(collect([
                'isNew' => $newMessage,
                'data' => $message
            ]));

        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json($th->getMessage(), 400);
        }
    }

    public function setMessageAsSeen(Message $message)
    {
        try {
            DB::transaction(function () use ($message) {
                $userId = $message->sender_id == Auth::id() ? $message->receiver_id : $message->sender_id;

                $message->conversations()->where('sender', $userId)->whereNull('seen_at')->update(['seen_at' => Carbon::now()]);
            });

            return response()->json('ok');
        } catch (\Throwable $th) {
            return response()->json($th->getMessage());
        }

    }

    public function searchConversation(Message $messageId, string $search)
    {
        return $messageId->conversations()
            ->with('messageSender')
            ->when($search != '', function ($query) use ($search) {
                $query->where('message', 'LIKE', "%{$search}%");
            })
            ->latest()
            ->get();
    }

    public function getConversationOnSearch(Message $messageId, $convoId)
    {
        $position = $messageId->conversations()->where('id', '>=', $convoId)->latest()->count();

        $pages = intval(ceil($position / 50));

        $datas = collect([]);
        $page_data = null;

        for($pageNumber = 1; $pageNumber <= $pages; $pageNumber++) {
            $paginated_data = $messageId->conversations()->latest()->paginate(50, ['*'], 'page', $pageNumber);
            if($pageNumber === $pages) {
                $mergedData = $paginated_data->getCollection()->merge($datas);

                $page_data = new LengthAwarePaginator (
                    $mergedData,
                    $paginated_data->total(),         // Total items count (from original paginator)
                    $paginated_data->perPage(),       // Items per page
                    $paginated_data->currentPage(),   // Current page
                    ['path' => request()->url()]      // Path for pagination links
                );

            } else {
                $datas->push(...$paginated_data->items());
            }
        }

        return response()->json($page_data);
    }

    public function deleteMessage(Message $message)
    {
        $message->delete();

        return redirect()->back()->with('success', 'Deleted successfully');
    }
}
