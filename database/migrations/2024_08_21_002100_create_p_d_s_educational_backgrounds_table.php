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
        Schema::create('p_d_s_educational_backgrounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->enum('education_type', ['elementary', 'secondary', 'senior high', 'vocational', 'college', 'graduate'])->nullable();
            $table->string('school')->nullable();
            $table->string('course')->nullable();
            $table->string('from', 15)->nullable();
            $table->string('to', 15)->nullable();
            $table->string('highest_earned')->nullable();
            $table->year('year_graduated')->nullable();
            $table->string('honors')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_d_s_educational_backgrounds');
    }
};
