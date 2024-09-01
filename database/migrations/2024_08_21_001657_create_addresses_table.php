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
            $table->unsignedBigInteger('pds_pi_id');
            $table->enum('address_type', ['residential', 'permanent']);
            $table->boolean('same')->default(false)->nullable();
            $table->string('house_no', 50)->nullable();
            $table->string('street', 100)->nullable();
            $table->string('subdivision', 100)->nullable();
            $table->string('barangay', 100)->nullable();
            $table->string('municipality', 50)->nullable();
            $table->string('province', 50)->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->timestamps();

            $table->foreign('pds_pi_id')->references('id')->on('p_d_s_personal_information');
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
