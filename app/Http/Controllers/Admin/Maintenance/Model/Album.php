<?php

namespace App\Http\Controllers\Admin\Maintenance\Model;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\Node;
use Kalnoy\Nestedset\NodeTrait;

/**
 * This is necessary to fix the tree of the album model.
 * We do not want to have to deal with the relationships here.
 *
 * @implements Node<Album>
 */
class Album extends Model implements Node
{
	/** @phpstan-use NodeTrait<Album> */
	use NodeTrait;
	public $timestamps = false;
}