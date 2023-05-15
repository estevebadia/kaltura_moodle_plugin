// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands helper for the Moodle tiny_kalturamedia plugin.
 *
 * @module      plugintype_pluginname/commands
 * @copyright   2023 SWITCH <info@switch.ch>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';
import {wwwroot} from 'core/config';
import {
    component,
    kalturamediaButtonName,
    icon,
} from './common';

import {contextid} from "./options";

// This is the same algorithm used by the original kaltura plugin to center the popup window
// specially in dual screen configurations.
const openPopup = ({url, title, w, h}) => {
    // Fixes dual-screen position                             Most browsers       Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const width = window.innerWidth ? window.innerWidth
        : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight
        : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    const newWindow = window.open(url, title,
     `scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}`
    );

    if (window.focus) {
        newWindow.focus();
    }
};

/**
 * Return the URL to be used in the "browse and embed" popup.
 * @param {number} cid The context id.
 */
const getIframeURL = (cid) => {
    return `${wwwroot}/lib/editor/tiny/plugins/kalturamedia/ltibrowse_container.php`
     + `?contextid=${cid}&height=600px&width=1112px`;
};

const buildEmbedContent = (data) => {
    // The original plugins do a transformation of the embedding URL that consists
    // of changing https to http and doing something with the query string. However
    // I don't understand the purpose of the transformation so I'm not doing it here.
    return `<a href="${data.source}">tinymce-kalturamedia-embed||${data.video_title}||${data.width}||${data.height}</a>`;
};

/**
 * Handle the button click action.
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 */
const handleAction = (editor) => {
    const cid = contextid(editor);

    // Set a global variable to be used as a callback for the popup window.
    window.tiny_kalturamedia_insert_media = (data) => {
        const content = buildEmbedContent(data);
        editor.insertContent(content);
    };

    // Open popup window.
    openPopup({
        url: getIframeURL(cid),
        title: getString("browse_and_embed", component),
        w: 1200,
        h: 700
    });

};

/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    const [
        kalturamediaButtonNameTitle,
        buttonImage,
    ] = await Promise.all([
        getString('button_kalturamedia', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the kalturamedia Toolbar Button.
        editor.ui.registry.addButton(kalturamediaButtonName, {
            icon,
            tooltip: kalturamediaButtonNameTitle,
            onAction: () => handleAction(editor),
        });
    };
};
