// This starts empty. JavaScript will read your products.json file and fill this automatically!
let lmgMasterDatabase = [];
let currentShoppingCartMemory = [];
let currentFilterCategory = "all";

document.addEventListener("DOMContentLoaded", () => {
    // Load data from your external text registry node
    loadInventoryFromJSON();
    setupAdminPortalListener();
});

// ADMIN PASSWORD
const ADMIN_SECRET_KEY = "admin123";

async function loadInventoryFromJSON() {
    try {
        // 1. Fetch your external data sheet file
        const response = await fetch('products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP network fault code: ${response.status}`);
        }
        
        // 2. Parse the text data block straight into your runtime database array
        lmgMasterDatabase = await response.json();
        
        // 3. Render the grid layout once the data is loaded
        renderMainGrid(lmgMasterDatabase);
        
    } catch (error) {
        console.error("CRITICAL CONSOLE ERROR: Failed to map json data node:", error);
        // Fallback placeholder message if your file has a typo or is missing
        const targetGrid = document.getElementById("productGridContainer");
        if (targetGrid) {
            targetGrid.innerHTML = `<div class="empty-notice" style="grid-column: 1/-1">> ERROR COMPILING FILE PATHWAYS. ENSURE products.json IS PRESENT.</div>`;
        }
    }
}

function triggerAdminAuth() {
    const inputKey = prompt("ENTER SYSTEM PASSCODE TO ACCESS MERCH MANAGEMENT NODE:");
    if (inputKey === ADMIN_SECRET_KEY) {
        document.getElementById("secureAdminPortal").style.display = "block";
        alert("Access Granted: Admin Control Console initialized.");
    } else if (inputKey !== null) {
        alert("Access Denied: Invalid security compliance trace.");
    }
}

function closeAdminPortal() {
    document.getElementById("secureAdminPortal").style.display = "none";
}

function renderMainGrid(itemsArray) {
    const targetGrid = document.getElementById("productGridContainer");
    if (!targetGrid) return;
    targetGrid.innerHTML = "";

    const activeDisplayItems = itemsArray.filter(item => {
        return currentFilterCategory === "NEW PRODUCTS" || item.cat === currentFilterCategory;
    });

    

    activeDisplayItems.forEach(item => {
    // 1. Handle image resolving (Check if it's an array or a single string)
    let imageList = Array.isArray(item.img) ? item.img : [item.img];
    if (imageList.length === 0 || !imageList[0]) {
        imageList = ["https://placehold.co" + encodeURIComponent(item.name)];
    }
    
    // 2. Generate HTML markup for the thumbnail grid indicator gallery
    let thumbnailMarkup = "";
    if (imageList.length > 1) {
        thumbnailMarkup = `<div class="thumb-gallery" style="display: flex; gap: 5px; margin-top: 8px;">`;
        imageList.forEach((imgUrl, idx) => {
            thumbnailMarkup += `
                <img src="${imgUrl}" 
                     alt="thumbnail" 
                     onclick="switchProductMainViewImage(${item.id}, '${imgUrl}')" 
                     style="width: 50px; height: 50px; object-fit: cover; border: 1px solid #222; cursor: pointer; opacity: 0.6; transition: opacity 0.2s;"
                     onmouseover="this.style.opacity='1'" 
                     onmouseout="this.style.opacity='0.6'">`;
        });
        thumbnailMarkup += `</div>`;
    }
    
    let customTextInputMarkup = item.hasCustomText 
        ? `<label for="textStamp_${item.id}">> BRANDING STAMP INSCRIPTION:</label>
           <input type="text" id="textStamp_${item.id}" placeholder="e.g., KODJO_IT or BACK PRINT TEXT" maxlength="25">`
        : "";

    let optionsHTML = "";
    item.sizes.forEach(size => {
        optionsHTML += `<option value="${size}">${size}</option>`;
    });

    let actionButtonHTML = item.isAffiliate
        ? `<a href="${item.affiliateLink}" target="_blank" rel="noopener noreferrer" class="cyber-btn" style="text-align: center; display: block; text-decoration: none; color: #00ff66; border: 1px solid #00ff66; padding: 10px; font-weight: bold; background: transparent; font-family: monospace;">[⚡ DEPLOY TO MERCHANT]</a>`
        : `<button class="add-cart-btn" onclick="injectItemToCartMemory(${item.id})">ADD TO CART</button>`;

    // Note the added id="mainImage_\${item.id}" so our script can target and swap it dynamically
    const cardDomString = `
        <div class="product-card">
            <div>
                <img id="mainImage_${item.id}" src="${imageList[0]}" alt="${item.name}" onclick="openImageEnlargeNode(this.src)" style="cursor: zoom-in;" onerror="this.onerror=null; this.src='https://placehold.co';">
                ${thumbnailMarkup}
                <h3>${item.name}</h3>
                <div class="price-tag">GHS ${item.price.toFixed(2)}</div>
                <p>${item.desc}</p>
            </div>
            <div>
                <div class="card-options">
                    <label for="sizeSelection_${item.id}">> SELECT SIZE / HARDWARE CONFIG:</label>
                    <select id="sizeSelection_${item.id}">
                        ${optionsHTML}
                    </select>
                    ${customTextInputMarkup}
                </div>
                ${actionButtonHTML}
            </div>
        </div>
    `;
    targetGrid.innerHTML += cardDomString;
});
}

