<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->json('author_name');
            $table->json('author_role');
            $table->json('company')->nullable();
            $table->json('content');
            $table->string('avatar')->nullable();
            $table->json('project_type')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
