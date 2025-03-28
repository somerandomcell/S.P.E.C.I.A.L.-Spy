<p align="center">
</p>

<h1 align="center">☢️ V.A.L.I.S. ☢️</h1>
<h3 align="center">Vault-Tec Advanced Link Investigation System</h3>

<p align="center">
  <em>Your Personal Pip-Boy for Navigating the Digital Wasteland of Information.</em>
  <br><br>
  <a href="https://github.com/SonfireUwU/V.A.L.I.S"><strong>Explore the docs »</strong></a> <!-- Link to repo -->
  <br><br>
  <a href="https://github.com/SonfireUwU/V.A.L.I.S/issues">Report Bug</a>
  ·
  <a href="https://github.com/SonfireUwU/V.A.L.I.S/issues">Request Feature</a>
</p>

<!-- Optional Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Maintained%3F-Yes-green.svg" alt="Maintenance">
  <img src="https://img.shields.io/github/stars/SonfireUwU/V.A.L.I.S?style=social" alt="GitHub stars"> <!-- Update user/repo -->
</p>

---

## 🚀 About V.A.L.I.S.

Welcome, Overseer! V.A.L.I.S. isn't just another OSINT tool; it's an **experience**. Step into a Fallout-themed, browser-based visualization environment designed for mapping connections in the digital world. Inspired by graph platforms like Maltego, V.A.L.I.S. offers a unique, retro-futuristic interface reminiscent of Vault-Tec terminals or your trusty Pip-Boy.

🔗 Visually connect the dots between domains, IPs, emails, usernames, social profiles, and more. Discover hidden relationships and build a clearer picture of your investigation, all within a highly stylized, immersive interface.