function setupAdminPortalListener() {
    const formNode = document.getElementById("adminProductForm");
    if (!formNode) return;

    formNode.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("newProdName").value.trim();
        const category = document.getElementById("newProdCat").value;
        const price = parseFloat(document.getElementById("newProdPrice").value);
        const desc = document.getElementById("newProdDesc").value.trim();
        const sizesRaw = document.getElementById("newProdSizes").value;
        const imgInput = document.getElementById("newProdImg").value.trim();

        const sizesArray = sizesRaw.split(",").map(s => s.trim()).filter(s => s.length > 0);

        const newlyCompiledModule = {
            id: Date.now() + Math.floor(Math.random() * 100),
            name: title,
            desc: desc,
            price: price,
            img: imgInput ? imgInput : "",
            sizes: sizesArray.length > 0 ? sizesArray : ["Universal"],
            cat: category,
            hasCustomText: (category === "Apparel")
        };

        lmgMasterDatabase.push(newlyCompiledModule);
        renderMainGrid(lmgMasterDatabase);
        formNode.reset();
        alert("Inventory Registry updated successfully!");
    });
}

function filterCategory(catFlag, UIElement) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (UIElement) UIElement.classList.add('active');

    currentFilterCategory = catFlag;
    const gridNode = document.getElementById("productGridContainer");
    if (!gridNode) return;
    gridNode.classList.add("grid-hidden");

    setTimeout(() => {
        renderMainGrid(lmgMasterDatabase);
        gridNode.classList.remove("grid-hidden");
    }, 200);
}

function injectItemToCartMemory(productId) {
    // 1. Force the incoming ID to be a clean Number to bypass any JSON string bugs
    const targetId = Number(productId);
    
    const blueprintItem = lmgMasterDatabase.find(p => Number(p.id) === targetId);
    if (!blueprintItem) {
        console.error(`> CRITICAL: ID Module ${targetId} not found in database registry.`);
        alert("System Error: Inventory node mismatch.");
        return;
    }

    const sizeNode = document.getElementById(`sizeSelection_${productId}`);
    const configuredSize = sizeNode ? sizeNode.value : "Universal";
    
    const textNode = document.getElementById(`textStamp_${productId}`);
    const configuredText = textNode ? textNode.value.trim() : "";

    // 2. Build the cart layout module cleanly
    const configuredCartItem = {
        uniqueTimestampId: Date.now() + Math.random(),
        name: blueprintItem.name,
        price: Number(blueprintItem.price), // Force number conversion here too
        size: configuredSize,
        customText: configuredText
    };

    // 3. Inject straight to memory and push updates out to your UI screen
    currentShoppingCartMemory.push(configuredCartItem);
    
    // Check if your function exists before firing it to prevent any script freezes
    if (typeof refreshCartUIElements === "function") {
        refreshCartUIElements();
    }
    
    if (typeof triggerSystemToastNotification === "function") {
        triggerSystemToastNotification(`> SYSTEM_OK: [${blueprintItem.name.toUpperCase()}] ENGAGED`);
    } else {
        alert(`> SYSTEM_OK: [${blueprintItem.name}] added to cart.`);
    }
}

function exciseItemFromCartMemory(uniqueId) {
    currentShoppingCartMemory = currentShoppingCartMemory.filter(item => item.uniqueTimestampId !== uniqueId);
    refreshCartUIElements();
}

