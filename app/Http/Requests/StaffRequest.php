<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StaffRequest extends FormRequest
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
        $userId = $this->route('user');

        return [
            'firstName' => ['required'],
            'lastName' => ['required'],
            'middleName' => ['max:255'],
            'sex' => ['required', 'in:Male,Female'],
            'birthDate' => ['required', 'date'],
            'address' => ['required', 'max:1000'],
            'email' => ['required', 'email', 'string', 'lowercase', 'max:255', $userId ? Rule::unique(User::class)->ignore($userId) : Rule::unique(User::class)],
            'phoneNumber' => ['required', 'string', 'size:11'],
            'staffId' => ['required'],
            'department' => ['required'],
            'userRole' => ['required'],
            'dateHired' => ['required', 'date'],
            'position' => ['required'],
            'password' => ['required', 'min:8'],
        ];
    }
}
