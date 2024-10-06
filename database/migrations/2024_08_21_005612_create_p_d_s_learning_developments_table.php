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
        Schema::create('p_d_s_learning_developments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('title')->nullable();
            $table->string('from', 15)->nullable();
            $table->string('to', 15)->nullable();
            $table->string('num_hours', 5)->nullable();
            $table->string('type_of_ld')->nullable();
            $table->string('conducted_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_d_s_learning_developments');
    }
};