function refreshCartUIElements() {
    const indicator = document.getElementById("cartIndicator");
    const manifestoBox = document.getElementById("cartManifestoBox");
    const totalDisplayValue = document.getElementById("cartSubtotalValue");
    
    if (indicator) {
        indicator.innerText = "⚡ CART ACTIVE [" + currentShoppingCartMemory.length + " MODULES]";
    }

    let calculatedSum = 0;
    currentShoppingCartMemory.forEach(item => calculatedSum += item.price);
    
    if (totalDisplayValue) {
        totalDisplayValue.innerText = "GHS " + calculatedSum.toFixed(2);
    }

    if (!manifestoBox) return;

    if (currentShoppingCartMemory.length === 0) {
        manifestoBox.innerHTML = `<div class="empty-notice">> NO CORE MODULES ENGAGED IN CART.</div>`;
        return;
    }

    manifestoBox.innerHTML = "";
    currentShoppingCartMemory.forEach(item => {
        let textDetails = item.customText ? " [Stamp: " + item.customText + "]" : "";
         const rowMarkup = `
            <div class="cart-item-row">
                <div>
                    <div>⚡ <b>${item.name}</b></div>
                    <div style="color: #888; font-size: 11px; margin-top:2px;">Config: ${item.size}${textDetails}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="color: var(--cyber-green)">GHS ${item.price.toFixed(2)}</span>
                    <button class="remove-node-btn" onclick="exciseItemFromCartMemory(${item.uniqueTimestampId})">[X]</button>
                </div>
            </div>
        `;
        manifestoBox.innerHTML += rowMarkup;
    });
}

function registerGlobalFile() {
    const fileNode = document.getElementById("globalGraphic");
    const statusNode = document.getElementById("globalFileStatus");
    
    if (fileNode && fileNode.files && fileNode.files.length > 0) {
        // FIXED ARRAY ACCESSIBILITY ASSIGNMENT
        trackedGlobalFileName = fileNode.files[0].name;
        if (statusNode) {
            statusNode.innerText = "✓ DESIGN LINKED: " + trackedGlobalFileName;
        }
    } else {
        trackedGlobalFileName = "";
        if (statusNode) {
            statusNode.innerText = "";
        }
    }
}

function fireWhatsAppQuote() {
    if (currentShoppingCartMemory.length === 0) {
        alert("Your cart is empty! Add modules before executing dispatch.");
        return;
    }

    const deliveryLocation = document.getElementById("campusHub").value;
    const deliveryAddress = document.getElementById("deliveryAddress").value.trim();

    if (!deliveryAddress) {
        alert("Please provide a delivery address for logistics compliance.");
        return;
    }

    const adminWalletNumber = "233592882841";

    // --- PACKAGING THE TEXT MESSAGE DATA ---
    let messagePayload = `*LMG PRINTS & TECH - NEW ORDER INCOMING*\n`;
    messagePayload += `====================================\n\n`;
    
    currentShoppingCartMemory.forEach((item, index) => {
        let stampText = item.customText ? `\n   - Stamp Inscription: ${item.customText}` : "";
        messagePayload += `${index + 1}. *${item.name}*\n   - Config: ${item.size}${stampText}\n   - Price: GHS ${item.price.toFixed(2)}\n\n`;
    });

    let totalSum = 0;
    currentShoppingCartMemory.forEach(item => totalSum += item.price);

    // --- NEW IMAGE ATTACHMENT TRACKER LINE RIGHT HERE ---
    let fileNotificationLine = "";
    if (trackedGlobalFileName !== "") {
        fileNotificationLine = `*CUSTOM GRAPHIC ATTACHED:* 🖼️ ${trackedGlobalFileName}\n> _(Operator note: Request the customer to attach this file directly below this text block!)_\n\n`;
    }

    messagePayload += `====================================\n`;
    messagePayload += fileNotificationLine; // Injects the file notification if it exists!
    messagePayload += `*SUBTOTAL:* GHS ${totalSum.toFixed(2)}\n`;
    messagePayload += `*LOGISTICS HUB:* ${deliveryLocation}\n`;
    messagePayload += `*DELIVERY ADDRESS:* ${deliveryAddress}\n`;

    const encodedText = encodeURIComponent(messagePayload);
    window.open(`https://wa.me/${adminWalletNumber}?text=${encodedText}`, '_blank');
    window.location.href = whatsappURL;
}

function completelyClearCartMemory() {
    currentShoppingCartMemory = [];
    refreshCartUIElements();
}

function switchProductMainViewImage(productId, newImageSrc) {
    const mainImgNode = document.getElementById(`mainImage_${productId}`);
    if (mainImgNode) {
        mainImgNode.src = newImageSrc;
    }
}

