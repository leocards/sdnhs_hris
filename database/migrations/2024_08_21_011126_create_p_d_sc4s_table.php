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
        Schema::create('p_d_sc4s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->enum('question', ['34', '35', '36', '37', '38', '39', '40']);
            $table->enum('sets', ['a', 'b', 'c', 'question']);
            $table->boolean('choices');
            $table->string('details', 500)->nullable();
            $table->date('date_filed')->nullable();
            $table->string('case_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_d_sc4s');
    }
};
