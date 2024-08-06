<x-mail::message>

@if ($status === "rejected")
Dear {{ $name }},

We regret to inform you that your application for leave has been rejected.

{{ $approval_message }}

Thank you for your understanding and cooperation.

<br>
Best regards,
<br>
@else
Your application for leave has been approved
@endif

<br>
{{ $sender['name'] }}<br>
{{ $sender['position'] }}<br>

<hr>
Via SDNHS HRIS
</x-mail::message>
