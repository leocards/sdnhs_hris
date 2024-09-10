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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->unsignedBigInteger('from_user_id');
            $table->string('message');
            $table->enum('type', ['leave', 'certificate', 'profile', 'medical', 'response'])->nullable();
            $table->string('go_to_link', 500)->nullable();
            $table->boolean('viewed')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('from_user_id')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
