<?php
/**
 * ownCloud - Documents App
 *
 * @author Victor Dubiniuk
 * @copyright 2013 Victor Dubiniuk victor.dubiniuk@gmail.com
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 */

namespace OCA\Documents;

class Db_Op extends Db {

	const DB_TABLE = '`*PREFIX*documents_op`';
	
	protected $tableName = '`*PREFIX*documents_op`';
	
	protected $insertStatement = 'INSERT INTO `*PREFIX*documents_op` (`es_id`, `member`, `opspec`) VALUES (?, ?, ?)';

	public static function addOpsArray($esId, $memberId, $ops){
		$lastSeq = "";
		$opObj = new Db_Op();
		foreach ($ops as $op) {
			$opObj->setData(array(
				$esId, 
				$memberId, 
				json_encode($op)
			));
			$opObj->insert();
			$lastSeq = $opObj->getLastInsertId();
		}
		return $lastSeq;
	}
	
	/**
	 * @returns "" when there are no Ops, or the seq of the last Op
	 */
	public function getHeadSeq($esId){
		$query = \OCP\DB::prepare('
			SELECT `seq`
			FROM ' . $this->tableName . '
			WHERE `es_id`=?
			ORDER BY `seq` DESC
			', 1);
		$result = $query->execute(array(
				$esId
			))
			->fetchOne()	
		;
		return !$result ? "" : $result;
	}
	
	public function getOpsAfterJson($esId, $seq){
		$ops = $this->getOpsAfter($esId, $seq);
		if (!is_array($ops)){
			$ops = array();
		}
		$ops =  array_map(
				function($x){
					$decoded = json_decode($x['opspec'], true);
					$decoded['memberid'] = strval($decoded['memberid']);
					return $decoded;
				}, 
				$ops
		);
		return $ops;
	}
	
	public function getOpsAfter($esId, $seq){
		if ($seq == ""){
			$seq = -1;
		}
		$query = \OCP\DB::prepare('
			SELECT `opspec`
			FROM ' . self::DB_TABLE . '
			WHERE `es_id`=?
				AND `seq`>?
			ORDER BY `seq` ASC
			');
		$result = $query->execute(array($esId, $seq));
		return $result->fetchAll();
	}

	public function removeCursor($esId, $memberId){
		$op = new Db_Op(array(
			$esId, 
			0,
			'{"optype":"RemoveCursor","memberid":"'. $memberId .'","reason":"server-idle","timestamp":'. time() .'}'
		));
		$op->insert();
	}
}
