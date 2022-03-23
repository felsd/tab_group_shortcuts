# Tab Group Shortcuts

This is a Chromium extension that provides some shortcuts to make working with tab groups more pleasant and efficient. Tab Groups were introduced in version 83.

>The new Tab Groups feature lets users organize tabs into small groups on the tab bar. Tab groups can be colorized, renamed, and moved around the tab bar to help users manage different workspaces together. In future versions, Google plans to let users collapse tab groups so users can save space on their tab bar for their current tabs and help users focus better.

## Installation

This extension is not published to the web store. Clone the project, head over to `chrome://extensions` -> `Load unpacked` and point to the project root directory.

Since Chromium extensions are limited to defining 4 default `commands` (shortcuts) per extension, key bindings must be set up manually at `chrome://extensions/shortcuts`.

## Features

### Only one active tab group at a time
In order to keep things organized I prefer to have only one expanded tab group at a time.

### New tab in current tab group
By default Chromium opens new tabs without a tab group via `Ctrl+T`. This shortcut provides the option to define a keybinding to open a new tab in the current tab group. I have set this shortcut up in addition to the default binding and bound it to `Ctrl+Shift+T`. It's also possible to bind it to `Ctrl+T` though and overwrite Chromium's default behaviour.

### Toggle tab groups via keybindings
I have bound these shortcuts to `Ctrl+Shift+[1-9]`. Toggling an already expanded group will collapse it and expand the group that was expanded previously.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
