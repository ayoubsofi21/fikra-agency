<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('key', 30)->unique();
            $table->json('name');
            $table->json('description')->nullable();
            $table->json('tagline')->nullable();
            $table->json('cta')->nullable();
            $table->decimal('price_monthly', 10, 2)->nullable();
            $table->decimal('price_yearly', 10, 2)->nullable();
            $table->decimal('price_one_time', 10, 2)->nullable();
            $table->string('currency', 10)->default('USD');
            $table->json('features')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
