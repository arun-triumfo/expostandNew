<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tradeshow_data', function (Blueprint $table) {
            $table->index('slug', 'idx_tradeshow_slug');
            $table->index(['status', 'fair_start_date'], 'idx_tradeshow_status_start');
            $table->index('fair_city', 'idx_tradeshow_city');
            $table->index('fair_country', 'idx_tradeshow_country');
        });

        Schema::table('article', function (Blueprint $table) {
            $table->index('slug', 'idx_article_slug');
            $table->index('status', 'idx_article_status');
        });
    }

    public function down(): void
    {
        Schema::table('tradeshow_data', function (Blueprint $table) {
            $table->dropIndex('idx_tradeshow_slug');
            $table->dropIndex('idx_tradeshow_status_start');
            $table->dropIndex('idx_tradeshow_city');
            $table->dropIndex('idx_tradeshow_country');
        });

        Schema::table('article', function (Blueprint $table) {
            $table->dropIndex('idx_article_slug');
            $table->dropIndex('idx_article_status');
        });
    }
};
