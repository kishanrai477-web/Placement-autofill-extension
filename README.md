Placement Autofill — Chrome Extension
<img width="790" height="506" alt="image" src="https://github.com/user-attachments/assets/f1f9ed5f-68fe-4482-b2ef-f27aec1139d8" />


A lightweight browser extension that eliminates repetitive form-filling during job and internship application season.

Overview

Job and internship applications during placement season demand the same personal details — name, email, phone, resume links, education history — be typed into dozens of forms across job portals and Google Forms.

Placement Autofill removes that friction. Enter your details once through a simple popup interface, and the extension detects and populates matching input fields across supported platforms, cutting application time from minutes to seconds.


Key Features

FeatureDescriptionIntelligent AutofillDetects form fields via label text, placeholder, and input attributes, then maps them to stored user dataCentralized Data ManagementAdd, edit, and persist personal/academic details through the popup UICross-Platform SupportWorks across Google Forms and common job portal layoutsOne-Click WorkflowA single "Autofill" action fills an entire formMinimal FootprintPure vanilla JS with no external runtime dependencies — fast load, low memory usage


Tech Stack


JavaScript (Vanilla) — core logic, DOM traversal, and field-matching
HTML5 — popup interface markup
CSS3 — popup styling and layout
Chrome Extension APIs (chrome.storage, chrome.scripting, chrome.runtime) — browser integration and persistence



Architecture

The extension follows Chrome's standard Manifest V3 architecture, separating concerns across background, content, and UI layers.

+-----------------------------------------------------------------+
|                        popup.html/js                            |
|              (User Interface — data entry layer)                |
|                                                                   |
|   - Collects and validates user profile fields                  |
|   - Reads/writes data via chrome.storage.local                  |
|   - Sends "AUTOFILL_TRIGGER" message on user action              |
+-----------------------------+-------------------------------------+
                              | chrome.runtime messaging
                              v
+-----------------------------------------------------------------+
|                        content.js                                |
|           (Injected into the active job/form page)               |
|                                                                   |
|   - Scans DOM for <input>, <textarea>, <select> elements          |
|   - Matches fields using label/placeholder/name heuristics        |
|   - Dispatches native input/change events for form validation     |
+-----------------------------+-------------------------------------+
                              |
                              v
+-----------------------------------------------------------------+
|                       manifest.json                              |
|        Declares permissions, content scripts, and the             |
|        extension's entry points to the browser runtime             |
+-----------------------------------------------------------------+

Project Structure

placement-autofill-extension/
├── manifest.json      # Extension configuration, permissions, entry points
├── content.js         # DOM scanning + autofill execution logic
├── popup.html         # Popup UI markup
├── popup.js           # UI event handling, storage read/write
├── style.css          # Popup styling
├── icon.png           # Extension icon
└── assets/            # Screenshots and demo media

Data Flow


User opens the popup and enters/updates their profile details.
popup.js persists this data to chrome.storage.local.
On clicking Autofill, the popup sends a message to content.js running on the active tab.
content.js scans the page's DOM, identifies matching fields, and programmatically fills them — dispatching the correct events so the host page (and its own validation logic) recognizes the input as genuine.



Installation & Setup

Load as an Unpacked Extension


Open Chrome and navigate to chrome://extensions/
Enable Developer Mode (toggle, top-right)
Click Load Unpacked
Select the project's root folder


Usage


Navigate to a job application form or Google Form
Click the extension icon in the toolbar
Enter (or confirm previously saved) personal details
Click Autofill
Matching fields are populated automatically — review before submitting


Roadmap


 AI-based intelligent field detection for non-standard form layouts
 Resume parsing to auto-populate the profile from an uploaded PDF/DOCX
 Adaptive autofill that learns from user corrections over time
 Expanded platform support beyond Google Forms
 Encrypted local storage for sensitive profile data



Use Case

Built for students and early-career professionals navigating placement season, where the same details are re-entered across dozens of applications. Placement Autofill turns a repetitive, error-prone task into a one-click action.

Impact


Reduces repetitive manual data entry across applications
Shortens time-to-submit during high-volume application periods
Lowers the chance of transcription errors from manual re-entry



Contributing

Contributions are welcome. To propose a change:


Fork the repository
Create a feature branch (git checkout -b feature/your-feature)
Commit your changes with clear messages
Open a pull request describing the change and motivation



Author

Kishan Rai
GitHub: kishanrai477-web

License

This project is licensed under the MIT License.

Support

If this project saves you time, consider giving it a star on GitHub — it helps others discover it.
