<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteComment extends Model
{
    protected $table = 'quote_comment';

    public $timestamps = false;

    protected $guarded = [];
}
