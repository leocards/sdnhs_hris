<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Note::where('user_id', Auth::id())->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Note $note = null)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['required', 'string'],
            'reminder' => ['nullable', 'date']
        ]);

        DB::beginTransaction();
        try {

            $notes = Note::updateOrCreate(
                ['id' => $note?->id],
                [
                    "user_id" => Auth::id(),
                    "title" => $request->title,
                    "notes" => $request->notes,
                    "reminder" => $request->reminder?Carbon::parse('2024-10-25T16:00:00.000Z')->format('Y-m-d H:i:s'):null,
                ]
            );

            DB::commit();

            return response()->json($notes);

        } catch (\Throwable $th) {
            DB::rollback();

            return response()->json($th->getMessage(), 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        $note->delete();

        return back()->with('success', 'Deleted successfully');
    }
}
