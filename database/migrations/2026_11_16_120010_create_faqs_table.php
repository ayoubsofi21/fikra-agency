<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('group', 20)->default('general');
            $table->json('question');
            $table->json('answer');
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'order']);
            $table->index('group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
