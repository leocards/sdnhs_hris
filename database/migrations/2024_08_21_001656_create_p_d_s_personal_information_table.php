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
        Schema::create('p_d_s_personal_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('email')->nullable();
            $table->enum('citizenship', ['Filipino', 'Dual'])->nullable();
            $table->enum('dual_by', ['birth', 'naturalization'])->nullable();
            $table->string('citizenship_country')->nullable();
            $table->string('blood_type')->nullable();
            $table->string('gsis')->nullable();
            $table->string('pag_ibig')->nullable();
            $table->string('philhealth')->nullable();
            $table->string('sss')->nullable();
            $table->string('tin')->nullable();
            $table->string('agency')->nullable();
            $table->string('telephone')->nullable();
            $table->string('mobile')->nullable();
            $table->boolean('is_approved')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_d_s_personal_information');
    }
};
