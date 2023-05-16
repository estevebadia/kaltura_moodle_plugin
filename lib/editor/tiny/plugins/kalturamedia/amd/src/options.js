import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from './common';

// Helper variables for the option names.
const constexidName = getPluginOptionName(pluginName, 'contextid');
const enabledName = getPluginOptionName(pluginName, 'enabled');

/**
 * Options registration function.
 *
 * @param {tinyMCE} editor
 */
export const register = (editor) => {
  const registerOption = editor.options.register;

  // For each option, register it with the editor.
  // Valid type are defined in https://www.tiny.cloud/docs/tinymce/6/apis/tinymce.editoroptions/
  registerOption(constexidName, {
      processor: 'number',
  });
  registerOption(enabledName, {
    processor: 'boolean',
  });
};

/**
 * Fetch the contextid value for this editor instance.
 *
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {number} The contextid value
 */
export const contextid = (editor) => editor.options.get(constexidName);

/**
 * Fetch the enabled value.
 * @param {tinyMCE} editor The editor instance to fetch the value for
 * @returns {boolean} The enabled value
 */
export const enabled = (editor) => editor.options.get(enabledName);