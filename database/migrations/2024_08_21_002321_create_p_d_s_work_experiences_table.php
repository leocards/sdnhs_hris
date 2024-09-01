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
        Schema::create('p_d_s_work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->date('from');
            $table->date('to');
            $table->string('position_title');
            $table->string('company');
            $table->string('monthly_salary', 20);
            $table->string('salary_grade');
            $table->string('status', 45);
            $table->boolean('is_government_service')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_d_s_work_experiences');
    }
};
