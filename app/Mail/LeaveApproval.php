<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LeaveApproval extends Mailable
{
    use Queueable, SerializesModels;

    public $senders;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public $userSender,
        public string $receiver,
        public $status,
        public $approval_message
    ) { 
        $this->senders = $userSender;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'APPLICATION FOR LEAVE STATUS',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'leave.approval',
            with: [
                "name" => $this->receiver,
                "status" => $this->status,
                "approval_message" => $this->approval_message,
                "sender" => $this->senders
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
