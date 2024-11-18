<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PersonnelRequest extends FormRequest
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

        $rules = [
            'firstName' => ['required'],
            'lastName' => ['required'],
            'middleName' => ['max:255'],
            'sex' => ['required', 'in:Male,Female'],
            'birthDate' => ['required', 'date'],
            'address' => ['required', 'max:1000'],
            'email' => ['required', 'email', 'string', 'lowercase', 'max:255', $userId ? Rule::unique(User::class)->ignore($userId) : Rule::unique(User::class)],
            'phoneNumber' => ['required', 'string', 'size:11'],
            'personnelId' => ['required', Rule::unique('users', 'personnel_id')->ignore($userId)],
            'userRole' => ['required', 'in:Teaching,Non-teaching,HR,HOD'],
            'dateHired' => ['required', 'date'],
            'position' => ['required', 'string'],
            'password' => ['required', 'min:8'],
        ];

        if ($this->input('userRole') !== 'HOD') {
            $rules['department'] = ['required'];
        } else {
            $rules['department'] = ['nullable'];
        }

        return $rules;
    }

    /**
     * Get the validation messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'department.required' => 'The department field is required.',
        ];
    }
}
