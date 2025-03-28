# ☢️ V.A.L.I.S. - Vault-Tec Advanced Link Investigation System 🔗💻

> Your Personal Pip-Boy for Navigating the Digital Wasteland of Information.

[![V.A.L.I.S. Screenshot](https://ibb.co/ymwtdXyq)
*(Replace above placeholder with an actual screenshot/GIF link!)*

---

## 🚀 About V.A.L.I.S.

Welcome, Overseer! V.A.L.I.S. is a Fallout-themed, browser-based OSINT (Open Source Intelligence) visualization tool inspired by graph analysis platforms like Maltego. It provides a retro-futuristic interface reminiscent of Vault-Tec terminals or the Pip-Boy, allowing you to visually map out connections between different pieces of information (entities) like domains, IPs, emails, usernames, and more.

Built entirely with **HTML, CSS, and Vanilla JavaScript**, V.A.L.I.S. runs completely client-side, offering a unique aesthetic and a range of OSINT functionalities directly in your browser.

---

## ✨ Key Features

*   **🎨 Retro Fallout Theme:** Immerse yourself in a highly stylized interface with CRT scanlines, green monochrome text, glow effects, pixel fonts, and thematic icons inspired by the Fallout universe.
*   **🖱️ Drag & Drop Graph Interface:** Visually represent your investigation by dragging entities onto the graph area and arranging them manually.
*   **🔗 Multiple Entity Types:** Investigate various data points including:
    *   🌐 Domain
    *   💻 IP Address
    *   👤 Username (Generic)
    *   ✉️ Email
    *   #️⃣ Hash
    *   🔗 URL
    *   📞 Phone Number
    *   🧑 Person
    *   🏢 Organization
    *   📍 Location
    *   🐦 Twitter Profile
    *   ⌨️ Github Profile
    *   <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: -0.125em;"><path d="M13.545 6.382c-.51-.022-1.02.002-1.521.068-.431-.606-.95-1.113-1.541-1.506a.29.29 0 0 0-.36.37c.148.405.25.831.305 1.276-.81-.287-1.675-.458-2.58-.5C7.798 5.97 7.71 5.162 7.584 4.379c-.1-.6-.58-1.04-1.17-1.08-.61-.04-1.14.36-1.25.97-.13.74-.36 1.83-.8 2.28-.62.55-1.39.91-2.24 1.15-.1.03-.17.1-.17.21 0 .09.06.17.14.2.87.35 1.61.9 2.15 1.6a8.3 8.3 0 0 0-1.6 1.43.29.29 0 0 0 .17.5.3.3 0 0 0 .38-.17c.58-.88 1.31-1.56 2.19-1.98.02.1.04.2.05.3-.03.07-.06.13-.08.2-.16.5-.3.96-.39 1.44-.1.5.33.97.84 1.01.52.04 1-.3 1.1-.81.13-.64.3-1.33.56-2.04.2-.53.44-.97.74-1.47.27.03.55.06.83.09.5.06 1 .13 1.48.22.12.84.54 1.58 1.17 2.12.09.09.22.11.34.06.13-.05.2-.18.16-.31-.1-.35-.17-.7-.22-1.05.6.15 1.17.37 1.7.64.12.05.25.02.34-.09.09-.11.1-.25.03-.37-.3-.54-.68-1-1.12-1.38.32-.09.64-.17.97-.24.04-.01.08-.01.12-.02.1-.02.18-.1.18-.2 0-.1-.09-.18-.19-.17Zm-2.4 4.708a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm-4.73-1.83a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"/></svg> Reddit Profile
    *   📸 Instagram Profile
    *   💼 LinkedIn Profile
*   **⚙️ Client-Side Transforms:** Perform actions directly from nodes (right-click context menu):
    *   IP Lookups (Geo/ISP via `ip-api.com`)
    *   Domain extractions (from Email/URL)
    *   Generate links to external services (Wayback Machine, crt.sh, VirusTotal, Social Media Profiles, Google Search/Maps, WhatsMyName, HIBP).
*   **↔️ Manual Connection:** Manually link any two nodes by holding `Shift` while dragging from one node to another.
*   **✨ Smart Connect:** Automatically discovers and draws basic connections between existing related nodes on the graph (e.g., Email ↔ Domain, URL ↔ Domain, Username ↔ Social Profile).
*   **💾 Save / 📂 Load:** Persist your investigation! Save the current graph state (nodes, values, positions, connections) to a JSON file and load it back later.
*   **⌨️ Terminal Input:** Use the integrated terminal bar at the bottom-left to set values for new nodes or execute simple commands (`add`, `connect`, `help`).

---

## 🔧 Tech Stack

*   **HTML5:** Semantic structure.
*   **CSS3:** Styling, animations (flicker, pulse, flames), layout (Flexbox).
*   **Vanilla JavaScript (ES6+):** All application logic, DOM manipulation, event handling, basic API interaction (`fetch`), SVG line drawing. No external JS libraries or frameworks.

---

## ⚙️ Setup & Usage

V.A.L.I.S. is designed for simplicity and runs entirely in your browser:

1.  **Download Files:** Get the `index.html`, `style.css`, and `script.js` files.
2.  **Place in Folder:** Put all three files into the same directory on your local machine.
3.  **Open `index.html`:** Open the `index.html` file in a modern web browser (Chrome, Firefox, Edge recommended).
4.  **Start:** Click the "START" button on the main menu.
5.  **Investigate:**
    *   Drag entities from the left panel onto the graph.
    *   Use the terminal input that appears to set the value for the new node, then press `Enter`.
    *   Drag nodes to arrange them.
    *   Right-click nodes to run transforms or perform actions.
    *   Use `Shift + Drag` between nodes to manually connect them.
    *   Use the "Smart Connect" button to find potential links.
    *   Save/Load your progress using the buttons.

---

## 🕹️ Core Mechanics Explained

*   **⌨️ Terminal Input:**
    *   When a new node is created (or when editing via context menu), it gets highlighted (`needs-input` style), and the terminal bar gains focus.
    *   Type the desired value and press `Enter` to assign it to the highlighted node.
    *   When no node is awaiting input, you can type basic commands:
        *   `add <EntityType> <Value>` (e.g., `add Domain example.com`)
        *   `connect <SourceNodeID> <TargetNodeID>` (e.g., `connect 0 1`)
        *   `help`
*   **↔️ Manual Connection:**
    *   Hold down the `Shift` key.
    *   Click and hold the left mouse button on the source node.
    *   Drag the temporary line that appears to the target node.
    *   Release the mouse button over the target node to create the connection.
*   **✨ Smart Connect:**
    *   Clicking the "Smart Connect" button iterates through all *existing* nodes on the graph.
    *   It applies predefined rules (like matching domain parts in emails/URLs, matching usernames to social profiles) to find potential relationships.
    *   If a relationship is found *and* a direct connection doesn't already exist, a line is drawn.
*   **💾 Save / 📂 Load:**
    *   **Save:** Gathers data about all nodes (ID, type, value, position, connections) and the current ID counter, bundles it into a JSON format, and triggers a download of a `.json` file.
    *   **Load:** Clears the current graph and rebuilds it from a selected `.json` file previously saved by V.A.L.I.S.

---

## ⚠️ Limitations & Disclaimer

*   **Client-Side Only:** All processing happens in your browser. No server backend.
    *   OSINT actions ("Transforms") are limited to what browsers allow (CORS restrictions on many APIs). Many actions generate links to external services rather than querying them directly.
    *   Relies on free, public APIs (like `ip-api.com`) which may have rate limits or change.
*   **No Automated Layout:** Nodes stay where you put them. "Smart Connect" only draws lines between existing nodes based on rules; it doesn't rearrange the graph layout.
*   **Performance:** Performance may degrade with a very large number of nodes and connections due to SVG rendering and vanilla JS handling.
*   **Basic Connection Drawing:** Lines are straight and may overlap. No complex edge routing.
*   **No Panning/Zooming:** The graph area is fixed within its container.
*   **Ethical Use:** This tool is intended for educational and legitimate OSINT purposes. Use responsibly and ethically. Respect privacy and legal boundaries. The accuracy of information depends on the external services linked or queried.

---

## 🔥 Created By

This tool was brought to life by **Sonfire**.

(The fiery name effect uses CSS text-shadow and animation!)

---

## 🌱 Future Ideas (Possible Enhancements)

*   More diverse entity types (Vulnerabilities, Malware Hashes, Software, etc.).
*   More complex "Transforms" (e.g., integrating more free APIs where possible).
*   Basic node grouping/clustering.
*   Improved line routing (very complex).
*   Performance optimizations for large graphs.
*   Export options (e.g., CSV, basic GraphML).
*   Graph exploration modes (e.g., neighborhood view).
*   (Ambitious) Basic panning/zooming.

---

## 📄 License

This project is likely under the **MIT License** (or choose another appropriate open-source license).

*(You should add a `LICENSE` file to your repository with the full license text)*
