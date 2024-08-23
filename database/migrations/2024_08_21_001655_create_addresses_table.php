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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->enum('address_type', ['residential', 'permanent']);
            $table->string('house_no', 50)->nullable();
            $table->string('street', 100)->nullable();
            $table->string('subdivision', 100)->nullable();
            $table->string('barangay', 100)->nullable();
            $table->string('municipality', 50)->nullable();
            $table->string('province', 50)->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
