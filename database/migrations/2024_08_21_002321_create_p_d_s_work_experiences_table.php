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
            $table->string('from', 10)->nullable();
            $table->string('to', 10)->nullable();
            $table->string('position_title')->nullable();
            $table->string('company')->nullable();
            $table->string('monthly_salary', 20)->nullable();
            $table->string('salary_grade')->nullable();
            $table->string('status', 45)->nullable();
            $table->boolean('is_government_service')->nullable()->default(false);
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
