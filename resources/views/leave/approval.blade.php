<x-mail::message>

@if ($status === "rejected")
Dear {{ $name }},

{{ $approval_message }}

Thank you for your understanding and cooperation.

<br>
Best regards,
<br>
@else
Your application for leave has been approved
@endif

<br>
{{ $recipient['name'] }}<br>
{{ $recipient['position'] }}<br>

<hr>
Via SDNHS HRIS
</x-mail::message>
