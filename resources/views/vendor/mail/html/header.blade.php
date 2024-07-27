@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: block;">
{{-- <img src="data:image/png;base64,{{ $image }}" width="100" height="100"> --}}
<br>
{{ $slot }}
</a>
</td>
</tr>
