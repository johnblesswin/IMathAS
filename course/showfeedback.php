<?php
//IMathAS - display feedback
//(c) 2018 David Lippman

$flexwidth = true;
$nologo = true;
require("../init.php");
require("../header.php");

if (!isset($studentid) && !isset($tutorid) && !isset($teacherid)) {
	echo "You are not registered in this course";
	exit;
}

$id = Sanitize::onlyInt($_GET['id']);
$type = Sanitize::simpleString($_GET['type']);

if ($type=='A') {
	$query = "SELECT ia.name,ias.feedback FROM imas_assessment_sessions AS ias ";
	$query .= "JOIN imas_assessments AS ia ON ia.id=ias.assessmentid ";
	$query .= "WHERE ias.id=? AND ia.courseid=? ";
	$qarr = array($id, $cid);
	if (isset($studentid)) {
		$query .= "AND ias.userid=?";
		$qarr[] = $userid;
	}
	$stm = $DBH->prepare($query);
	$stm->execute($qarr);
	
	list($aname, $origfeedback) = $stm->fetch(PDO::FETCH_NUM);
	
	echo '<h2>'.sprintf(_('Feedback on %s'), Sanitize::encodeStringForDisplay($aname)).'</h2>';
	$feedback = json_decode($origfeedback, true);
	if ($feedback === null) {
		$feedback = array('Z'=>$origfeedback);
	}
	$fbkeys = array_keys($feedback);
	natsort($fbkeys);
	
	foreach ($fbkeys as $key) {
		if ($feedback[$key]=='' || $feedback[$key]=='<p></p>') {
			continue;
		}
		if ($key=='Z') {
			echo '<p>'._('Overall feedback:').'</p>';
		} else {
			$qn = substr($key,1);
			echo '<p>'.sprintf(_('Feedback on Question %d:'), $qn+1).'</p>';
		}
		echo '<div class="fbbox">'.Sanitize::outgoingHtml($feedback[$key]).'</div>';
	}
}

require("../footer.php");
	
