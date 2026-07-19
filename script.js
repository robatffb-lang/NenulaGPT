document.addEventListener("DOMContentLoaded", () => {
    // --- State Machine Configuration Management Engine ---
    let currentModel = "flash-x";
    let isPremium = false;
    let flashLimit = 5; 
    let proLimit = 3;

    // --- Dynamic Chat History Management States ---
    let chatSessions = {}; // Key-value index registry tracking -> { sessionId: { html: string, apiMessages: Array } }
    let currentSessionId = "session_" + Date.now();

    // Safety factory helper to ensure data objects exist before reading/writing
    function ensureSessionExists(id) {
        if (!chatSessions[id]) {
            chatSessions[id] = { html: "", apiMessages: [] };
        }
    }
    
    // Initialize the first session immediately
    ensureSessionExists(currentSessionId);

    // Inject Image-2 Dropdown Chooser Layout Context Components
    const inputForm = document.querySelector(".input-form");
    if (inputForm) {
        const chooserHTML = `
            <div class="model-chooser-context">
                <button type="button" class="chooser-trigger-btn" id="chooserTrigger">
                    <span id="activeModelLabel">⚡ Flash-X</span>
                    <i data-lucide="chevron-down" style="width:14px;height:14px;"></i>
                </button>
                
                <div class="model-dropdown-menu" id="modelDropdown">
                    <button type="button" class="dropdown-item active" data-model="flash-x">
                        <i data-lucide="check" class="item-check-icon"></i>
                        <div class="item-details">
                            <div class="item-title-row">
                                <span class="item-title">Flash-X</span>
                                <span class="item-badge">Free</span>
                            </div>
                            <span class="item-desc">Instant reply baseline engine.</span>
                        </div>
                    </button>
                    
                    <button type="button" class="dropdown-item" data-model="flash" id="itemFlash">
                        <i data-lucide="check" class="item-check-icon"></i>
                        <div class="item-details">
                            <div class="item-title-row">
                                <span class="item-title">Flash</span>
                                <span class="item-badge" id="dropdownFlashCount">${flashLimit} left</span>
                            </div>
                            <span class="item-desc">Thinks for a moment, fast response.</span>
                        </div>
                    </button>
                    
                    <button type="button" class="dropdown-item" data-model="pro" id="itemPro">
                        <i data-lucide="check" class="item-check-icon"></i>
                        <div class="item-details">
                            <div class="item-title-row">
                                <span class="item-title">Pro</span>
                                <span class="item-badge" id="dropdownProCount">${proLimit} left</span>
                            </div>
                            <span class="item-desc">Deep logical reasoning pipelines.</span>
                        </div>
                    </button>
                </div>
            </div>
        `;
        inputForm.insertAdjacentHTML("afterbegin", chooserHTML);
    }

    // Inject Premium Upgrade Layout Interceptor
    const modalHTML = `
        <div class="premium-overlay" id="premiumModal">
            <div class="premium-card">
                <div class="premium-icon-wrap"><i data-lucide="crown" style="width:28px;height:28px;"></i></div>
                <h2>Nebula Premium Required</h2>
                <p>You've triggered a rate-limit cooldown on standard compute models. Upgrade to Premium to completely bypass limitations and execute deep logic pipelines instantly.</p>
                <button class="upgrade-btn" id="simulatePurchaseBtn">Unlock Everything — $10/mo</button>
                <button class="close-modal-btn" id="closeModalBtn">Keep Using Flash-X</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    lucide.createIcons();

    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const messagesContainer = document.getElementById("messagesContainer");
    const newChatBtn = document.getElementById("newChatBtn");
    
    const chooserTrigger = document.getElementById("chooserTrigger");
    const modelDropdown = document.getElementById("modelDropdown");
    const premiumModal = document.getElementById("premiumModal");

    // Toggle Dropdown Menu Visibility Layout Logic
    chooserTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        chooserTrigger.classList.toggle("open");
        modelDropdown.classList.toggle("show");
    });

    // Close Dropdown upon Outside Click Context Interception
    document.addEventListener("click", () => {
        if (chooserTrigger && modelDropdown) {
            chooserTrigger.classList.remove("open");
            modelDropdown.classList.remove("show");
        }
    });

    // Sync state data across visual badge systems
    function updateDropdownUI() {
        const labels = { "flash-x": "⚡ Flash-X", "flash": "✨ Flash", "pro": "🔮 Pro" };
        document.getElementById("activeModelLabel").innerText = labels[currentModel];

        document.querySelectorAll(".dropdown-item").forEach(item => {
            const m = item.getAttribute("data-model");
            item.classList.remove("active", "disabled");
            
            if (m === currentModel) item.classList.add("active");
            
            if (!isPremium) {
                if (m === "flash" && flashLimit <= 0) item.classList.add("disabled");
                if (m === "pro" && proLimit <= 0) item.classList.add("disabled");
            }
        });

        document.getElementById("dropdownFlashCount").innerText = isPremium ? "Premium" : `${flashLimit} left`;
        document.getElementById("dropdownProCount").innerText = isPremium ? "Premium" : `${proLimit} left`;
    }

    // Dropdown Item Evaluation Strategy Selector Loop
    modelDropdown.addEventListener("click", (e) => {
        const item = e.target.closest(".dropdown-item");
        if (!item) return;
        e.stopPropagation();

        const targetModel = item.getAttribute("data-model");

        if (!isPremium) {
            if ((targetModel === "flash" && flashLimit <= 0) || (targetModel === "pro" && proLimit <= 0)) {
                premiumModal.classList.add("show");
                chooserTrigger.classList.remove("open");
                modelDropdown.classList.remove("show");
                return;
            }
        }

        currentModel = targetModel;
        updateDropdownUI();
        chooserTrigger.classList.remove("open");
        modelDropdown.classList.remove("show");
    });

    // Premium Purchase Simulation Layer Execution
    document.getElementById("simulatePurchaseBtn").addEventListener("click", () => {
        isPremium = true;
        updateDropdownUI();
        premiumModal.classList.remove("show");
        alert("✨ Nebula Premium Activated! Limit thresholds removed permanently.");
    });

    document.getElementById("closeModalBtn").addEventListener("click", () => {
        premiumModal.classList.remove("show");
    });

    // Strict pixel matching scaling layout execution loop (Matches updated css 32px height)
    function adjustInputHeight() {
        userInput.style.height = "32px"; 
        const scrollHeight = userInput.scrollHeight;
        if (scrollHeight > 32) {
            userInput.style.height = `${scrollHeight}px`;
        }
        sendBtn.disabled = userInput.value.trim() === "";
    }

    userInput.addEventListener("input", adjustInputHeight);

    userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); 
            if (userInput.value.trim() !== "") {
                chatForm.requestSubmit(); 
            }
        }
    });

    // --- Advanced Engine History Session Synchronization Hooks ---
    function syncCurrentSessionToCache() {
        ensureSessionExists(currentSessionId);
        const structuralVerification = messagesContainer.querySelector(".message-wrapper");
        if (structuralVerification) {
            chatSessions[currentSessionId].html = messagesContainer.innerHTML;
        }
    }

    function handleSidebarHistoryRegistration(firstUserQueryText) {
        let lookupItem = document.querySelector(`[data-session-id="${currentSessionId}"]`);
        
        if (!lookupItem) {
            let optimizedTitle = firstUserQueryText;
            if (optimizedTitle.length > 22) {
                optimizedTitle = optimizedTitle.substring(0, 20) + "...";
            }

            const sidebarHistoryWrapper = document.querySelector(".chat-history");
            if (sidebarHistoryWrapper) {
                document.querySelectorAll(".history-item").forEach(i => i.classList.remove("active"));

                const historyToken = document.createElement("div");
                historyToken.classList.add("history-item", "active");
                historyToken.setAttribute("data-session-id", currentSessionId);
                historyToken.innerHTML = `
                    <i data-lucide="message-square" style="width:16px;height:16px;"></i>
                    <span>${optimizedTitle}</span>
                `;
                
                sidebarHistoryWrapper.prepend(historyToken);
                lucide.createIcons();

                // Bind functional hot swapping selection context listener 
                historyToken.addEventListener("click", () => {
                    switchActiveSessionContext(historyToken.getAttribute("data-session-id"));
                });
            }
        }
        syncCurrentSessionToCache();
    }

    function switchActiveSessionContext(targetSessionId) {
        // Save leaving environment frame
        syncCurrentSessionToCache();

        currentSessionId = targetSessionId;
        ensureSessionExists(currentSessionId);
        
        messagesContainer.innerHTML = chatSessions[targetSessionId].html || "";

        document.querySelectorAll(".history-item").forEach(token => {
            token.classList.remove("active");
            if (token.getAttribute("data-session-id") === targetSessionId) {
                token.classList.add("active");
            }
        });

        lucide.createIcons();
        scrollToBottom();
    }

    // New Chat Action Route Implementation Execution Handler
    newChatBtn.addEventListener("click", () => {
        const hasMessages = messagesContainer.querySelector(".message-wrapper");
        if (hasMessages) {
            syncCurrentSessionToCache();
        }

        document.querySelectorAll(".history-item").forEach(token => token.classList.remove("active"));
        
        // Factory fresh context state parameters mapping
        currentSessionId = "session_" + Date.now();
        ensureSessionExists(currentSessionId);
        
        messagesContainer.innerHTML = `
            <div class="welcome-screen" id="welcomeScreen">
                <div class="welcome-icon"><i data-lucide="zap" style="width:36px;height:36px;"></i></div>
                <h1>What can I help with?</h1>
                <p>Select a computational model engine and drop your code architectures or requirements below to begin debugging.</p>
            </div>
        `;
        
        lucide.createIcons();
        userInput.value = "";
        userInput.style.height = "32px";
        sendBtn.disabled = true;
    });

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const queryText = userInput.value.trim();
        if (!queryText) return;

        const welcomeScreen = document.getElementById("welcomeScreen");
        if (welcomeScreen) welcomeScreen.remove();

        appendMessage(queryText, "user");
        
        // Lock user query into the session array pipeline memory
        ensureSessionExists(currentSessionId);
        chatSessions[currentSessionId].apiMessages.push({ role: "user", content: queryText });

        // Intercept query state pipeline immediately to ensure sidebar layout binding rules mapping
        handleSidebarHistoryRegistration(queryText);

        userInput.value = "";
        userInput.style.height = "32px"; 
        sendBtn.disabled = true;

        fetchLiveAI(queryText);
    });

    function appendMessage(text, sender) {
        const msgWrapper = document.createElement("div");
        msgWrapper.classList.add("message-wrapper", sender);

        if (sender === "ai") {
            msgWrapper.innerHTML = `
                <div class="msg-avatar"><i data-lucide="zap" style="width:16px;height:16px;"></i></div>
                <div class="message-bubble"></div>
            `;
        } else {
            msgWrapper.innerHTML = `<div class="message-bubble"></div>`;
            msgWrapper.querySelector(".message-bubble").textContent = text;
        }

        messagesContainer.appendChild(msgWrapper);
        lucide.createIcons(); 
        scrollToBottom();
        return msgWrapper;
    }

    async function fetchLiveAI(userPrompt) {
    const aiWrapper = appendMessage("", "ai");
    const bubble = aiWrapper.querySelector(".message-bubble");
    
    if (!isPremium) {
        if (currentModel === "flash") flashLimit--;
        if (currentModel === "pro") proLimit--;
    }

    // Swapped standard setTimeout for background-safe visibility listeners
    if (currentModel === "flash") {
        bubble.innerHTML = `<div class="thinking-container"><div class="thinking-spinner"></div>Thinking...</div>`;
        await waitWithVisibilityCheck(2500); 
        bubble.innerHTML = "";
    } else if (currentModel === "pro") {
        bubble.innerHTML = `<div class="thinking-container"><div class="thinking-spinner"></div>Thinking deeply...</div>`;
        await waitWithVisibilityCheck(5000); 
        bubble.innerHTML = "";
    }

    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    typingIndicator.innerHTML = "<span></span><span></span><span></span>";
    bubble.appendChild(typingIndicator);

    let currentSystemContent = 'You are an advanced, helpful AI assistant. If the user asks a technical or coding question, act as an expert coding engine and always use markdown codeblocks with the language name.';
    if (currentModel === "pro") {
        currentSystemContent += ' For technical queries, provide extensive, deep architecture details, edge-case evaluations, and deep code comments. If the user is just greeting you or making small talk, respond conversationally, naturally, and concisely without generating unprompted code structures.';
    }

    ensureSessionExists(currentSessionId);
    const payloadMessages = [
        { role: 'system', content: currentSystemContent },
        ...chatSessions[currentSessionId].apiMessages
    ];

    try {
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: payloadMessages })
        });

        if (!response.ok) throw new Error("API Pipeline Exception");

        const replyText = await response.text();
        typingIndicator.remove();
        
        chatSessions[currentSessionId].apiMessages.push({ role: "assistant", content: replyText });
        
        streamMarkdown(bubble, replyText);

        if (!isPremium && ((currentModel === "flash" && flashLimit <= 0) || (currentModel === "pro" && proLimit <= 0))) {
            currentModel = "flash-x";
        }
        updateDropdownUI();

    } catch (error) {
        console.error(error);
        typingIndicator.remove();
        bubble.innerHTML = `<span style="color: #ef4444;">Network connection error. Check internet connection and retry.</span>`;
        syncCurrentSessionToCache();
    }
}

    function highlightCode(code, lang) {
        lang = lang.toLowerCase();
        let rules = [];

        if (lang === 'lua') {
            rules = [
                { type: 'comment', regex: /(--.*)/g },
                { type: 'string', regex: /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/g },
                { type: 'keyword', regex: /\b(local|function|end|if|then|else|elseif|for|in|do|while|repeat|until|return|break|true|false|not|and|or)\b/g },
                { type: 'builtin', regex: /\b(game|workspace|script|Instance|Vector3|CFrame|Color3|UDim2|math|table|string|pairs|ipairs|print|task|wait|Connect|ConnectParallel|Disconnect|FindFirstChild|FindFirstChildOfClass|FindFirstChildWhichIsA|IsA|WaitForChild|Destroy|Clone)\b/g },
                { type: 'number', regex: /\b(\d+)\b/g }
            ];
        } else if (lang === 'css') {
            rules = [
                { type: 'comment', regex: /(\/\*[\s\S]*?\*\/)/g },
                { type: 'property', regex: /\b([a-zA-Z-]+)\s*:/g },
                { type: 'string', regex: /("[^"]*"|'[^']*')/g },
                { type: 'number', regex: /\b(\d+(px|em|rem|vh|vw|%|ms|s)?)\b/g }
            ];
        } else {
            rules = [
                { type: 'comment', regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g },
                { type: 'string', regex: /("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[\s\S]*?`)/g },
                { type: 'keyword', regex: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|true|false|null|async|await|try|catch)\b/g },
                { type: 'builtin', regex: /\b(document|window|console|log|fetch|JSON|stringify|parse|addEventListener|createElement|querySelector|getElementById)\b/g },
                { type: 'number', regex: /\b(\d+)\b/g }
            ];
        }

        let textParts = [{ text: code, isToken: false }];

        rules.forEach(rule => {
            let newParts = [];
            textParts.forEach(part => {
                if (part.isToken) {
                    newParts.push(part);
                    return;
                }

                let lastIndex = 0;
                let match;
                rule.regex.lastIndex = 0;
                let src = part.text;
                let matches = [];

                while ((match = rule.regex.exec(src)) !== null) {
                    if (match.index === rule.regex.lastIndex) rule.regex.lastIndex++;
                    matches.push(match);
                }

                matches.forEach(m => {
                    let matchStr = m[0];
                    let matchIndex = m.index;

                    if (matchIndex >= lastIndex) {
                        if (matchIndex > lastIndex) {
                            newParts.push({ text: src.substring(lastIndex, matchIndex), isToken: false });
                        }

                        if (rule.type === 'property') {
                            let propName = m[1];
                            newParts.push({ text: propName, isToken: true, type: rule.type });
                            newParts.push({ text: matchStr.substring(propName.length), isToken: false });
                        } else {
                            newParts.push({ text: matchStr, isToken: true, type: rule.type });
                        }
                        lastIndex = matchIndex + matchStr.length;
                    }
                });

                if (lastIndex < src.length) {
                    newParts.push({ text: src.substring(lastIndex), isToken: false });
                }
            });
            textParts = newParts;
        });

        return textParts.map(p => p.isToken ? `<span class="token ${p.type}">${p.text}</span>` : p.text).join('');
    }

    function parseMarkdown(text) {
        let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let parts = escaped.split(/```/);
        let htmlResult = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                let txt = parts[i];
                txt = txt.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                txt = txt.replace(/`(.*?)`/g, "<code class='inline-code'>$1</code>");
                txt = txt.replace(/\n/g, "<br>");
                htmlResult.push(txt);
            } else {
                let blockContent = parts[i];
                let firstNewLine = blockContent.indexOf("\n");
                let lang = "code";
                let code = blockContent;

                if (firstNewLine !== -1) {
                    lang = blockContent.substring(0, firstNewLine).trim() || "code";
                    code = blockContent.substring(firstNewLine + 1);
                }

                if (code.endsWith("\n")) code = code.slice(0, -1);

                let highlighted = highlightCode(code, lang);

                htmlResult.push(`
                    <div class="script-container">
                        <div class="script-header">
                            <span class="script-lang">${lang || 'code'}</span>
                            <button class="script-copy-btn">
                                <i data-lucide="copy" style="width:14px;height:14px;"></i> Copy
                            </button>
                        </div>
                        <pre class="script-content"><code>${highlighted}</code></pre>
                    </div>
                `);
            }
        }

        return htmlResult.join('');
    }

    function streamMarkdown(targetElement, fullString) {
        let currentIndex = 0;
        let runningText = "";
        const speed = 2; 
        let loopTimer = null;

        function type() {
            // Instantly break out if the page is hidden
            if (document.hidden) {
                finishInstantly();
                return;
            }

            if (currentIndex < fullString.length) {
                runningText += fullString.charAt(currentIndex);
                targetElement.innerHTML = parseMarkdown(runningText);
                currentIndex++;
                lucide.createIcons(); 
                scrollToBottom();
                syncCurrentSessionToCache();
                
                loopTimer = setTimeout(type, speed);
            } else {
                document.removeEventListener("visibilitychange", visibilityHandler);
            }
        }

        function finishInstantly() {
            if (loopTimer) clearTimeout(loopTimer);
            targetElement.innerHTML = parseMarkdown(fullString);
            lucide.createIcons();
            scrollToBottom();
            syncCurrentSessionToCache();
            document.removeEventListener("visibilitychange", visibilityHandler);
        }

        function visibilityHandler() {
            if (document.hidden) {
                finishInstantly();
            }
        }

        document.addEventListener("visibilitychange", visibilityHandler);

        // Immediate intercept check if tab is already hidden when network finishes
        if (document.hidden) {
            finishInstantly();
        } else {
            type();
        }
    }

    messagesContainer.addEventListener("click", (e) => {
        const copyBtn = e.target.closest(".script-copy-btn");
        if (!copyBtn) return;

        const container = copyBtn.closest(".script-container");
        const codeElement = container.querySelector(".script-content code");
        
        if (codeElement) {
            const textToCopy = codeElement.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyBtn.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;"></i> Copied!`;
                copyBtn.classList.add("copied");
                lucide.createIcons();

                setTimeout(() => {
                    copyBtn.innerHTML = `<i data-lucide="copy" style="width:14px;height:14px;"></i> Copy`;
                    copyBtn.classList.remove("copied");
                    lucide.createIcons();
                }, 2000);
            }).catch(err => console.error("Clipboard access denied: ", err));
        }
    });

    function scrollToBottom() {
        messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });
    }
});

// Smart timer helper that instantly resolves if you switch tabs to prevent Chrome background freezing
function waitWithVisibilityCheck(ms) {
    return new Promise(resolve => {
        if (document.hidden) return resolve();
        
        const timer = setTimeout(() => {
            document.removeEventListener("visibilitychange", checkVisibility);
            resolve();
        }, ms);
        
        function checkVisibility() {
            if (document.hidden) {
                clearTimeout(timer);
                document.removeEventListener("visibilitychange", checkVisibility);
                resolve();
            }
        }
        document.addEventListener("visibilitychange", checkVisibility);
    });
}
