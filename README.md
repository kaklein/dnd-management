# DND Management
A web application for Dungeons & Dragons players to manage their character as an upgrade (or supplement) to the classic pencil and paper character sheet.

## Features
* User authentication using Firebase Auth (sign up, verify email, log in, reset password).
* Create, select, and view, and edit multiple characters. Each user only has access to the character(s) they've created.
* Automatic calculation of any stats possible so players who don't want to do much math can stay focused on the game.
* Support for a variety of complex scenarios including spellcasting, tracking abilities with limited uses, summoning creatures, and more.

## Pages
* <b>Overview</b> page with the character's basic info.
* <b>Add Items</b> page where users can add new items, spells, weapons, etc.
* <b>Ability Scores</b> page with the character's ability scores, proficiencies, and some miscellaneous stats which can be edited.
* <b>Tracker</b> page to display HP, spell slots, limited-use features, and more. Easy to make frequent updates as needed during a session so users never lose track of what they have available to them.
* <b>Details</b> page with the full descriptions of all items and abilities for easy reference, which can be edited or deleted.

## Planned Updates
* Tags for spells and features to easily identify attributes such as "Reaction" or "Concentration"
* Caching and performance improvements
* Error logging with Sentry for improved support capabilities

## Technology
* TypeScript
* React/HTML
* CSS/Bootstrap
* Firebase Hosting
* Firebase Auth
* Firestore database

## Why
I created this project as a way to teach myself React.
After starting my first actual D&D campaign (as opposed to playing hours of Baldur's Gate 3 by myself),
I quickly realized I needed a better way to track my resources, character info, and notes about the campaign beyond
scribbling on a paper character sheet.
I decided it's the perfect excuse to do some web development and learn React, as a change of pace from the primarily back-end work I do professionally.

