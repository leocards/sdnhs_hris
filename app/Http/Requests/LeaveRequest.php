<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'department' => ['required'],
            'firstName' => ['required'],
            'lastName' => ['required'],
            'middleName' => ['nullable', 'string'],
            'dateOfFiling' => ['required', 'date'],
            'position' => ['required'],
            'salary' => ['required'],
            'leavetype' => ['required'],
            'leavetype.others' => ['required_if:leavetype,Others', 'string'],
            'detailsOfLeave.vacation_special.withinPhilippines.checked' => 'nullable|boolean',
            'detailsOfLeave.vacation_special.withinPhilippines.input' => 'nullable|string|max:255',
            'detailsOfLeave.vacation_special.abroad.checked' => 'nullable|boolean',
            'detailsOfLeave.vacation_special.abroad.input' => 'nullable|string|max:255',
            'detailsOfLeave.sick.inHospital.checked' => 'nullable|boolean',
            'detailsOfLeave.sick.inHospital.input' => 'nullable|string|max:255',
            'detailsOfLeave.sick.outPatient.checked' => 'nullable|boolean',
            'detailsOfLeave.sick.outPatient.input' => 'nullable|string|max:255',
            'detailsOfLeave.benefitsForWomen' => 'nullable|string',
            'detailsOfLeave.study.degree' => 'nullable|boolean',
            'detailsOfLeave.study.examReview' => 'nullable|boolean',
            'detailsOfLeave.other.monetization' => 'nullable|boolean',
            'detailsOfLeave.other.terminal' => 'nullable|boolean',
            'inclusiveDates.from' => ['required', 'date'],
            'numDaysApplied' => ['required'],
            'certificationLeaveCredits.asOf' => ['required'],
            'certificationLeaveCredits.totalEarned.vacationLeave' => ['required'],
            'certificationLeaveCredits.totalEarned.sickLeave' => ['required'],
            'certificationLeaveCredits.lessThisApplication.vacationLeave' => ['required'],
            'certificationLeaveCredits.lessThisApplication.sickLeave' => ['required'],
            'certificationLeaveCredits.balance.vacationLeave' => ['required'],
            'certificationLeaveCredits.balance.sickLeave' => ['required'],
            '' => ['required'],
            '' => ['required'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $this->input('detailsOfLeave');

            // Check for custom conditions
            $this->validateFields($data, $validator);
            $this->validateOnlyOneChecked($data, $validator);
        });
    }

    protected function validateFields($data, $validator)
    {
        // Validate vacation_special.withinPhilippines
        if ($data['vacation_special']['withinPhilippines']['checked'] ?? false) {
            if (empty($data['vacation_special']['withinPhilippines']['input'])) {
                $validator->errors()->add('detailsOfLeave.vacation_special.withinPhilippines.input', 'Please provide details');
            }
        }

        // Validate vacation_special.abroad
        if ($data['vacation_special']['abroad']['checked'] ?? false) {
            if (empty($data['vacation_special']['abroad']['input'])) {
                $validator->errors()->add('detailsOfLeave.vacation_special.abroad.input', 'Please provide details');
            }
        }

        // Validate sick.inHospital
        if ($data['sick']['inHospital']['checked'] ?? false) {
            if (empty($data['sick']['inHospital']['input'])) {
                $validator->errors()->add('detailsOfLeave.sick.inHospital.input', 'Please provide details');
            }
        }

        // Validate sick.outPatient
        if ($data['sick']['outPatient']['checked'] ?? false) {
            if (empty($data['sick']['outPatient']['input'])) {
                $validator->errors()->add('detailsOfLeave.sick.outPatient.input', 'Please provide details');
            }
        }
    }

    protected function validateOnlyOneChecked($data, $validator)
    {
        $checkedFields = [
            $data['vacation_special']['withinPhilippines']['checked'] ?? false,
            $data['vacation_special']['abroad']['checked'] ?? false,
            $data['sick']['inHospital']['checked'] ?? false,
            $data['sick']['outPatient']['checked'] ?? false,
            !empty($data['benefitsForWomen']),
            $data['study']['degree'] ?? false,
            $data['study']['examReview'] ?? false,
            $data['other']['monetization'] ?? false,
            $data['other']['terminal'] ?? false,
        ];

        if (count(array_filter($checkedFields)) > 1) {
            $validator->errors()->add('detailsOfLeave', 'Please specify only 1 details of leave.');
        }
    }
}
