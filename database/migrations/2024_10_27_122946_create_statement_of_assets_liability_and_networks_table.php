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
        Schema::create('statement_of_assets_liability_and_networths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->date('asof');
            $table->date('date');
            $table->enum('isjoint', ['joint', 'separate', 'none']);
            $table->boolean('isApproved')->nullable();
            $table->timestamps();
        });

        Schema::create('saln_spouses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_id');
            $table->string('family_name')->nullable();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('position')->nullable();
            $table->string('office')->nullable();
            $table->string('office_address')->nullable();
            $table->string('government_id')->nullable();
            $table->string('government_id_no')->nullable();
            $table->string('date_issued')->nullable();
            $table->timestamps();

            $table->foreign('saln_id')->references('id')->on('statement_of_assets_liability_and_networths');
        });

        Schema::create('saln_childrens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_id');
            $table->string('name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('age')->nullable();
            $table->timestamps();

            $table->foreign('saln_id')->references('id')->on('statement_of_assets_liability_and_networths');
        });

        Schema::create('saln_assets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_id');
            $table->enum('asset_type', ['real', 'personal'])->nullable();
            $table->string('description')->nullable();
            $table->string('kind')->nullable();
            $table->string('location')->nullable();
            $table->string('assessed_value')->nullable();
            $table->string('current_market_value')->nullable();
            $table->string('year')->nullable();
            $table->string('mode')->nullable();
            $table->string('cost')->nullable();
            $table->timestamps();

            $table->foreign('saln_id')->references('id')->on('statement_of_assets_liability_and_networths');
        });

        Schema::create('saln_liabilities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_id');
            $table->string('nature')->nullable();
            $table->string('creditors')->nullable();
            $table->string('balances')->nullable();
            $table->timestamps();

            $table->foreign('saln_id')->references('id')->on('statement_of_assets_liability_and_networths');
        });

        Schema::create('saln_bi_fcs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_id');
            $table->boolean('has_bi_fc')->nullable();
            $table->timestamps();

            $table->foreign('saln_id')->references('id')->on('statement_of_assets_liability_and_networths');
        });

        Schema::create('saln_bi_fcs_bifcs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_bi_fc_id');
            $table->string('name')->nullable();
            $table->string('address')->nullable();
            $table->string('nature')->nullable();
            $table->date('date')->nullable();
            $table->timestamps();

            $table->foreign('saln_bi_fc_id')->references('id')->on('saln_bi_fcs');
        });

        Schema::create('saln_relatives', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_id');
            $table->boolean('has_relative')->nullable();
            $table->timestamps();

            $table->foreign('saln_id')->references('id')->on('statement_of_assets_liability_and_networths');
        });

        Schema::create('saln_relatives_datas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('saln_relative_id');
            $table->string('name')->nullable();
            $table->string('relationship')->nullable();
            $table->string('position')->nullable();
            $table->string('agency_address')->nullable();
            $table->timestamps();

            $table->foreign('saln_relative_id')->references('id')->on('saln_relatives');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saln_spouses');
        Schema::dropIfExists('saln_childrens');
        Schema::dropIfExists('saln_assets');
        Schema::dropIfExists('saln_liabilities');
        Schema::dropIfExists('saln_bi_fcs_bifcs');
        Schema::dropIfExists('saln_bi_fcs');
        Schema::dropIfExists('saln_relatives_datas');
        Schema::dropIfExists('saln_relatives');
        Schema::dropIfExists('statement_of_assets_liability_and_networths');
    }
};
