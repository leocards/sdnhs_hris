<x-mail::message>
{{ $user->name() }} {{ $notificationMesssage }}

<br>
{{ $user['first_name'].' '.$user['last_name'] }}<br>
{{ $user['position'] }}<br>

<hr>
Via SDNHS HRIS
</x-mail::message>