function firePlainTextFallback(event) {
    event.preventDefault(); // Prevents the webpage from jumping around

    if (currentShoppingCartMemory.length === 0) {
        alert("CRITICAL ERROR: Your inquiry manifesto is empty. Cannot compile telemetry data nodes.");
        return;
    }

    const deliveryLocation = document.getElementById("campusHub").value;
    const deliveryAddress = document.getElementById("deliveryAddress").value.trim();

    if (!deliveryAddress) {
        alert("CRITICAL ERROR: Dispatch address required for logistics compilation.");
        return;
    }

    // Compile the shopping cart memory matrix array into text strings
    let payload = `--- LMG PRINTS & TECH INVOICE DATA ---\n`;
    currentShoppingCartMemory.forEach((item, index) => {
        let stampText = item.customText ? ` | STAMP: ${item.customText}` : "";
        payload += `[${index + 1}] MODULE: ${item.name} | CONFIG: ${item.size}${stampText} | GHS ${item.price.toFixed(2)}\n`;
    });
    
    let totalSum = 0;
    currentShoppingCartMemory.forEach(item => totalSum += item.price);
    // Inside firePlainTextFallback() right before the subtotal lines:
    let fileNotificationLine = trackedGlobalFileName !== "" ? `CUSTOM GRAPHIC TRACE: ${trackedGlobalFileName}\n` : "";

    payload += `--------------------------------------\n`;
    payload += fileNotificationLine; // Injects the filename into the popup box
    payload += `--------------------------------------\n`;
    payload += `ESTIMATED TOTAL CONFIG: GHS ${totalSum.toFixed(2)}\n`;
    payload += `LOGISTICS REGION HUB: ${deliveryLocation}\n`;
    payload += `DELIVERY COORDINATES: ${deliveryAddress}\n\n`;
    payload += `>> COPY THIS DATA BLOCK & EMAIL TO: support@lmgprintstech.space`;

    // Pop up a system input box containing the pre-selected text receipt
    window.prompt("COPY YOUR SYSTEM ORDER MANIFESTO BELOW AND EMAIL OR TEXT IT TO THE LOGISTICS OPERATOR:", payload);
}

// Opens the overlay matrix and updates the source link to the active image clicked
function openImageEnlargeNode(imageSourceString) {
    const modalNode = document.getElementById("imageEnlargeModal");
    const targetImgNode = document.getElementById("zoomedImageTarget");
    
    if (modalNode && targetImgNode) {
        targetImgNode.src = imageSourceString;
        modalNode.style.display = "flex"; // Changes from none to display flex to reveal it
    }
}

// Shuts down the overlay grid view
function closeImageEnlargeNode() {
    const modalNode = document.getElementById("imageEnlargeModal");
    if (modalNode) {
        modalNode.style.display = "none";
    }
}

// Fires a contextual notification toast to track action compliance
function triggerSystemToastNotification(customMessageText) {
    const toastContainer = document.getElementById("cyberToastBox");
    const toastTextNode = document.getElementById("cyberToastMessage");

    if (toastContainer && toastTextNode) {
        // 1. Update text string inside container node dynamically
        toastTextNode.innerText = customMessageText;
        
        // 2. Add structural display token class to activate CSS visibility and animation
        toastContainer.classList.add("show-alert");

        // 3. Clear the alert out automatically after 2500ms cycle runs out
        setTimeout(() => {
            toastContainer.classList.remove("show-alert");
        }, 2500);
    }
}

// This variable sits at the top or bottom of your file to track the filename
let trackedGlobalFileName = "";

function registerGlobalFile() {
    const fileInputElement = document.getElementById("globalGraphic");
    const statusTextDisplay = document.getElementById("globalFileStatus");

    if (fileInputElement && fileInputElement.files.length > 0) {
        // 1. Grab the name of the uploaded image file
        const selectedFile = fileInputElement.files[0];
        trackedGlobalFileName = selectedFile.name;

        // 2. Display a high-tech success status to the user on the screen layout
        if (statusTextDisplay) {
            statusTextDisplay.innerText = `> LOGISTICS_OK: MEMORY LINKED [${trackedGlobalFileName.toUpperCase()}]`;
            statusTextDisplay.style.color = "#00ff66"; // Vivid cyber green alert text
        }
    } else {
        trackedGlobalFileName = "";
        if (statusTextDisplay) {
            statusTextDisplay.innerText = "";
        }
    }
}