💡 Built purely with **HTML, CSS, and Vanilla JavaScript**, V.A.L.I.S. runs entirely **client-side** in your browser – no installations, no backend required. Just pure, retro-futuristic investigation power.
[
![V.A.L.I.S. Screenshot](https://github.com/SonfireUwU/V.A.L.I.S/raw/main/assets/ScreenShot.png)


*(Click image to enlarge - Replace with your best screenshot/GIF!)*

---

## ✨ Key Features

*   **🎨 Immersive Fallout Theme:** Authentic retro-futuristic aesthetic with CRT scanlines, monochrome glow, pixel fonts, thematic icons, and UI elements inspired by the Fallout universe.
*   **🖱️ Intuitive Graph Interface:**
    *   Drag & Drop entities from the toolbox.
    *   Manually arrange nodes for a clear visual representation.
    *   `Shift + Drag` between nodes for quick manual linking.
*   **🔗 Rich Entity Support:** Track diverse data points:
    *   `🌐 Domain` `💻 IP Address` `👤 Username` `✉️ Email` `#️⃣ Hash`
    *   `🔗 URL` `📞 Phone` `🧑 Person` `🏢 Organization` `📍 Location`
    *   `🐦 Twitter` `⌨️ Github` `👽 Reddit` `📸 Instagram` `💼 LinkedIn`
*   **⚙️ Contextual Transforms (Client-Side):** Right-click nodes for actions:
    *   **Lookups:** Geo/ISP data for IPs (`ip-api.com`).
    *   **External Links:** Generate links to services like VirusTotal, Wayback Machine, crt.sh, HIBP, WhatsMyName, Google Search/Maps, and direct social media profiles.
    *   **Extractions:** Pull Domains from Emails/URLs automatically.
*   **🧠 Smart Connect:** Click the ✨ button to let V.A.L.I.S. automatically find and draw potential connections between existing nodes based on predefined rules (e.g., Email↔Domain, Username↔Profile).
*   **💾 Save / 📂 Load:** Don't lose your progress! Save your entire investigation graph (nodes, connections, positions) to a local JSON file and load it back anytime.
*   **⌨️ Integrated Terminal:** A Fallout-style terminal for direct input:
    *   Set values for newly created entities.
    *   Execute simple commands (`add`, `connect`, `help`).

---

## 🛠️ Tech Stack

Built with the fundamentals – lean, mean, and runs anywhere:

*   ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
*   ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
*   ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) (ES6+ Vanilla)

---

## ⚙️ Getting Started

Getting V.A.L.I.S. operational is as easy as finding a Nuka-Cola in the wasteland:

1.  **Download:** Clone or download the repository files (`index.html`, `style.css`, `script.js`).
    ```bash
    git clone https://github.com/SonfireUwU/V.A.L.I.S.git
    cd V.A.L.I.S
    ```
    *(Or download the ZIP)*
2.  **Locate:** Ensure all three files (`index.html`, `style.css`, `script.js`) are in the same folder.
3.  **Launch:** Open the `index.html` file in your favorite modern web browser (Chrome, Firefox, Edge recommended).
4.  **Initiate:** Click the glowing **START** button. Welcome to V.A.L.I.S.!

### Basic Usage Flow:

1.  **Drag** an entity (e.g., `Domain`) from the left panel onto the graph.
2.  The node appears, highlighted, and the **Terminal** focuses.
3.  **Type** the entity's value (e.g., `example.com`) into the terminal and press `Enter`.
4.  **Arrange** nodes by dragging them.
5.  **Right-click** a node to access the context menu and run **Transforms** (like "Lookup IP Address"). New related nodes may appear.
6.  **Manually Connect** nodes using `Shift + Drag`.
7.  Use **Smart Connect** (✨) to find automatic links.
8.  **Save** (💾) your graph frequently! **Load** (📂) previous sessions.

---

## 🕹️ Core Mechanics Explained

*(This section retains the detailed explanations from the previous version for clarity)*

*   **⌨️ Terminal Input:** Input values for highlighted `needs-input` nodes or run commands (`add <type> <value>`, `connect <id1> <id2>`, `help`).
*   **↔️ Manual Connection:** `Shift + Click + Drag` from source node to target node. Release on target to connect.
*   **✨ Smart Connect:** Analyzes existing nodes for relationships (Email↔Domain, URL↔Domain, Username↔Profile, etc.) and draws missing links.
*   **💾 Save / 📂 Load:** Saves/loads graph state (nodes, connections, positions, next ID) as a `.json` file locally.

---

## ⚠️ Limitations & Disclaimer

*   **Browser-Based:** Operates entirely within your browser's sandbox. No server-side capabilities.
*   **API Dependency:** Relies on public APIs (e.g., `ip-api.com`) that might have limitations or change. Many "transforms" link externally due to CORS.
*   **Manual Layout:** Graph layout is manual. "Smart Connect" adds links, not rearranges nodes.
*   **Performance:** Very large graphs (> hundreds of nodes/edges) might experience slowdowns.
*   **Basic Links:** Connection lines are straight and may overlap.
*   **No Pan/Zoom:** Graph area has fixed boundaries.
*   **⚠️ Ethical Use:** V.A.L.I.S. is for educational and legitimate OSINT purposes *only*. Always act ethically, respect privacy, and comply with all applicable laws. Data accuracy depends on the underlying sources.

---

## 🔥 Created By

<p align="center">
  Initiated and forged in the digital fires by:
  <br>
  <strong>Sonfire</strong> 🔥
</p>

---

## 🌱 Future Enhancements

The wasteland always holds more secrets... Potential future upgrades:

*   [ ] More entity types (Malware Hash, CVE, Person Alias...)
*   [ ] Integrate more free, CORS-friendly APIs.
*   [ ] Node grouping/categorization visuals.
*   [ ] Performance tuning for larger graphs.
*   [ ] Export options (CSV, simple GraphML/GEXF).
*   [ ] Basic search/filter functionality for nodes.
*   [ ] (Stretch Goal) Limited Pan/Zoom implementation.

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements, new features, or bug fixes:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Please ensure your code maintains the vanilla JS/CSS structure and fits the overall theme.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

*(Remember to create a `LICENSE` file containing the standard MIT License text)*

---

<p align="center">Happy Investigating, Overseer!</p>
