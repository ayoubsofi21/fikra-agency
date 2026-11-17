<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('category', 50);
            $table->json('title');
            $table->string('client_name')->nullable();
            $table->json('summary');
            $table->json('problem')->nullable();
            $table->json('solution')->nullable();
            $table->json('result')->nullable();
            $table->json('technologies')->nullable();
            $table->string('live_url')->nullable();
            $table->string('image')->nullable();
            $table->string('cover')->nullable();
            $table->json('gallery')->nullable();
            $table->date('completed_at')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'order']);
            $table->index('category');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
