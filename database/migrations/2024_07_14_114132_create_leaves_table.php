<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date_of_filing');
            $table->string('salary');
            $table->string('leave_type');
            $table->string('leave_type_others', 500)->nullable();
            $table->string('num_days_applied');
            $table->date('inclusive_date_from');
            $table->date('inclusive_date_to');
            $table->boolean('is_not_requested')->nullable();
            $table->boolean('is_requested')->nullable();
            $table->enum('principal_status', ['Rejected', 'Approved', 'Pending'])->default('Pending');
            $table->enum('hr_status', ['Rejected', 'Approved', 'Pending'])->default('Pending');
            $table->text('principal_reject_msg')->nullable();
            $table->text('hr_reject_msg')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('details_of_leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leave_id')->constrained()->onDelete('cascade');
            $table->boolean('is_philippines')->nullable();
            $table->string('is_philippines_input', 1000)->nullable();
            $table->boolean('is_abroad')->nullable();
            $table->string('is_abroad_input', 1000)->nullable();
            $table->boolean('is_in_hospital')->nullable();
            $table->string('is_in_hospital_input', 1000)->nullable();
            $table->boolean('is_out_patient')->nullable();
            $table->string('is_out_patient_input', 1000)->nullable();
            $table->string('special_leave_women', 1000)->nullable();
            $table->boolean('is_master_degree')->nullable();
            $table->boolean('is_review')->nullable();
            $table->boolean('is_monetization')->nullable();
            $table->boolean('is_terminal_leave')->nullable();
            $table->timestamps();
        });

        Schema::create('details_of_action_leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leave_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('as_of')->nullable();
            $table->string('total_earned_vacation')->nullable();
            $table->string('total_earned_sick')->nullable();
            $table->string('less_application_vacation')->nullable();
            $table->string('less_application_sick')->nullable();
            $table->string('balanced_vacation')->nullable();
            $table->string('balanced_sick')->nullable();
            $table->boolean('is_for_approval')->nullable();
            $table->boolean('is_for_disapproval')->nullable();
            $table->string('is_for_disapproval_input')->nullable();
            $table->string('approved_for_days_with_pay')->nullable();
            $table->string('approved_for_days_with_out_pay')->nullable();
            $table->string('approved_for_others', 500)->nullable();
            $table->string('disapproved', 1000)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('details_of_action_leaves');
        Schema::dropIfExists('details_of_leaves');
        Schema::dropIfExists('leaves');
    }
};
