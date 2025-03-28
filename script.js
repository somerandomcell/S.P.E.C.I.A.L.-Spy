// === JAVASCRIPT (v6 - Manual Connect & File Separation) ===
document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const mainMenuOverlay = document.getElementById('main-menu-overlay');
    const startButton = document.getElementById('start-button');
    const graphContainer = document.getElementById('graph-container'); // Renamed for clarity
    const graphArea = document.getElementById('graph-area');
    const toolbox = document.querySelector('.left-panel .entity-list');
    const infoContent = document.getElementById('info-content');
    const contextMenu = document.getElementById('context-menu');
    const svgCanvas = document.getElementById('connector-svg');
    const svgDefs = svgCanvas.querySelector('defs');
    const smartConnectBtn = document.getElementById('smart-connect-btn');
    const saveStateBtn = document.getElementById('save-state-btn');
    const loadStateBtn = document.getElementById('load-state-btn');
    const loadFileInput = document.getElementById('load-file-input');
    const terminalInput = document.getElementById('terminal-input');
    const terminalBar = document.getElementById('terminal-input-bar');

    // --- State Variables ---
    let nodes = []; // { id, element, type, value, x, y, connections: [targetId] }
    let nodeIdCounter = 0;
    let selectedNodeId = null;
    let draggingNode = null; // { element, id, graphOffsetX, graphOffsetY }
    let dragStartPos = null; // {x, y}
    let contextNodeId = null;
    let infoLog = [];
    const MAX_LOG_LINES = 50;
    let audioContext;
    let nodeWaitingForInput = null; // Track node expecting terminal input
    // Manual Connection State
    let isConnecting = false;
    let connectionSourceNodeData = null;
    let tempConnectionLine = null;


    // --- Entity & Action Icons ---
     const entityIcons = {
        "Domain": "🌐", "IP Address": "💻", "Username": "👤", "Email": "✉️",
        "Hash": "#️⃣", "URL": "🔗", "Phone": "📞", "Person": "🧑",
        "Organization": "🏢", "Location": "📍", "Info": "📄",
        "Twitter": "🐦", "Github": "⌨️", "Reddit": "<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' fill='currentColor' viewBox='0 0 16 16'><path d='M13.545 6.382c-.51-.022-1.02.002-1.521.068-.431-.606-.95-1.113-1.541-1.506a.29.29 0 0 0-.36.37c.148.405.25.831.305 1.276-.81-.287-1.675-.458-2.58-.5C7.798 5.97 7.71 5.162 7.584 4.379c-.1-.6-.58-1.04-1.17-1.08-.61-.04-1.14.36-1.25.97-.13.74-.36 1.83-.8 2.28-.62.55-1.39.91-2.24 1.15-.1.03-.17.1-.17.21 0 .09.06.17.14.2.87.35 1.61.9 2.15 1.6a8.3 8.3 0 0 0-1.6 1.43.29.29 0 0 0 .17.5.3.3 0 0 0 .38-.17c.58-.88 1.31-1.56 2.19-1.98.02.1.04.2.05.3-.03.07-.06.13-.08.2-.16.5-.3.96-.39 1.44-.1.5.33.97.84 1.01.52.04 1-.3 1.1-.81.13-.64.3-1.33.56-2.04.2-.53.44-.97.74-1.47.27.03.55.06.83.09.5.06 1 .13 1.48.22.12.84.54 1.58 1.17 2.12.09.09.22.11.34.06.13-.05.2-.18.16-.31-.1-.35-.17-.7-.22-1.05.6.15 1.17.37 1.7.64.12.05.25.02.34-.09.09-.11.1-.25.03-.37-.3-.54-.68-1-1.12-1.38.32-.09.64-.17.97-.24.04-.01.08-.01.12-.02.1-.02.18-.1.18-.2 0-.1-.09-.18-.19-.17Zm-2.4 4.708a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm-4.73-1.83a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z'/></svg>",
        "Instagram": "📸", "LinkedIn": "💼",
        "Default": "❓"
     };
     const actionIcons = {
        "SetValue": "✏️", "LookupIP": "💡", "LookupGeo": "🌍", "FindSubdomains": "🔍",
        "Wayback": "⏳", "SearchUser": "👥", "CheckHIBP": "🛡️", "ExtractDomain": "✂️",
        "ParseURL": "⚙️", "Delete": "🗑️", "SearchPhone": "📞", "SearchPerson": "🧑",
        "SearchOrg": "🏢", "MapLocation": "🗺️", "SearchHash": "🔍", "SmartConnect": "✨",
        "Save": "💾", "Load": "📂", "ViewProfile": "🌐", "Connect": "🔗" // Icon for manual connect if needed
     };

    // --- Sound Function ---
    function playSound(type = 'start') {
         try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
             const oscillator = audioContext.createOscillator(); const gainNode = audioContext.createGain();
             oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
             gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Default volume

             let freq = 440, duration = 0.1, wave = 'sine';
             switch(type) {
                 case 'start': freq=440; duration=0.3; wave='square'; gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); break;
                 case 'click': freq=880; duration=0.08; wave='sine'; gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); break;
                 case 'save': freq=220; duration=0.2; wave='sawtooth'; gainNode.gain.setValueAtTime(0.08, audioContext.currentTime); break;
                 case 'load': freq=330; duration=0.2; wave='triangle'; gainNode.gain.setValueAtTime(0.08, audioContext.currentTime); break;
                 case 'error': freq=110; duration=0.15; wave='square'; gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); break;
                 case 'add': freq=660; duration=0.1; wave='triangle'; gainNode.gain.setValueAtTime(0.06, audioContext.currentTime); break;
                 case 'delete': freq=165; duration=0.15; wave='square'; gainNode.gain.setValueAtTime(0.07, audioContext.currentTime); break;
                 case 'connect': freq=770; duration=0.12; wave='sine'; gainNode.gain.setValueAtTime(0.07, audioContext.currentTime); break; // Sound for connection
                 case 'snap': freq=1100; duration=0.05; wave='square'; gainNode.gain.setValueAtTime(0.04, audioContext.currentTime); break; // Sound for snap/connect attempt
             }

             oscillator.type = wave;
             oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
             gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
             oscillator.start(audioContext.currentTime);
             oscillator.stop(audioContext.currentTime + duration);

         } catch (e) { console.warn("AudioContext Error:", e); }
    }

     // --- Main Menu Logic ---
     startButton.addEventListener('click', () => {
        playSound('start');
        mainMenuOverlay.classList.add('hidden');
        logToInfoPanel("[SYSTEM ONLINE] V.A.L.I.S. v0.7 | Status: <span class='success'>Nominal</span> | Awaiting Input...", null, false);
        renderInfoPanel();
        terminalInput.focus();
     });


    // --- Node Management ---
    function createNodeElement(id, type, value, x, y) {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'graph-node';
        nodeEl.id = `node-${id}`;
        nodeEl.dataset.id = id;
        nodeEl.dataset.type = type;
        nodeEl.dataset.value = value || '';
        nodeEl.style.left = `${x}px`;
        nodeEl.style.top = `${y}px`;
        const iconHTML = entityIcons[type] || entityIcons["Default"];
        const displayValue = value || '...'; // Use '...' placeholder

        nodeEl.innerHTML = `
            <i class="node-icon">${iconHTML}</i>
            <div class="node-content">
                <span class="node-type">${type}</span>
                <span class="node-value">${displayValue}</span>
            </div>
        `;
         nodeEl.setAttribute('data-type', type);

         if (!value) {
            nodeEl.classList.add('needs-input');
         }

        nodeEl.addEventListener('mousedown', handleNodeMouseDown); // Use central handler now
        nodeEl.addEventListener('click', handleNodeClick);
        nodeEl.addEventListener('contextmenu', showContextMenu);
        graphArea.appendChild(nodeEl);
        return nodeEl;
    }

    function addNode(type, value, x, y, parentId = null, loadedId = null) {
        const id = loadedId !== null ? loadedId : nodeIdCounter++;
        const graphRect = graphArea.getBoundingClientRect();
        const clampedX = Math.max(10, Math.min(x, graphRect.width - 130));
        const clampedY = Math.max(10, Math.min(y, graphRect.height - 50));
        const element = createNodeElement(id, type, value, clampedX, clampedY);
        const newNodeData = { id, element, type, value, x: clampedX, y: clampedY, connections: [] };
        nodes.push(newNodeData);
        if (parentId !== null && parentId !== id) {
            const parentNode = findNodeData(parentId);
            if (parentNode && !parentNode.connections.includes(id)) parentNode.connections.push(id);
        }
        if (loadedId === null) {
             playSound('add'); logToInfoPanel(`⚡ Added [${type}]: ${value || '...'}`, newNodeData); selectNode(id);
             if (!value) { nodeWaitingForInput = id; terminalInput.textContent = ''; terminalInput.focus(); }
             drawLines();
        }
        if (loadedId !== null && loadedId >= nodeIdCounter) nodeIdCounter = loadedId + 1;
        return newNodeData;
    }

    function findNodeData(id) { return nodes.find(n => n.id === id); }
    function findNodeElement(id) { return document.getElementById(`node-${id}`); }

    function removeNode(id) {
        const nodeIndex = nodes.findIndex(n => n.id === id);
        if (nodeIndex > -1) {
            playSound('delete'); const nodeData = nodes[nodeIndex];
            if (nodeData.element) nodeData.element.remove();
            nodes.splice(nodeIndex, 1);
            nodes.forEach(n => { n.connections = n.connections.filter(targetId => targetId !== id); });
            if (nodeWaitingForInput === id) nodeWaitingForInput = null;
            logToInfoPanel(`🗑️ Removed node ${id} [${nodeData.type}]`);
            drawLines(); if (selectedNodeId === id) clearSelection(false);
        }
    }

    function updateNodeValue(id, newValue) {
         const nodeData = findNodeData(id); const nodeEl = findNodeElement(id);
         if (nodeData && nodeEl) {
             newValue = newValue.trim(); const oldValue = nodeData.value;
             nodeData.value = newValue; nodeEl.dataset.value = newValue;
             nodeEl.querySelector('.node-value').textContent = newValue || '...';
             nodeEl.classList.remove('needs-input');
             if (nodeWaitingForInput === id) nodeWaitingForInput = null;
             if (newValue && oldValue !== newValue) logToInfoPanel(`✏️ Updated [${nodeData.type}] ${id} to: ${newValue}`, nodeData);
             else if (!newValue) nodeEl.classList.add('needs-input');
         }
    }

    // --- Drag and Drop (Toolbox -> Graph) ---
     toolbox.addEventListener('dragstart', (e) => {
         const target = e.target.closest('.seed-entity');
         if (target) { e.dataTransfer.setData('application/json', JSON.stringify({ type: target.dataset.type })); e.dataTransfer.effectAllowed = 'copy'; }
         else { e.preventDefault(); }
     });
     graphArea.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
     graphArea.addEventListener('drop', (e) => {
        e.preventDefault();
         try {
            const data = JSON.parse(e.dataTransfer.getData('application/json')); const type = data.type;
            if (!type) return;
            const graphRect = graphArea.getBoundingClientRect(); const x = e.clientX - graphRect.left; const y = e.clientY - graphRect.top;
            addNode(type, '', x, y);
         } catch (err) { console.error("Drop error:", err); logToInfoPanel("Drop failed: Invalid data transfer.", null, true); playSound('error');}
     });

     // --- Node Interaction Handler (Drag, Manual Connect Start) ---
     function handleNodeMouseDown(e) {
         if (e.button !== 0) return; // Only left click
         const target = e.target.closest('.graph-node');
         if (!target) return;

         const nodeId = parseInt(target.dataset.id, 10);
         const nodeData = findNodeData(nodeId);
         if (!nodeData) return;

         if (e.shiftKey) {
             // --- Start Manual Connection ---
             e.preventDefault(); // Prevent browser drag behavior
             isConnecting = true;
             connectionSourceNodeData = nodeData;
             selectNode(nodeId); // Select source node
             playSound('snap');

             // Create temporary line
             const [startX, startY] = getNodeConnectionPoint(nodeData, nodeData); // Point from center
             tempConnectionLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
             tempConnectionLine.setAttribute('x1', startX);
             tempConnectionLine.setAttribute('y1', startY);
             tempConnectionLine.setAttribute('x2', startX); // Initially end at start
             tempConnectionLine.setAttribute('y2', startY);
             tempConnectionLine.classList.add('temp-connector-line');
             svgCanvas.appendChild(tempConnectionLine);

             // Add temporary listeners to document for dragging line
             document.addEventListener('mousemove', handleManualConnectionDrag);
             document.addEventListener('mouseup', handleManualConnectionEnd, { once: true });

         } else {
             // --- Start Normal Node Drag ---
             startDrag(e, target, nodeData);
         }
     }

     // --- Normal Node Drag ---
     function startDrag(e, target, nodeData) {
         e.preventDefault(); // Prevent default drag behavior if needed
         dragStartPos = { x: e.clientX, y: e.clientY };
         selectNode(nodeData.id); // Select node on drag start

         const graphRect = graphArea.getBoundingClientRect();
         draggingNode = {
             element: target,
             id: nodeData.id,
             graphOffsetX: e.clientX - graphRect.left - target.offsetLeft,
             graphOffsetY: e.clientY - graphRect.top - target.offsetTop,
         };

         target.style.cursor = 'grabbing';
         target.style.zIndex = 11;
         document.addEventListener('mousemove', dragNode);
         document.addEventListener('mouseup', endDrag, { once: true }); // Use once for cleaner removal
     }

     function dragNode(e) {
         if (!draggingNode) return;
         e.preventDefault();
         const graphRect = graphArea.getBoundingClientRect();
         let newX = e.clientX - graphRect.left - draggingNode.graphOffsetX;
         let newY = e.clientY - graphRect.top - draggingNode.graphOffsetY;
         newX = Math.max(5, Math.min(newX, graphArea.clientWidth - draggingNode.element.offsetWidth - 5));
         newY = Math.max(5, Math.min(newY, graphArea.clientHeight - draggingNode.element.offsetHeight - 5));
         draggingNode.element.style.left = `${newX}px`;
         draggingNode.element.style.top = `${newY}px`;
         drawLines(); // Redraw permanent lines during drag
     }

     function endDrag(e) {
         if (!draggingNode) return;
         document.removeEventListener('mousemove', dragNode);
         const nodeData = findNodeData(draggingNode.id);
         if (nodeData) {
             nodeData.x = parseInt(draggingNode.element.style.left, 10);
             nodeData.y = parseInt(draggingNode.element.style.top, 10);
         }
         draggingNode.element.style.cursor = 'grab';
         draggingNode.element.style.zIndex = 10;
         draggingNode = null;
         dragStartPos = null;
         drawLines(); // Final line update
     }

     // --- Manual Connection Drag ---
     function handleManualConnectionDrag(e) {
         if (!isConnecting || !tempConnectionLine) return;
         e.preventDefault();
         const svgRect = svgCanvas.getBoundingClientRect();
         const endX = e.clientX - svgRect.left;
         const endY = e.clientY - svgRect.top;
         tempConnectionLine.setAttribute('x2', endX);
         tempConnectionLine.setAttribute('y2', endY);
     }

     function handleManualConnectionEnd(e) {
         if (!isConnecting || !connectionSourceNodeData) return;
         e.preventDefault();
         playSound('snap');

         // Clean up temporary line and listeners
         if (tempConnectionLine) tempConnectionLine.remove();
         tempConnectionLine = null;
         document.removeEventListener('mousemove', handleManualConnectionDrag);
         // mouseup listener removed by { once: true }

         // Find target node
         const targetElement = document.elementFromPoint(e.clientX, e.clientY)?.closest('.graph-node');
         let connectionMade = false;
         if (targetElement) {
             const targetId = parseInt(targetElement.dataset.id, 10);
             const targetNodeData = findNodeData(targetId);
             if (targetNodeData && targetNodeData.id !== connectionSourceNodeData.id) {
                 // Add connection (A->B)
                 if (addConnectionIfNeeded(connectionSourceNodeData, targetNodeData)) {
                     logToInfoPanel(`🔗 Manually connected ${connectionSourceNodeData.id} -> ${targetId}`);
                     drawLines(); // Redraw permanent lines
                     connectionMade = true;
                     playSound('connect');
                 } else {
                     logToInfoPanel(`Connection ${connectionSourceNodeData.id} -> ${targetId} already exists.`);
                 }
             }
         }

         if (!connectionMade) {
            // logToInfoPanel("Manual connection cancelled."); // Optional: Log cancellation
         }

         // Reset state
         isConnecting = false;
         connectionSourceNodeData = null;
     }


    // --- Selection & Highlighting ---
    function selectNode(id) {
         clearSelection();
         selectedNodeId = id;
         const nodeEl = findNodeElement(id);
         if (nodeEl) {
            nodeEl.classList.add('selected');
             const nodeData = findNodeData(id);
             updateInfoPanel(nodeData);
             highlightConnections(id, true);
             if (nodeEl.classList.contains('needs-input')) {
                 nodeWaitingForInput = id;
                 terminalInput.focus();
             } else {
                 nodeWaitingForInput = null;
             }
         }
    }

    function clearSelection(clearInfo = true) {
        if (selectedNodeId !== null) {
            const prevSelected = findNodeElement(selectedNodeId);
            if (prevSelected) prevSelected.classList.remove('selected');
             highlightConnections(selectedNodeId, false);
        }
        selectedNodeId = null;
        nodeWaitingForInput = null;
    }

    function handleNodeClick(e) {
         const target = e.target.closest('.graph-node');
         if (!target || draggingNode) return;
         if (dragStartPos) { const dx = e.clientX - dragStartPos.x; const dy = e.clientY - dragStartPos.y; if (Math.sqrt(dx*dx + dy*dy) >= 5) return; }
         const id = parseInt(target.dataset.id, 10);
         if (id !== selectedNodeId) { selectNode(id); }
         else { if (findNodeElement(id)?.classList.contains('needs-input')) { nodeWaitingForInput = id; terminalInput.focus(); } }
         playSound('click');
     }

     graphArea.addEventListener('mousedown', (e) => {
         if (e.target === graphArea || e.target === svgCanvas) { clearSelection(); hideContextMenu(); }
     });

     function highlightConnections(nodeId, state) {
         const nodeData = findNodeData(nodeId);
         const marker = svgDefs.querySelector('marker#arrowhead');
         if (!nodeData || !marker) return;
         nodeData.connections.forEach(targetId => { const line = svgCanvas.querySelector(`line[data-source="${nodeId}"][data-target="${targetId}"]`); if (line) line.classList.toggle('highlighted', state); });
         nodes.forEach(sourceNode => { if (sourceNode.connections.includes(nodeId)) { const line = svgCanvas.querySelector(`line[data-source="${sourceNode.id}"][data-target="${nodeId}"]`); if (line) line.classList.toggle('highlighted', state); } });
          marker.classList.toggle('highlighted', state);
     }


    // --- Context Menu ---
    function showContextMenu(e) {
        e.preventDefault(); hideContextMenu(); const target = e.target.closest('.graph-node'); if (!target) return; contextNodeId = parseInt(target.dataset.id, 10); const nodeData = findNodeData(contextNodeId); if (!nodeData) return; selectNode(contextNodeId); const menuItems = generateContextMenuItems(nodeData); const ul = contextMenu.querySelector('ul'); ul.innerHTML = ''; if (menuItems.length === 0) return;
         menuItems.forEach(item => { const li = document.createElement('li'); if (item.separator) { li.className = 'separator'; } else { const icon = item.icon ? `<i class="menu-icon">${item.icon}</i>` : ''; li.innerHTML = `${icon}${item.label}`; if (item.action && !item.disabled) { li.addEventListener('click', () => { item.action(nodeData); hideContextMenu(); playSound('click'); }); } else { li.classList.add('disabled'); } } ul.appendChild(li); });
        const menuHeight = menuItems.length * 30 + 10; const menuWidth = 180; let top = e.clientY; let left = e.clientX; if (top + menuHeight > window.innerHeight - 10) top = window.innerHeight - menuHeight - 10; if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10; contextMenu.style.top = `${top}px`; contextMenu.style.left = `${left}px`; contextMenu.style.display = 'block';
        setTimeout(() => document.addEventListener('click', hideContextMenuOnClickOutside, { capture: true, once: true }), 0); setTimeout(() => document.addEventListener('contextmenu', hideContextMenuOnClickOutside, { capture: true, once: true }), 0);
    }
    function hideContextMenu() { contextMenu.style.display = 'none'; contextNodeId = null; document.removeEventListener('click', hideContextMenuOnClickOutside, { capture: true }); document.removeEventListener('contextmenu', hideContextMenuOnClickOutside, { capture: true }); }
    function hideContextMenuOnClickOutside(e) { if (!contextMenu.contains(e.target)) hideContextMenu(); else { setTimeout(() => document.addEventListener('click', hideContextMenuOnClickOutside, { capture: true, once: true }), 0); setTimeout(() => document.addEventListener('contextmenu', hideContextMenuOnClickOutside, { capture: true, once: true }), 0); } }

     // Context Menu Item Generation (Includes Social Media)
     function generateContextMenuItems(nodeData) {
         const { type, value } = nodeData; const items = []; const hasValue = value && value !== '...';
         items.push({ label: 'Edit Value (Terminal)', icon: actionIcons.SetValue, action: (node) => { selectNode(node.id); nodeWaitingForInput = node.id; terminalInput.focus(); node.element.classList.add('needs-input');} });
         items.push({ separator: true });
         let profileUrl = null;
         switch (type) { case 'Twitter': profileUrl = `https://twitter.com/${value}`; break; case 'Github': profileUrl = `https://github.com/${value}`; break; case 'Reddit': profileUrl = `https://www.reddit.com/user/${value}`; break; case 'Instagram': profileUrl = `https://www.instagram.com/${value}`; break; case 'LinkedIn': profileUrl = `https://www.linkedin.com/in/${value}`; break; }
         if (profileUrl) items.push({ label: `View ${type} Profile`, icon: actionIcons.ViewProfile, disabled: !hasValue, action: (node) => generateLink(node, profileUrl, `${type} Profile`) });
         if (['Username', 'Twitter', 'Github', 'Reddit', 'Instagram', 'LinkedIn'].includes(type)) items.push({ label: 'Search All Platforms', icon: actionIcons.SearchUser, disabled: !hasValue, action: transformUsernameSearch });
         switch (type) { /* Standard entity actions */
             case 'Domain': items.push({ label: 'Lookup IP Address', icon: actionIcons.LookupIP, disabled: !hasValue, action: transformDomainToIP }); items.push({ label: 'Find Subdomains', icon: actionIcons.FindSubdomains, disabled: !hasValue, action: transformDomainToSubdomainLink }); items.push({ label: 'Check Wayback', icon: actionIcons.Wayback, disabled: !hasValue, action: transformDomainToWaybackLink }); break;
             case 'IP Address': items.push({ label: 'Lookup Geo/ISP', icon: actionIcons.LookupGeo, disabled: !hasValue, action: transformIPLookup }); break;
             case 'Email': items.push({ label: 'Check HIBP (Link)', icon: actionIcons.CheckHIBP, disabled: !hasValue, action: transformEmailCheckHIBP }); items.push({ label: 'Extract Domain', icon: actionIcons.ExtractDomain, disabled: !hasValue, action: transformEmailToDomain }); break;
             case 'URL': items.push({ label: 'Parse URL Components', icon: actionIcons.ParseURL, disabled: !hasValue, action: transformURLParse }); items.push({ label: 'Extract Domain', icon: actionIcons.ExtractDomain, disabled: !hasValue, action: transformURLToDomain }); break;
             case 'Hash': items.push({ label: 'Search VirusTotal', icon: actionIcons.SearchHash, disabled: !hasValue, action: (node) => generateLink(node, `https://www.virustotal.com/gui/search/${encodeURIComponent(node.value)}`, "VirusTotal Search") }); break;
             case 'Phone': items.push({ label: 'Reverse Lookup (Link)', icon: actionIcons.SearchPhone, disabled: !hasValue, action: (node) => generateLink(node, `https://www.google.com/search?q=${encodeURIComponent(node.value)}`, "Phone Search") }); break;
             case 'Person': items.push({ label: 'Search Name (Link)', icon: actionIcons.SearchPerson, disabled: !hasValue, action: (node) => generateLink(node, `https://www.google.com/search?q=${encodeURIComponent('"' + node.value + '"')}`, "Person Search") }); break;
             case 'Organization': items.push({ label: 'Search Org (Link)', icon: actionIcons.SearchOrg, disabled: !hasValue, action: (node) => generateLink(node, `https://www.google.com/search?q=${encodeURIComponent('"' + node.value + '"')}`, "Organization Search") }); break;
             case 'Location': items.push({ label: 'Show on Map (Link)', icon: actionIcons.MapLocation, disabled: !hasValue, action: (node) => generateLink(node, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(node.value)}`, "Map Search") }); break;
         }
         items.push({ separator: true }); items.push({ label: 'Delete Node', icon: actionIcons.Delete, action: (node) => removeNode(node.id) }); return items;
     }

    // --- "Transforms" (Client-Side Actions) ---
    async function performApiLookup(url, sourceNode, processingMessage, successCallback, failureMessagePrefix) { if (!sourceNode || !sourceNode.value) return; logToInfoPanel(processingMessage, sourceNode); const nodeEl = findNodeElement(sourceNode.id); if (nodeEl) nodeEl.classList.add('loading'); try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const data = await response.json(); successCallback(data, sourceNode); } catch (error) { console.error(`${failureMessagePrefix} Error:`, error); logToInfoPanel(`${failureMessagePrefix} failed: ${error.message}`, sourceNode, true); playSound('error'); } finally { if (nodeEl) nodeEl.classList.remove('loading'); } }
    function transformDomainToIP(sourceNode) { const url = `https://ip-api.com/json/${sourceNode.value}?fields=status,message,query`; performApiLookup(url, sourceNode, `⚡ Looking up IP for ${sourceNode.value}...`, (data, node) => { if (data.status === 'success' && data.query) { logToInfoPanel(`✅ Found IP: ${data.query} for ${node.value}`, node); if (!nodes.some(n => n.type === 'IP Address' && n.value === data.query)) addNode('IP Address', data.query, node.x + 150, node.y + 30, node.id); } else { throw new Error(data.message || 'No IP found'); } }, "IP Lookup" ); }
    function transformIPLookup(sourceNode) { const url = `https://ip-api.com/json/${sourceNode.value}?fields=status,message,country,regionName,city,isp,org,as,query`; performApiLookup(url, sourceNode, `⚡ Looking up details for ${sourceNode.value}...`, (data, node) => { if (data.status === 'success') { let details = `<strong>IP Details...</strong>\n`; const loc = [data.city, data.regionName, data.country].filter(Boolean).join(', ') || 'N/A'; details += ` Loc: <span class="highlight">${loc}</span>\n`; details += ` ISP: <span class="highlight">${data.isp||'N/A'}</span>\n`; details += ` Org: <span class="highlight">${data.org||'N/A'}</span>\n`; details += ` AS: <span class="highlight">${data.as||'N/A'}</span>`; logToInfoPanel(details, node); if(loc!=='N/A' && !nodes.some(n=>n.type==='Location'&&n.value===loc)) addNode('Location', loc, node.x+150, node.y+30, node.id); if(data.org && !nodes.some(n=>n.type==='Organization'&&n.value===data.org)) addNode('Organization', data.org, node.x+150, node.y+60, node.id); } else { throw new Error(data.message || 'Lookup failed'); } }, "IP Details Lookup" ); }
    function generateLink(sourceNode, linkUrl, linkName, open = true) { logToInfoPanel(`${linkName} link for ${sourceNode.value}:\n<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`, sourceNode); if (open) window.open(linkUrl, '_blank'); }
    function transformDomainToSubdomainLink(node) { generateLink(node, `https://crt.sh/?q=%25.${encodeURIComponent(node.value)}`, "crt.sh"); }
    function transformDomainToWaybackLink(node) { generateLink(node, `https://web.archive.org/web/*/${encodeURIComponent(node.value)}`, "Wayback Machine"); }
    function transformUsernameSearch(node) { generateLink(node, `https://whatsmyname.app/?q=${encodeURIComponent(node.value)}`, "WhatsMyName Search"); }
    function transformEmailCheckHIBP(node) { generateLink(node, `https://haveibeenpwned.com/account/${encodeURIComponent(node.value)}`, "HaveIBeenPwned Check"); }
    function transformEmailToDomain(sourceNode) { const parts=sourceNode.value.split('@'); if (parts.length===2 && parts[1]) { const domain=parts[1]; logToInfoPanel(`✂️ Extracted domain: ${domain}`, sourceNode); const existing=nodes.find(n=>n.type==='Domain'&&n.value.toLowerCase()===domain.toLowerCase()); if(!existing) addNode('Domain', domain, sourceNode.x+150, sourceNode.y+30, sourceNode.id); else if(addConnectionIfNeeded(sourceNode, existing)) drawLines(); } else { logToInfoPanel(`Invalid email format: ${sourceNode.value}`, sourceNode, true); playSound('error');} }
    function transformURLParse(sourceNode) { try { const url=new URL(sourceNode.value); let d=`<strong>URL Parts...</strong>\n`; d+=` Proto:<span class="highlight">${url.protocol}</span>\n`; d+=` Host:<span class="highlight">${url.hostname}</span>\n`; if(url.port) d+=` Port:<span class="highlight">${url.port}</span>\n`; d+=` Path:<span class="highlight">${url.pathname}</span>\n`; if(url.search) d+=` Query:<span class="highlight">${url.search}</span>\n`; if(url.hash) d+=` Hash:<span class="highlight">${url.hash}</span>\n`; logToInfoPanel(d, sourceNode); if (url.hostname) { const existing=nodes.find(n=>n.type==='Domain'&&n.value.toLowerCase()===url.hostname.toLowerCase()); if(!existing) addNode('Domain', url.hostname, sourceNode.x+150, sourceNode.y+30, sourceNode.id); else if(addConnectionIfNeeded(sourceNode, existing)) drawLines(); } } catch (e) { logToInfoPanel(`Invalid URL: ${sourceNode.value}`, sourceNode, true); playSound('error'); } }
    function transformURLToDomain(sourceNode) { try { const url=new URL(sourceNode.value); if (url.hostname) { logToInfoPanel(`✂️ Extracted domain: ${url.hostname}`, sourceNode); const existing=nodes.find(n=>n.type==='Domain'&&n.value.toLowerCase()===url.hostname.toLowerCase()); if(!existing) addNode('Domain', url.hostname, sourceNode.x+150, sourceNode.y+30, sourceNode.id); else if(addConnectionIfNeeded(sourceNode, existing)) drawLines(); } else throw new Error("No hostname"); } catch (e) { logToInfoPanel(`Could not get domain: ${e.message}`, sourceNode, true); playSound('error'); } }


    // --- Line Drawing ---
    function drawLines() {
         const lines = svgCanvas.querySelectorAll('line'); lines.forEach(line => line.remove());
         nodes.forEach(node => { node.connections.forEach(targetId => { const targetNode = findNodeData(targetId); if (targetNode) { drawLine(node, targetNode); } }); });
    }
    function drawLine(nodeA, nodeB) {
         const elA = nodeA.element; const elB = nodeB.element; if (!elA || !elB) return; const [x1, y1] = getNodeConnectionPoint(nodeA, nodeB); const [x2, y2] = getNodeConnectionPoint(nodeB, nodeA); const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2); line.classList.add('connector-line'); line.setAttribute('data-source', nodeA.id); line.setAttribute('data-target', nodeB.id); line.setAttribute('marker-end', 'url(#arrowhead)'); svgCanvas.appendChild(line);
    }
    function getNodeConnectionPoint(sourceNode, targetNode) {
         const elA = sourceNode.element; const elB = targetNode.element; const wA = elA.offsetWidth; const hA = elA.offsetHeight; const wB = elB.offsetWidth; const hB = elB.offsetHeight; const xA = sourceNode.x + wA / 2; const yA = sourceNode.y + hA / 2; const xB = targetNode.x + wB / 2; const yB = targetNode.y + hB / 2; const dx = xB - xA; const dy = yB - yA; if (dx === 0 && dy === 0) return [xA, yA]; const angle = Math.atan2(dy, dx); const tanPhi = Math.abs(dy / dx); const tanTheta = hA / wA; let borderX, borderY; if (tanPhi < tanTheta) { borderX = xA + (dx > 0 ? wA / 2 : -wA / 2); borderY = yA + (dx > 0 ? wA / 2 * tanPhi : -wA / 2 * tanPhi); } else { borderY = yA + (dy > 0 ? hA / 2 : -hA / 2); borderX = xA + (dy > 0 ? hA / (2 * tanPhi) : -hA / (2 * tanPhi)); } return [borderX, borderY];
    }

    // --- Smart Connect Logic ---
    function smartConnect() {
        logToInfoPanel(`🧠 Initiating Smart Connect...`); let connectionsMade = 0; const nodesToCheck = [...nodes];
         for (let i = 0; i < nodesToCheck.length; i++) { const nodeA = nodesToCheck[i]; if (!nodeA.value || nodeA.value === '...') continue;
         for (let j = 0; j < nodesToCheck.length; j++) { if (i === j) continue; const nodeB = nodesToCheck[j]; if (!nodeB.value || nodeB.value === '...') continue;
         let madeConnectionThisPair = false; try {
         if ((nodeA.type === 'Email' && nodeB.type === 'Domain') || (nodeA.type === 'Domain' && nodeB.type === 'Email')) { const email = nodeA.type === 'Email' ? nodeA.value : nodeB.value; const domain = nodeA.type === 'Domain' ? nodeA.value : nodeB.value; const emailDomainPart = email.split('@')[1]; if (emailDomainPart && emailDomainPart.toLowerCase() === domain.toLowerCase()) { if (addConnectionIfNeeded(findNodeData(nodeA.id), findNodeData(nodeB.id))) madeConnectionThisPair = true; if (addConnectionIfNeeded(findNodeData(nodeB.id), findNodeData(nodeA.id))) madeConnectionThisPair = true; } }
         else if ((nodeA.type === 'URL' && nodeB.type === 'Domain') || (nodeA.type === 'Domain' && nodeB.type === 'URL')) { const urlVal = nodeA.type === 'URL' ? nodeA.value : nodeB.value; const domain = nodeA.type === 'Domain' ? nodeA.value : nodeB.value; const urlObj = new URL(urlVal); if (urlObj.hostname && urlObj.hostname.toLowerCase() === domain.toLowerCase()) { if (addConnectionIfNeeded(findNodeData(nodeA.id), findNodeData(nodeB.id))) madeConnectionThisPair = true; if (addConnectionIfNeeded(findNodeData(nodeB.id), findNodeData(nodeA.id))) madeConnectionThisPair = true; } }
         else if ((nodeA.type === 'IP Address' && nodeB.type === 'URL') || (nodeA.type === 'URL' && nodeB.type === 'IP Address')) { const urlVal = nodeA.type === 'URL' ? nodeA.value : nodeB.value; const ip = nodeA.type === 'IP Address' ? nodeA.value : nodeB.value; const urlObj = new URL(urlVal); if (urlObj.hostname && urlObj.hostname === ip) { if (addConnectionIfNeeded(findNodeData(nodeA.id), findNodeData(nodeB.id))) madeConnectionThisPair = true; if (addConnectionIfNeeded(findNodeData(nodeB.id), findNodeData(nodeA.id))) madeConnectionThisPair = true; } }
         else if ((nodeA.type === 'Person' && nodeB.type === 'Username') || (nodeA.type === 'Username' && nodeB.type === 'Person')) { const name = (nodeA.type === 'Person' ? nodeA.value : nodeB.value).toLowerCase().replace(/\s+/g, ''); const username = (nodeA.type === 'Username' ? nodeA.value : nodeB.value).toLowerCase(); if ((name.length > 2 && username.length > 2) && (name.includes(username) || username.includes(name))) { if (addConnectionIfNeeded(findNodeData(nodeA.id), findNodeData(nodeB.id))) madeConnectionThisPair = true; if (addConnectionIfNeeded(findNodeData(nodeB.id), findNodeData(nodeA.id))) madeConnectionThisPair = true; } }
         // Smart connect username to specific social media type?
         else if (nodeA.type === 'Username') {
             if (['Twitter', 'Github', 'Reddit', 'Instagram', 'LinkedIn'].includes(nodeB.type) && nodeA.value.toLowerCase() === nodeB.value.toLowerCase()) {
                 if (addConnectionIfNeeded(findNodeData(nodeA.id), findNodeData(nodeB.id))) madeConnectionThisPair = true;
                 if (addConnectionIfNeeded(findNodeData(nodeB.id), findNodeData(nodeA.id))) madeConnectionThisPair = true;
             }
         } else if (nodeB.type === 'Username') { // Reverse check
              if (['Twitter', 'Github', 'Reddit', 'Instagram', 'LinkedIn'].includes(nodeA.type) && nodeA.value.toLowerCase() === nodeB.value.toLowerCase()) {
                 if (addConnectionIfNeeded(findNodeData(nodeA.id), findNodeData(nodeB.id))) madeConnectionThisPair = true;
                 if (addConnectionIfNeeded(findNodeData(nodeB.id), findNodeData(nodeA.id))) madeConnectionThisPair = true;
             }
         }
         } catch (e) { /* Ignore errors */ } if(madeConnectionThisPair) connectionsMade++; } }
         if (connectionsMade > 0) { logToInfoPanel(`✅ Smart Connect completed. Added/found ${connectionsMade} relationship link(s).`, null, false); drawLines(); } else { logToInfoPanel(`ℹ️ Smart Connect completed. No new direct relationships found.`, null, false); }
    }
    function addConnectionIfNeeded(sourceNodeData, targetNodeData) {
         if (sourceNodeData && targetNodeData && sourceNodeData.id !== targetNodeData.id && !sourceNodeData.connections.includes(targetNodeData.id)) { sourceNodeData.connections.push(targetNodeData.id); return true; } return false;
    }
    smartConnectBtn.addEventListener('click', () => { playSound('click'); smartConnect(); });


     // --- Terminal Input Handling ---
     terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); const command = terminalInput.textContent.trim(); terminalInput.textContent = ''; processTerminalCommand(command); }
     });
     terminalInput.addEventListener('paste', (e) => { e.preventDefault(); const text = (e.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, text); });

     function processTerminalCommand(command) {
         if (!command) return; logToInfoPanel(`> ${command}`);
         if (nodeWaitingForInput !== null) { const targetNode = findNodeData(nodeWaitingForInput); if (targetNode) { updateNodeValue(nodeWaitingForInput, command); nodeWaitingForInput = null; return; } else { nodeWaitingForInput = null; } }
         const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g) || []; const action = parts[0]?.toLowerCase(); const type = parts[1]; const value = parts.slice(2).join(" ").replace(/^"|"$/g, '');
         if (action === 'add' && type && value) { const capType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(); if (entityIcons[capType] || ['Twitter','Github','Reddit','Instagram','LinkedIn'].includes(capType)) { const graphRect = graphArea.getBoundingClientRect(); addNode(capType, value, graphRect.width / 2, graphRect.height / 2); } else { logToInfoPanel(`Error: Unknown entity type "${type}".`, null, true); playSound('error'); } }
         else if (action === 'connect' && parts.length === 3) { const id1 = parseInt(parts[1], 10); const id2 = parseInt(parts[2], 10); const node1 = findNodeData(id1); const node2 = findNodeData(id2); if (node1 && node2) { if (addConnectionIfNeeded(node1, node2)) { logToInfoPanel(`Manually connected ${id1} -> ${id2}`); drawLines(); playSound('connect'); } else { logToInfoPanel(`Connection ${id1} -> ${id2} exists or invalid.`); } } else { logToInfoPanel(`Error: Could not find nodes ${id1} or ${id2}.`, null, true); playSound('error'); } }
         else if (command === 'help') { logToInfoPanel("Commands:\n add <type> <value>\n connect <id1> <id2>\n help"); }
         else { logToInfoPanel(`Unknown command: "${command}". Type 'help'.`, null, true); playSound('error'); }
     }


    // --- Save/Load Functionality ---
    function saveGraphState() {
        playSound('save'); const graphData = { nodes: nodes.map(node => ({ id: node.id, type: node.type, value: node.value, x: node.x, y: node.y, connections: [...node.connections] })), nodeIdCounter: nodeIdCounter }; const dataStr = JSON.stringify(graphData, null, 2); const dataBlob = new Blob([dataStr], { type: 'application/json' }); const url = URL.createObjectURL(dataBlob); const downloadLink = document.createElement('a'); downloadLink.href = url; const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'); downloadLink.download = `valis-graph-${timestamp}.json`; document.body.appendChild(downloadLink); downloadLink.click(); document.body.removeChild(downloadLink); URL.revokeObjectURL(url); logToInfoPanel("💾 Graph state saved.");
     }
    function loadGraphState(event) {
         const file = event.target.files[0]; if (!file) { logToInfoPanel("Load cancelled.", null, true); return; }
         const reader = new FileReader(); reader.onload = (e) => { try { const graphData = JSON.parse(e.target.result); if (!graphData || !Array.isArray(graphData.nodes) || typeof graphData.nodeIdCounter !== 'number') throw new Error("Invalid file format."); playSound('load'); logToInfoPanel(`📂 Loading graph state from ${file.name}...`); nodes.forEach(node => node.element?.remove()); svgCanvas.innerHTML = ''; svgCanvas.appendChild(svgDefs); nodes = []; selectedNodeId = null; nodeWaitingForInput = null; draggingNode = null; contextNodeId = null; nodeIdCounter = graphData.nodeIdCounter; graphData.nodes.forEach(nodeInfo => addNode(nodeInfo.type, nodeInfo.value, nodeInfo.x, nodeInfo.y, null, nodeInfo.id)); graphData.nodes.forEach(nodeInfo => { const sourceNodeData = findNodeData(nodeInfo.id); if (sourceNodeData && Array.isArray(nodeInfo.connections)) { nodeInfo.connections.forEach(targetId => { if (findNodeData(targetId)) { if (!sourceNodeData.connections.includes(targetId)) sourceNodeData.connections.push(targetId); } else { console.warn(`Load warning: Target node ${targetId} for source ${nodeInfo.id} not found.`); } }); } }); drawLines(); logToInfoPanel(`✅ Graph state loaded successfully.`); renderInfoPanel(); } catch (error) { console.error("Load Error:", error); logToInfoPanel(`❌ Error loading graph state: ${error.message}`, null, true); playSound('error'); } finally { event.target.value = null; } }; reader.onerror = () => { logToInfoPanel(`❌ Error reading file: ${reader.error}`, null, true); playSound('error'); event.target.value = null; }; reader.readAsText(file);
     }
    saveStateBtn.addEventListener('click', saveGraphState);
    loadStateBtn.addEventListener('click', () => loadFileInput.click());
    loadFileInput.addEventListener('change', loadGraphState);


    // --- Info Panel Update ---
    function logToInfoPanel(message, nodeData = null, isError = false) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const logEntry = { timestamp, message, nodeData, isError };
        infoLog.push(logEntry); if (infoLog.length > MAX_LOG_LINES) infoLog.shift();
        if (mainMenuOverlay.classList.contains('hidden')) renderInfoPanel();
    }
    function updateInfoPanel(nodeData = null) {
         if (mainMenuOverlay.classList.contains('hidden')) renderInfoPanel(nodeData);
    }
    function renderInfoPanel(explicitNodeData = null) {
        let content = ''; const nodeToDisplay = explicitNodeData || findNodeData(selectedNodeId);
         if (nodeToDisplay) { content += `<span class="info-header">--- Node ${nodeToDisplay.id}: [${nodeToDisplay.type}] ---</span>\n`; content += `<strong>Value:</strong> ${nodeToDisplay.value || '...'}\n`; const outgoing = nodeToDisplay.connections.length; const incoming = nodes.filter(n => n.connections.includes(nodeToDisplay.id)).length; content += `<strong>Links:</strong> ${outgoing} Out / ${incoming} In\n\n`; content += `<span class="info-header">--- Activity Log ---</span>\n`; }
         else { content += `<span class="info-header">--- Activity Log ---</span>\n`; }
         [...infoLog].reverse().forEach(entry => { content += `[${entry.timestamp}] ${entry.isError ? '<span class="error">ERROR:</span> ' : ''}${entry.message}\n`; });
         infoContent.innerHTML = content;
         if (infoContent.scrollHeight > infoContent.clientHeight && infoContent.scrollTop >= infoContent.scrollHeight - infoContent.clientHeight - 50) infoContent.scrollTop = infoContent.scrollHeight;
         else if (infoLog.length <= 5 && infoLog.length > 0) infoContent.scrollTop = infoContent.scrollHeight;
     }


    // --- Initial State ---
    // Initial log message set after Start button click

}); // End DOMContentLoaded