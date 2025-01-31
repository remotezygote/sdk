# @whereby.com/browser-sdk

## 3.0.3

### Patch Changes

- @whereby.com/core@0.16.2

## 3.0.2

### Patch Changes

- @whereby.com/core@0.16.1

## 3.0.1

### Patch Changes

- 465cf49: Fix small grid UI bugs

## 3.0.0

### Major Changes

- 869695f: - Introduce Provider to the Whereby browser-sdk
  - This is added so that we can have a shared state between all components and hooks
  - All usage of the library needs to be wrapped in a Provider.
- 6d30526: Breaking change: require call to joinRoom() before joining a room session

### Minor Changes

- a442c75: Add spotlight functionality
- 9e19728: Rebase beta version on latest main
- 4e48abd: Add video grid component
- 9171216: Improve grid component
- af71f4e: Add a notifications system to core and expose notifications in the useRoomConnection hook

### Patch Changes

- Updated dependencies [a442c75]
- Updated dependencies [4e48abd]
- Updated dependencies [9171216]
- Updated dependencies [869695f]
- Updated dependencies [af71f4e]
  - @whereby.com/core@0.16.0

## 2.13.0

### Minor Changes

- 12a5471: Add support for leave meeting command

## 2.12.3

### Patch Changes

- Updated dependencies [50ce696]
  - @whereby.com/core@0.15.2

## 2.12.2

### Patch Changes

- 5cf454d: Delay resetting the store state until the next joinRoom() API request is called
- Updated dependencies [5cf454d]
  - @whereby.com/core@0.15.1

## 2.12.1

### Patch Changes

- Updated dependencies [ef26bd0]
  - @whereby.com/core@0.15.0

## 2.12.0

### Minor Changes

- 7256e58: organize bool attributes. Add support for topToolbar, toolbarDarkText, cameraEffect, and localization as attributes
- 4a7bd59: Add `endMeeting()` command on embed element

## 2.11.0

### Minor Changes

- 324b52b: Add actions to join and leave Whereby rooms on-demand
- b857c2b: Add stayBehind parameter to endMeeting host room action

### Patch Changes

- Updated dependencies [324b52b]
- Updated dependencies [b857c2b]
  - @whereby.com/core@0.14.0

## 2.10.1

### Patch Changes

- @whereby.com/core@0.13.1

## 2.10.0

### Minor Changes

- 0092158: Add support for meeting_end event on embed element

## 2.9.0

### Minor Changes

- 35dbed6: enable toggling low data mode
- 7fcc0d9: Allow room hosts to kick clients and end the meeting

### Patch Changes

- Updated dependencies [35dbed6]
- Updated dependencies [b31e2f2]
- Updated dependencies [7fcc0d9]
  - @whereby.com/core@0.13.0

## 2.8.1

### Patch Changes

- 6b5dcc9: Add precall check events to whereby embed element events map

## 2.8.0

### Minor Changes

- 8a75b16: Add action to mute participants

### Patch Changes

- Updated dependencies [8a75b16]
  - @whereby.com/core@0.11.0

## 2.7.0-beta.0

### Minor Changes

- 9e19728: Rebase beta version on latest main

## 2.7.0

### Minor Changes

- d75644f: Add roomKey-based authorization and allow room hosts to lock/unlock rooms

### Patch Changes

- Updated dependencies [d75644f]
  - @whereby.com/core@0.10.0

## 2.6.1

### Patch Changes

- dd39593: Provide correct value for `userAgent` when connecting using `browser-sdk`.
- Updated dependencies [6fc07f5]
- Updated dependencies [300f6ac]
  - @whereby.com/core@0.9.0

## 2.6.0

### Minor Changes

- 10df15f: Added attributes for aec, agc, audioDenoiser, and autoHideSelfView

## 2.5.0

### Minor Changes

- fcab2c7: added attributes for roomIntegrations, precallCeremonyCanSkip, and precallPermissionsHelpLink

## 2.4.0

### Minor Changes

- 37e17fd: Add attributes for timer, skipMediaPermissionPrompt, precallCeremony, bottomToolbar, and autoSpotlight

## 2.3.0

### Minor Changes

- 41a9cc2: core: Return client claim when joining a room

### Patch Changes

- Updated dependencies [41a9cc2]
  - @whereby.com/core@0.6.0

## 2.2.2

### Patch Changes

- 1084a44: Listen for client_kicked events and update room ConnectionStatus accordingly
- Updated dependencies [1084a44]
  - @whereby.com/core@0.3.0

## 2.2.1

### Patch Changes

- 4eb75f8: Adds people_toggle to example docs

## 2.2.0

### Minor Changes

- a604e63: Fix RTC stats bug
- 9e8bb39: Update repo field in package.json to point to this repository.

### Patch Changes

- a6972da: Update jslib-media to get rid of private devDependencies. Fixes issue preventing
  customers installing our packages when devDependencies are included.
- fd6c24f: Fix issue which kept camera light on after disabling video
- Updated dependencies [d983b09]
- Updated dependencies [a6972da]
  - @whereby.com/core@0.2.0

## 2.1.0

### Minor Changes

- 9b210c6: Add more types to `<whereby-embed>` web component
- 9b210c6: Add CDN build of react functionality

### Patch Changes

- 9b210c6: Add media-capture to allow permissions on embed element
