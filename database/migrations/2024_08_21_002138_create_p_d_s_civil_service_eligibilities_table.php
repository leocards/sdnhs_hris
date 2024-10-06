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
        Schema::create('p_d_s_civil_service_eligibilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('career_service');
            $table->string('rating', 20)->nullable();
            $table->string('examination', 12)->nullable();
            $table->string('place_examination')->nullable();
            $table->string('license_number', 20)->nullable();
            $table->string('license_date_validity', 15)->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_d_s_civil_service_eligibilities');
    }
};
