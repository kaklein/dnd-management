# DND Management

## Why
I created this project as a way to teach myself React.
After starting my first actual D&D campaign (as opposed to playing hours of Baldur's Gate 3 by myself),
I quickly realized I needed a better way to track my resources, character info, and notes about the campaign beyond
scribbling on a paper character sheet.
I decided it's the perfect excuse to do some web development and learn React, as a change of pace from the primarily back-end work I do professionally.

## Features
* User authentication using Firebase Auth (sign up, verify email, log in, reset password).
* Create, select, and view multiple characters. Each user only has access to the character(s) they've created.
* Automatic calculation of any stats possible. For example, the proficiency bonus and number of hit dice are directly determined by the character's level. Users never have to enter these fields; they just get automatically populated and updated based on the level.

## Pages
* <b>Overview</b> page with the character's basic info.
* <b>Stats</b> page with the character's ability scores, proficiencies, and some miscellaneous stats. Ability scores and proficiencies can be edited.
* <b>Tracker</b> page to display HP, spell slots, and any limited-use items. Easy to make frequent updates as needed during a session so users never lose track of what they have available to them.
* <b>Details</b> page with the full descriptions of all items and abilities for easy reference.
All items can be deleted or edited.
* <b>Update</b> page where users can update character details or add new items, spells, weapons, etc.


## Planned Updates
* Add a notes page for important notes taken during sessions
* Allow deletion of characters
* Improve form input validation

## Technology
* TypeScript
* React/HTML
* CSS/Bootstrap
* Firebase Hosting
* Firebase Auth
* Firestore database
