<?php
//IMathAS: Common Catridge v1.1 Export
//(c) 2011 David Lippman

require("../init.php");
require("../includes/copyiteminc.php");
require("../includes/loaditemshowdata.php");

if (!is_numeric($_GET['cid'])) {
	echo 'Invalid course ID.';
	exit;
}

$cid = Sanitize::courseId($_GET['cid']);
if (!isset($teacherid)) {
	echo 'You must be a teacher to access this page';
	exit;
}

if (!defined('ENT_XML1')) {
	define('ENT_XML1',ENT_QUOTES);
}
function leftpad($str) {
	return str_pad($str, 5, '0', STR_PAD_LEFT);	
}
function xmlstr($str) {
	return htmlentities($str,ENT_XML1,'UTF-8',false);
}
function bbdate($time) {
	return date("Y-m-d H:i:s T", $time);
}
function createbbitem($resid, $parentid, $template, $title, $rep, $handler, &$res) {
	global $newdir, $handlers;
	
	$item = $GLOBALS[$template];
	foreach ($rep as $k=>$v) {
		$item = str_replace($k,$v,$item);
	}
	if (isset($handlers[$handler]) && !empty($handlers[$handler][0])) {
		$item = str_replace('{{handler}}', $handlers[$handler][0], $item);
		$item = str_replace('{{rendertype}}', $handlers[$handler][1], $item);
	}
	$item = str_replace('{{parentid}}', $parentid, $item);
	
	//empty-string out any remaining fields
	$item = preg_replace('/{{\w+}}/', '', $item);
	
	file_put_contents($newdir.'/'.$resid.'.dat',$item);
	$res[] = '<resource bb:file="'.$resid.'.dat" bb:title="'.xmlstr($title).'" identifier="'.$resid.'" type="'.$handlers[$handler][2].'" xml:base="'.$resid.'"/>';
}		
//make $mathimgurl absolute if not already
if (substr($mathimgurl,0,4)!='http' && isset($GLOBALS['basesiteurl'])) {
	$mathimgurl = substr($GLOBALS['basesiteurl'],0,-1*strlen($imasroot)). $mathimgurl;
}
function filtercapture($str) {
	$str = forcefiltermath($str);
	$str = forcefiltergraphnofile($str);
	return $str;
}
function forcefiltergraphnofile($str) {
	if (strpos($str,'embed')!==FALSE) {
		$str = preg_replace_callback('/<\s*embed.*?sscr=(.)(.+?)\1.*?>/','svgfiltersscrcallbacknofile',$str);
		$str = preg_replace_callback('/<\s*embed.*?script=(.)(.+?)\1.*?>/','svgfilterscriptcallbacknofile',$str);
	}
	return $str;
}
function svgfiltersscrcallbacknofile($arr) {
	if (trim($arr[2])=='') {return $arr[0];}

	if (strpos($arr[0],'style')!==FALSE) {
		$sty = preg_replace('/.*style\s*=\s*(.)(.+?)\1.*/',"$2",$arr[0]);
	} else {
		$sty = "vertical-align: middle;";
	}
	return ('<img src="'.$GLOBALS['basesiteurl'].'/filter/graph/svgimg.php?sscr='.Sanitize::encodeUrlParam($arr[2]).'" style="'.$sty.'" alt="Graphs"/>');
}
function svgfilterscriptcallbacknofile($arr) {
	if (trim($arr[2])=='') {return $arr[0];}

	$w = preg_replace('/.*\bwidth\s*=\s*.?(\d+).*/',"$1",$arr[0]);
	$h = preg_replace('/.*\bheight\s*=\s*.?(\d+).*/',"$1",$arr[0]);

	if (strpos($arr[0],'style')!==FALSE) {
		$sty = preg_replace('/.*style\s*=\s*(.)(.+?)\1.*/',"$2",$arr[0]);
	} else {
		$sty = "vertical-align: middle;";
	}
	return ('<img src="'.$GLOBALS['basesiteurl'].'/filter/graph/svgimg.php?script='.Sanitize::encodeUrlParam($arr[2]).'" style="'.$sty.'" alt="Graphs"/>');
}

