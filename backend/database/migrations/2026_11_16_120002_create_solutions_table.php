<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solutions', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->foreignId('category_id')->nullable()->constrained('solution_categories')->nullOnDelete();
            $table->json('title');
            $table->json('short_description');
            $table->json('description');
            $table->json('technologies')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('badge', 30)->nullable();
            $table->string('type', 20)->default('template');
            $table->string('license_type', 30)->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->string('image')->nullable();
            $table->string('pricing_model', 20)->default('one_time');
            $table->decimal('price', 10, 2)->nullable();
            $table->string('currency', 10)->default('USD');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'order']);
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solutions');
    }
};
