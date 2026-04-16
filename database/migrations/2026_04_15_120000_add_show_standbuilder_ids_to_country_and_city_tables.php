<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('countrytables') && ! Schema::hasColumn('countrytables', 'show_standbuilder_ids')) {
            Schema::table('countrytables', function (Blueprint $table) {
                $table->text('show_standbuilder_ids')->nullable()->after('disply_home');
            });
        }

        if (Schema::hasTable('citytables') && ! Schema::hasColumn('citytables', 'show_standbuilder_ids')) {
            Schema::table('citytables', function (Blueprint $table) {
                $table->text('show_standbuilder_ids')->nullable()->after('displypage');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('countrytables') && Schema::hasColumn('countrytables', 'show_standbuilder_ids')) {
            Schema::table('countrytables', function (Blueprint $table) {
                $table->dropColumn('show_standbuilder_ids');
            });
        }

        if (Schema::hasTable('citytables') && Schema::hasColumn('citytables', 'show_standbuilder_ids')) {
            Schema::table('citytables', function (Blueprint $table) {
                $table->dropColumn('show_standbuilder_ids');
            });
        }
    }
};
