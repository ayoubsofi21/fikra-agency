<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('category', 50)->default('development');
            $table->json('title');
            $table->json('short_description');
            $table->json('description');
            $table->json('deliverables')->nullable();
            $table->json('technologies')->nullable();
            $table->json('timeline')->nullable();
            $table->string('price_model', 20)->default('custom');
            $table->unsignedInteger('price_from')->nullable();
            $table->string('price_currency', 10)->default('USD');
            $table->string('price_period', 20)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
