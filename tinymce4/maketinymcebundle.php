<?php
/**
 * tinymce.gzip.php
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 *
 * Tweaked to bundle as a util
 */
require("../validate.php");
if ($myrights<100) {exit;}

$tinyMCECompressor = new TinyMCE_Compressor(array());
$tinyMCECompressor->bundle();


/**
 * This class combines and compresses the TinyMCE core, plugins, themes and
 * language packs into one disk cached gzipped request. It improves the loading speed of TinyMCE dramatically but
 * still provides dynamic initialization.
 *

 */
class TinyMCE_Compressor {
	private $files, $settings;
	private static $defaultSettings = array(
		"plugins"    => "advlist,attach,image,charmap,anchor,searchreplace,code,link,textcolor,media,table,paste,asciimath,asciisvg,rollups",
		"themes"     => "modern",
		"languages"  => "",
		"disk_cache" => false,
		"expires"    => "30d",
		"cache_dir"  => "",
		"compress"   => true,
		"files"      => "",
		"source"     => true,
	);

	/**
	 * Constructs a new compressor instance.
	 *
	 * @param Array $settings Name/value array with non-default settings for the compressor instance.
	 */
	public function __construct($settings = array()) {
		$this->settings = array_merge(self::$defaultSettings, $settings);

		if (empty($this->settings["cache_dir"])) {
			$this->settings["cache_dir"] = dirname(__FILE__);
		}
	}

	/**
	 * Adds a file to the concatenation/compression process.
	 *
	 * @param String $path Path to the file to include in the compressed package/output.
	 */
	public function &addFile($file) {
		$this->files .= ($this->files ? "," : "") . $file;

		return $this;
	}

	/**
	 * Handles the incoming HTTP request and sends back a compressed script depending on settings and client support.
	 */
	public function bundle() {
		$files = array();
		
		$tinymceDir = dirname(__FILE__);

		$plugins = preg_split('/,/', $this->settings["plugins"], -1, PREG_SPLIT_NO_EMPTY);

		$themes = preg_split('/,/', $this->settings["themes"], -1, PREG_SPLIT_NO_EMPTY);

		$languages = preg_split('/,/', $this->settings["languages"], -1, PREG_SPLIT_NO_EMPTY);

		// Add core js
		$files[] = "tinymce";

		// Add core languages
		foreach ($languages as $language) {
			$files[] = "langs/" . $language;
		}

		// Add plugins
		foreach ($plugins as $plugin) {
			$files[] = "plugins/" . $plugin . "/plugin";

			foreach ($languages as $language) {
				$files[] = "plugins/" . $plugin . "/langs/" . $language;
			}
		}

		// Add themes
		foreach ($themes as $theme) {
			$files[] = "themes/" . $theme . "/theme";

			foreach ($languages as $language) {
				$files[] = "themes/" . $theme . "/langs/" . $language;
			}
		}

		// Add any specified files.
		$allFiles = array_merge($files, preg_split('/,/', $this->settings['files'], -1, PREG_SPLIT_NO_EMPTY));

		// Process source files
		for ($i = 0; $i < count($allFiles); $i++) {
			$file = $allFiles[$i];

			if ($this->settings["source"] && file_exists($file . ".js")) {
				$file .= ".js";
			} else if (file_exists($file . ".min.js"))  {
				$file .= ".min.js";
			} else {
				$file = "";
			}

			$allFiles[$i] = $file;
		}

		// Set base URL for where tinymce is loaded from
		//$buffer = "var tinyMCEPreInit={base:'" . dirname($_SERVER["SCRIPT_NAME"]) . "',suffix:'.min'};";

		// Load all tinymce script files into buffer
		foreach ($allFiles as $file) {
			if ($file) {
				$fileContents = $this->getFileContents($tinymceDir . "/" . $file);
//				$buffer .= "\n//-FILE-$tinymceDir/$file (". strlen($fileContents) . " bytes)\n";
				$buffer .= $fileContents;
			}
		}

		// Mark all themes, plugins and languages as done
		$buffer .= 'tinymce.each("' . implode(',', $files) . '".split(","),function(f){tinymce.ScriptLoader.markDone(tinyMCE.baseURL+"/"+f+".js");});';

		// Stream contents to client
		file_put_contents("tinymce_bundled.js", $buffer);
	}
	
	/**
	 * Returns the contents of the script file if it exists and removes the UTF-8 BOM header if it exists.
	 *
	 * @param String $file File to load.
	 * @return String File contents or empty string if it doesn't exist.
	 */
	private function getFileContents($file) {
		$content = file_get_contents($file);

		// Remove UTF-8 BOM
		if (substr($content, 0, 3) === pack("CCC", 0xef, 0xbb, 0xbf)) {
			$content = substr($content, 3);
		}

		return $content;
	}
}
?>