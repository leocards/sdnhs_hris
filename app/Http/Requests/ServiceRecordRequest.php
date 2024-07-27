<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class ServiceRecordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'certificateName' => ['required', 'string'],
            'file' => ['required', 'mimes:pdf,jpeg,jpg,png', 'max:10240'],
            'daysRendered.from' => ['required', 'date'],
            'daysRendered.to' => ['date', 'nullable'],
        ];
    }
}
