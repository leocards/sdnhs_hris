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
            $table->enum('education_type', ['elementary', 'secondary', 'vocational', 'college', 'gradaute']);
            $table->string('school');
            $table->string('course')->nullable();
            $table->year('from');
            $table->year('to');
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
