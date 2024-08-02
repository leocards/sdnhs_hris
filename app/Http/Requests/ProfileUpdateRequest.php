<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'firstName' => ['required'],
            'lastName' => ['required'],
            'middleName' => ['max:255'],
            'sex' => ['required', 'in:Male,Female'],
            'birthDate' => ['required', 'date'],
            'address' => ['required', 'max:1000'],
            'email' => ['required', 'email', 'string', 'lowercase', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'phoneNumber' => ['required', 'string', 'size:11'],
            'personnelId' => ['required'],
            'department' => ['required'],
            'userRole' => ['required'],
            'dateHired' => ['required', 'date'],
            'position' => ['required'],
            'password' => ['required', 'min:8'],
        ];
    }
}