$path = realpath("../course/files");

if (isset($_GET['create'])) {
	error_reporting(0);
	$loadmathfilter = 1;
	$loadgraphfilter = 1;
	require_once("../includes/filehandler.php");
	require_once("../filter/filter.php");
	
	$usechecked = ($_POST['whichitems']=='select');
	if ($usechecked) {
		$checked = $_POST['checked'];
	} else {
		$checked = array();
	}

	$linktype = $_POST['type'];
	$iteminfo = array();
	//DB $query = "SELECT id,itemtype,typeid FROM imas_items WHERE courseid=$cid";
	//DB $r = mysql_query($query) or die("Query failed : " . mysql_error());
	//DB while ($row = mysql_fetch_row($r)) {
	$stm = $DBH->prepare("SELECT id,itemtype,typeid FROM imas_items WHERE courseid=:courseid");
	$stm->execute(array(':courseid'=>$cid));
	while ($row = $stm->fetch(PDO::FETCH_NUM)) {
		$iteminfo[$row[0]] = array($row[1],$row[2]);
	}

	//DB $query = "SELECT itemorder FROM imas_courses WHERE id=$cid";
	//DB $r = mysql_query($query) or die("Query failed : " . mysql_error());
	//DB $items = unserialize(mysql_result($r,0,0));
	$stm = $DBH->prepare("SELECT itemorder,name,dates_by_lti FROM imas_courses WHERE id=:id");
	$stm->execute(array(':id'=>$cid));
	list($itemorder,$coursename,$datesbylti) = $stm->fetch(PDO::FETCH_NUM);
	$items = unserialize($itemorder);
	
	$newdir = $path . '/BBEXPORT'.$cid;
	mkdir($newdir);

	$manifestorg = '';
	$manifestres = array();
	$gbitems = array();
	$junk = array();
	
	$imgcnt = 1;
	$htmldir = '';
	$filedir = '';

	require("bbexport-templates.php");
	
	file_put_contents($newdir.'/.bb-package-info',$bbinfo);
	
	$bbnow = bbdate(time());
	//write initial folder stuff
	createbbitem('res00001', '', 'toc', $coursename, array(
		'{{id}}' => uniqid(),
		'{{label}}' => xmlstr($coursename)
		), 'toc', $manifestres);
	
	$initialblockid = uniqid();
	createbbitem('res00002', '', 'toctop', '--TOP--', array(
		'{{id}}' => $initialblockid,
		'{{title}}' => '--TOP--',
		'{{created}}' => $bbnow
		), 'folder', $manifestres);
	
	createbbitem('res00003', '', 'conf', 'Conferences', array(
		'{{id}}' => 'conf1',
		'{{coursename}}' => xmlstr($coursename),
		'{{created}}' => $bbnow,
		), 'conf', $manifestres);
	
	$datcnt = 4;
	
	$ccnt = 1;
	$module_meta = '';

	$toplevelitems = '';
	$inmodule = false;

	function getorg($it,$parent,&$res,$ind, $parentid) {
		global $DBH,$iteminfo,$newdir,$installname,$urlmode,$linktype,$urlmode,$imasroot,$ccnt,$module_meta,$htmldir,$filedir, $toplevelitems, $inmodule;
		global $usechecked,$checked,$usedcats;
		global $datcnt, $newdir, $datcnt, $bbnow;
		global $gbitems;

		$out = '';

		foreach ($it as $k=>$item) {
			if (is_array($item)) {
				if (!$usechecked || array_search($parent.'-'.($k+1),$checked)!==FALSE) {
					$resid = 'res'.leftpad($datcnt);
					$datcnt++;
					$blockid = uniqid();
					createbbitem($resid, $parentid, 'toctop', $item['name'], array(
						'{{id}}' => $blockid,
						'{{title}}' =>  xmlstr($item['name']),
						'{{parentid}}' => $parentid,
						'{{created}}' => $bbnow
						), 'folder', $res);
					
					$out .= $ind.'<item identifier="BLOCK'.$item['id'].'" identifierref="'.$resid.'">'."\n";
					$out .= $ind.'  <title>'.xmlstr($item['name']).'</title>'."\n";
					$out .= $ind.getorg($item['items'],$parent.'-'.($k+1),$res,$ind.'  ', $blockid);
					$out .= $ind.'</item>'."\n";
					
					
				} else {
					$out .= $ind.getorg($item['items'],$parent.'-'.($k+1),$res,$ind.'  ', $parentid);
				}

			} else {
				if ($usechecked && array_search($item,$checked)===FALSE) {
					continue;
				}
				$resid = 'res'.leftpad($datcnt);
				$datcnt++;
				if ($iteminfo[$item][0]=='InlineText') {
					$stm = $DBH->prepare("SELECT title,text,fileorder,avail FROM imas_inlinetext WHERE id=:id");
					$stm->execute(array(':id'=>$iteminfo[$item][1]));
					$row = $stm->fetch(PDO::FETCH_NUM);
					if ($row[2]!='') {
						$files = explode(',',$row[2]);
						$stm = $DBH->prepare("SELECT id,description,filename FROM imas_instr_files WHERE itemid=:itemid");
						$stm->execute(array(':itemid'=>$iteminfo[$item][1]));
						$filesout = array();
						//DB while ($r = mysql_fetch_row($result)) {
						while ($r = $stm->fetch(PDO::FETCH_NUM)) {
							//do files as weblinks rather than including the file itself
							if (substr($r[2],0,4)=='http') {
								//do nothing
							} else { 
								$r[2] = getcoursefileurl($r[2], true);
							}
							$filesout[$r[0]] = array($r[1],$r[2]);
						}
					}
					$out .= $ind.'<item identifier="'.$iteminfo[$item][0].$iteminfo[$item][1].'" identifierref="'.$resid.'">'."\n";
					$out .= $ind.'  <title>'.xmlstr($row[0]).'</title>'."\n";
					$out .= $ind.'</item>'."\n";
					
					$text = $row[1];
					if ($row[2]!='') {
						$text .= '<ul>';
						foreach ($files as $f) {
							$text .= '<li><a href="'.$filesout[$f][1].'">'.htmlentities($filesout[$f][0]).'</a></li>';
						}
						$text .= '</ul>';
					}
					
					createbbitem($resid, $parentid, 'basicitem', $row[0], array(
						'{{id}}' => uniqid(),
						'{{title}}' => xmlstr($row[0]),
						'{{summary}}' => xmlstr(filtercapture($text)),
						'{{created}}' => $bbnow,
						'{{newwindow}}' => "false"
						), 'text', $res);

				} else if ($iteminfo[$item][0]=='LinkedText') {
					$stm = $DBH->prepare("SELECT title,text,summary,avail FROM imas_linkedtext WHERE id=:id");
					$stm->execute(array(':id'=>$iteminfo[$item][1]));
					$row = $stm->fetch(PDO::FETCH_NUM);

					$out .= $ind.'<item identifier="'.$iteminfo[$item][0].$iteminfo[$item][1].'" identifierref="'.$resid.'">'."\n";
					$out .= $ind.'  <title>'.xmlstr($row[0]).'</title>'."\n";
					$out .= $ind.'</item>'."\n";
					
					//do files as weblinks rather than including the file itself
					if (substr(strip_tags($row[1]),0,5)=="file:") {
						$row[1] = getcoursefileurl(trim(substr(strip_tags($row[1]),5)), true);
					}

					if ((substr($row[1],0,4)=="http") && (strpos(trim($row[1])," ")===false)) { //is a web link
						$alink = trim($row[1]);
						createbbitem($resid, $parentid, 'basicitem', $row[0], array(
							'{{id}}' => uniqid(),
							'{{title}}' => xmlstr($row[0]),
							'{{summary}}' => xmlstr(filtercapture($row[2])),
							'{{created}}' => $bbnow,
							'{{launchurl}}' => $alink,
							'{{newwindow}}' => "true"
							), 'link', $res);
					} else { //is text
						createbbitem($resid, $parentid, 'basicitem', $row[0], array(
							'{{id}}' => uniqid(),
							'{{title}}' => xmlstr($row[0]),
							'{{summary}}' => xmlstr(filtercapture($row[1])),
							'{{created}}' => $bbnow,
							'{{newwindow}}' => "false"
							), 'page', $res);
					}
				} else if ($iteminfo[$item][0]=='Forum') {
					$stm = $DBH->prepare("SELECT name,description,avail FROM imas_forums WHERE id=:id");
					$stm->execute(array(':id'=>$iteminfo[$item][1]));
					$row = $stm->fetch(PDO::FETCH_NUM);
					
					$forumresid = $resid;
					createbbitem($forumresid, $parentid, 'forum', $row[0], array(
							'{{id}}' => uniqid(),
							'{{conferenceid}}' => 'conf1',
							'{{title}}' => xmlstr($row[0]),
							'{{summary}}' => xmlstr(filtercapture($row[1])),
							'{{created}}' => $bbnow
							), 'forum', $res);
					
					$resid = 'res'.leftpad($datcnt);
					$datcnt++;
					
					$out .= $ind.'<item identifier="'.$iteminfo[$item][0].$iteminfo[$item][1].'" identifierref="'.$resid.'">'."\n";
					$out .= $ind.'  <title>'.xmlstr($row[0]).'</title>'."\n";
					$out .= $ind.'</item>'."\n";
										
					createbbitem($resid, $parentid, 'basicitem', $row[0], array(
							'{{id}}' => uniqid(),
							'{{title}}' => xmlstr($row[0]),
							'{{summary}}' => xmlstr(filtercapture($row[1])),
							'{{created}}' => $bbnow,
							'{{newwindow}}' => "false"
							), 'forumitem', $res);
					
					$forumlinkresid = 'res'.leftpad($datcnt);
					$datcnt++;
					
					createbbitem($forumlinkresid, $parentid, 'forumlink', '', array(
							'{{id}}' => uniqid(),
							'{{itemdat}}' => $resid,
							'{{forumdat}}' => $forumresid
							), 'forumlink', $res);
					
				} else if ($iteminfo[$item][0]=='Assessment') {
					//DB $query = "SELECT name,summary,defpoints,itemorder FROM imas_assessments WHERE id='{$iteminfo[$item][1]}'";
					//DB $r = mysql_query($query) or die("Query failed : " . mysql_error());
					//DB $row = mysql_fetch_row($r);
					$stm = $DBH->prepare("SELECT name,summary,defpoints,itemorder,enddate,gbcategory,avail,startdate,ptsposs FROM imas_assessments WHERE id=:id");
					$stm->execute(array(':id'=>$iteminfo[$item][1]));
					$row = $stm->fetch(PDO::FETCH_NUM);
					if ($row[8]==-1) {
						require_once("../includes/updateptsposs.php");
						$row[8] = updatePointsPossible($iteminfo[$item][1], $row[3], $row[2]);	
					}
					
					$out .= $ind.'<item identifier="'.$iteminfo[$item][0].$iteminfo[$item][1].'" identifierref="'.$resid.'">'."\n";
					$out .= $ind.'  <title>'.xmlstr($row[0]).'</title>'."\n";
					$out .= $ind.'</item>'."\n";
					
					$extended = '<ENTRY key="customParameters"/>';
					$extended .= '<ENTRY key="alternateUrl">http://'.Sanitize::domainNameWithPort($_SERVER['HTTP_HOST']) . $imasroot . '/bltilaunch.php?custom_place_aid='.$iteminfo[$item][1].'</ENTRY>';
					$extended .= '<ENTRY key="vendorInfo">name='.$installname.'&amp;code=IMathAS</ENTRY>';
					
					createbbitem($resid, $parentid, 'basicitem', $row[0], array(
							'{{id}}' => uniqid(),
							'{{title}}' => xmlstr($row[0]),
							'{{summary}}' => xmlstr(filtercapture($row[1])),
							'{{created}}' => $bbnow,
							'{{newwindow}}' => "false",
							'{{launchurl}}' => $urlmode.Sanitize::domainNameWithPort($_SERVER['HTTP_HOST']) . $imasroot . '/bltilaunch.php?custom_place_aid='.$iteminfo[$item][1],
							'{{extendeddata}}' => $extended
							), 'lti', $res);
					
					$gbitem = $GLOBALS['outcomedef'];
					$gbitem = str_replace('{{defid}}', uniqid(), $gbitem);
					$gbitem = str_replace('{{resid}}', $resid, $gbitem);
					$gbitem = str_replace('{{duedate}}', $row[4]==2000000000?'':bbdate($row[4]), $gbitem);
					$gbitem = str_replace('{{title}}', xmlstr($row[0]), $gbitem);
					$gbitem = str_replace('{{ptsposs}}', $row[8], $gbitem);
					$gbitems[] = $gbitem;
					
				} else if ($iteminfo[$item][0]=='Wiki') {
					$stm = $DBH->prepare("SELECT name,avail FROM imas_wikis WHERE id=:id");
					$stm->execute(array(':id'=>$iteminfo[$item][1]));
					$row = $stm->fetch(PDO::FETCH_NUM);
					
					$out .= $ind.'<item identifier="'.$iteminfo[$item][0].$iteminfo[$item][1].'" identifierref="'.$resid.'">'."\n";
					$out .= $ind.'  <title>'.xmlstr($row[0]).'</title>'."\n";
					$out .= $ind.'</item>'."\n";

					$stm = $DBH->prepare("SELECT revision FROM imas_wiki_revisions WHERE wikiid=:wikiid AND stugroupid=0 ORDER BY id DESC LIMIT 1");
					$stm->execute(array(':wikiid'=>$iteminfo[$item][1]));
					if ($stm->rowCount()>0) {
						$text = $stm->fetchColumn(0);
						if (strlen($text)>6 && substr($text,0,6)=='**wver') {
							$wikiver = substr($text,6,strpos($text,'**',6)-6);
							$text = substr($text,strpos($text,'**',6)+2);
						}
					}
					
					createbbitem($resid, $parentid, 'basicitem', $row[0], array(
							'{{id}}' => uniqid(),
							'{{title}}' => xmlstr($row[0]),
							'{{summary}}' => xmlstr(filtercapture($text)),
							'{{created}}' => $bbnow,
							'{{newwindow}}' => "false"
							), 'page', $res);

				}
			}
		}
		return $out;
	}

	$manifestorg = getorg($items,'0',$manifestres,'  ', $initialblockid);
	
	if (count($gbitems)>0) {
		$resid = 'res'.leftpad($datcnt);
		createbbitem($resid, $parentid, 'gb', 'Gradebook', array(
			'{{outcomedefs}}' => implode("\n", $gbitems)
			), 'gb', $manifestres);
	}

	$manifest = str_replace('{{items}}', $manifestorg, $imsmanifest);
	$manifest = str_replace('{{coursename}}', xmlstr($coursename), $manifest);
	$manifest = str_replace('{{resources}}', implode("\n",$manifestres), $manifest);
	file_put_contents($newdir.'/imsmanifest.xml', $manifest);
	
	// increase script timeout value
	ini_set('max_execution_time', 300);

	if (file_exists($path.'/BBEXPORT'.$cid.'.zip')) {
		unlink($path.'/BBEXPORT'.$cid.'.zip');	
	}
	// create object
	$zip = new ZipArchive();

	// open archive
	if ($zip->open($path.'/BBEXPORT'.$cid.'.zip', ZIPARCHIVE::CREATE) !== TRUE) {
	    die ("Could not open archive");
	}

	
	function addFolderToZip($dir, $zipArchive, $zipdir = ''){
	    if (is_dir($dir)) {
		if ($dh = opendir($dir)) {

		    //Add the directory
		    if(!empty($zipdir)) $zipArchive->addEmptyDir($zipdir);

		    // Loop through all the files
		    while (($file = readdir($dh)) !== false) {

			//If it's a folder, run the function again!
			if(!is_file($dir . $file)){
			    // Skip parent and root directories
			    if( ($file !== ".") && ($file !== "..")){
				addFolderToZip($dir . $file . "/", $zipArchive, $zipdir . $file . "/");
			    }

			}else{
			    // Add the files
			    $zipArchive->addFile($dir . $file, $zipdir . $file);

			}
		    }
		}
	    }
	}
	addFolderToZip($newdir.'/',$zip);

	// close and save archive
	$zip->close();

	function rrmdir($path) {
	  if (is_file($path) || is_link($path)) {
	    unlink($path);
	  }
	  elseif (is_dir($path)) {
	    if ($d = opendir($path)) {
	      while (($entry = readdir($d)) !== false) {
		if ($entry == '.' || $entry == '..') continue;
		$entry_path = $path .DIRECTORY_SEPARATOR. $entry;
		rrmdir($entry_path);
	      }
	      closedir($d);
	    }
	    rmdir($path);
	  }
	 }

	rrmdir($newdir);
	
	$archive_file_name = 'BBEXPORT'.$cid.'.zip';
	header("Content-type: application/zip"); 
	header("Content-Disposition: attachment; filename=$archive_file_name");
	header("Content-length: " . filesize($path.'/'.$archive_file_name));
	header("Pragma: no-cache"); 
	header("Expires: 0"); 
	readfile($path.'/'.$archive_file_name);
	unlink($path.'/'.$archive_file_name);
	exit;
} else {
	$pagetitle = "BB Export";
	$placeinhead = '<script type="text/javascript">
	 function updatewhichsel(el) {
	   if (el.value=="select") { $("#itemselectwrap").show();}
	   else {$("#itemselectwrap").hide()};
	 }
	 </script>';
	$placeinhead .= '<style type="text/css">
	 .nomark.canvasoptlist li { text-indent: -25px; margin-left: 25px;}
	 </style>';
	require("../header.php");
	echo "<div class=breadcrumb>$breadcrumbbase <a href=\"../course/course.php?cid=$cid\">"
		. Sanitize::encodeStringForDisplay($coursename) . "</a> &gt; BlackBoard Export</div>\n";
	
	echo '<div class="cpmid">';
	if (!isset($CFG['GEN']['noimathasexportfornonadmins']) || $myrights>=75) {
		echo '<a href="exportitems2.php?cid='.$cid.'">Export for another IMathAS system or as a backup for this system</a> | ';
	}
	echo '<a href="ccexport.php?cid='.$cid.'">Export for another LMS</a> | ';
	echo '<a href="jsonexport.php?cid='. $cid.'" name="button">Export OEA JSON</a>';
	echo '</div>';
	
	
	$stm = $DBH->prepare("SELECT itemorder,dates_by_lti,ltisecret FROM imas_courses WHERE id=:id");
	$stm->execute(array(':id'=>$cid));
	list($items, $datesbylti, $ltisecret) = $stm->fetch(PDO::FETCH_NUM);
	$items = unserialize($items);

	$ids = array();
	$types = array();
	$names = array();
	$sums = array();
	$parents = array();
	$agbcats = array();
	$prespace = array();
	$itemshowdata = loadItemShowData($items,false,true,false,false,false,true);
	getsubinfo($items,'0','',false,'|- ');
	
	$stm = $DBH->prepare("SELECT id FROM imas_users WHERE (rights=11 OR rights=76 OR rights=77) AND groupid=?");
	$stm->execute(array($groupid));
	$hasGroupLTI = ($stm->fetchColumn() !== false);
	if ($hasGroupLTI) {
		$groupLTInote = '<p>It looks like your school may already have a school-wide LTI key and secret established - check with your LMS admin. ';
		$groupLTInote .= 'If so, you will not need to set up a course-level configuration. ';
		$groupLTInote .= 'If you do need to set up a course-level configuration, you will need this information:</p>';
	} else {
		$groupLTInote = '<p>Your school does not appear to have a school-wide LTI key and secret established. ';
		$groupLTInote .= 'To set up a course-level configuration, you will need this information:</p>';
	}
	$keyInfo = '<li>Key: LTIkey_'.$cid.'_1</li>';
	$keyInfo .= '<li>Secret: ';
	if ($ltisecret=='') {
		$keyInfo .= 'You have not yet set up an LTI secret for your course.  To do so, visit the ';
		$keyInfo .= '<a href="forms.php?action=modify&id='.$cid.'&cid='.$cid.'">Course Settings</a> page.';
	} else {
		$keyInfo .= Sanitize::encodeStringForDisplay($ltisecret);
	}
	$keyInfo .= '</li>';


	echo '<h2>Blackboard Export</h2>';
	echo '<p>This feature will allow you to export a BlackBoard package of your course course, which can ';
	echo 'then be imported into a BlackBoard LMS.</p>';
	if ($urlmode == 'http://') {
		echo '<p>WARNING:  It appears you are accessing this site using an insecure http connection.  Be aware that ';
		echo 'LTI integration with BlackBoard will not work properly with an http connection.  Use https instead.</p>';
	}
	if ($enablebasiclti==false) {
		echo '<p class="noticetext">Note: Your system does not currenltly have LTI enabled.  Contact your system administrator</p>';
	}
	echo '<form id="qform" method="post" action="bbexport.php?cid='.$cid.'&create=true" class="nolimit">';
	?>
	<input type="hidden" name="whichitems" value="select"/>
	<p>Items to export: <select name="whichitems" onchange="updatewhichsel(this)">
		<option value="all">Export entire course</option>
		<option value="select">Select individual items to export</option>
		</select>
		<div id="itemselectwrap" style="display:none;">

		Check: <a href="#" onclick="return chkAllNone('qform','checked[]',true)">All</a> <a href="#" onclick="return chkAllNone('qform','checked[]',false)">None</a>

		<table cellpadding=5 class=gb>
		<thead>
			<tr><th></th><th>Type</th><th>Title</th></tr>
		</thead>
		<tbody>
<?php
	$alt=0;
	for ($i = 0 ; $i<(count($ids)); $i++) {
		if ($alt==0) {echo "			<tr class=even>"; $alt=1;} else {echo "			<tr class=odd>"; $alt=0;}
?>
				<td>
				<input type=checkbox name='checked[]' value='<?php echo Sanitize::encodeStringForDisplay($ids[$i]); ?>'>
				</td>
				<td><?php echo Sanitize::encodeStringForDisplay($prespace[$i].$types[$i]); ?></td>
				<td><?php echo Sanitize::encodeStringForDisplay($names[$i]); ?></td>
			</tr>
<?php
	}
?>
		</tbody>
		</table>
	</div>
	<?php
	//echo "<p><button type=\"submit\" name=\"type\" value=\"custom\">Create CC Export with LTI placements as custom fields (works in BlackBoard)</button></p>";
	echo "<p><button type=\"submit\">Download BlackBoard package</button></p>";
	echo '<p><a href="../help.php?section=ltibb" target="_blank">BlackBoard Setup Instructions</a></p>';
	echo $groupLTInote;
	echo '<ul>'.$keyInfo.'</ul>';
	require("../footer.php");
}


?>
