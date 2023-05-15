<?php
    // This is the page loaded in the popup window when inserting kaltura media
    // from Tiny editor.
    // This is a modified copy from the homonimous file in original kalturamedia
    // plugin for atto.

    require_once(dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))).'/config.php');
    require_login();
    global $PAGE;
    $PAGE->set_url('/lib/editor/tiny/plugins/kalturamedia/ltibrowse_container.php');
    $PAGE->set_context(context_system::instance());
    $PAGE->set_pagelayout('embedded');
    echo $OUTPUT->header();
    $requestQueryString = isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : "";
    parse_str($requestQueryString, $params);
    $ltibrowseUrl = new moodle_url('ltibrowse.php', $params);
    $iframeurl = $ltibrowseUrl->out();
?>

<form id="insert_media_data">
    <input type="hidden" id="entry_id" />
    <input type="hidden" id="source" />
    <input type="hidden" id="kafuri" />
    <input type="hidden" id="video_title" />
    <input type="hidden" id="uiconf_id" />
    <input type="hidden" id="widescreen" />
    <input type="hidden" id="height" />
    <input type="hidden" id="width" />
    <input type="hidden" id="lti_launch_context_id" />
</form>

<script type="text/javascript">
    // This global function is called from module local kaltura after selecting
    // the content to insert.
    function insertMedia() {
        // Get data from hidden inputs.
        var elements = document.getElementById("insert_media_data").elements;
        var data = {};
        for (var i = 0; i < elements.length; i++) {
            var item = elements.item(i);
            data[item.id] = item.value;
        }
        // Call global insert function from main window
        window.opener.tiny_kalturamedia_insert_media(data);
        window.close();
    }
</script>

<iframe allow="autoplay *; fullscreen *; encrypted-media *; camera *; microphone *;" id="kafIframe" src="<?php echo $iframeurl ?>" width="100%" height="600" style="border: 0;" allowfullscreen>
</iframe>
