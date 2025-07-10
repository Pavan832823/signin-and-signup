const { jsPDF } = window.jspdf;
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const toastNotification = document.querySelector('.toast-notification');
const fileNameElement = document.querySelector('.file-name');
const fileSizeElement = document.querySelector('.file-size');
const filePreview = document.querySelector('.file-preview');
const deleteBtn = document.querySelector('.delete-btn');

let selectedFile = null;

// Initialize with animations
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        showToast('✨ Drag & drop your images here!');
    }, 1000);
});

// File selection handler
fileInput.addEventListener('change', handleFileSelect);

// Drop zone click handler
dropZone.addEventListener('click', () => fileInput.click());

// Drag and drop handlers
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlightDropZone, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlightDropZone, false);
});

dropZone.addEventListener('drop', handleDrop, false);

// Convert button handler
convertBtn.addEventListener('click', convertToPDF);

// Delete button handler
deleteBtn.addEventListener('click', clearFile);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlightDropZone() {
    dropZone.classList.add('drag-over');
    dropZone.classList.add('active');
}

function unhighlightDropZone() {
    dropZone.classList.remove('drag-over');
    dropZone.classList.remove('active');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length) {
        fileInput.files = files;
        handleFileSelect({ target: fileInput });
    }
}

function handleFileSelect(e) {
    selectedFile = e.target.files[0];
    
    if (selectedFile) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(selectedFile.type)) {
            showToast('❌ Please upload a valid image file (JPG, PNG, WEBP)', 'error');
            return;
        }
        
        // Update UI
        fileNameElement.textContent = selectedFile.name;
        fileSizeElement.textContent = formatFileSize(selectedFile.size);
        filePreview.classList.add('show');
        
        showToast('📄 Image loaded successfully!', 'success');
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function convertToPDF() {
    if (!selectedFile) {
        showToast('⚠️ Please select an image first!', 'warning');
        return;
    }
    
    // Show loading state
    convertBtn.classList.add('loading');
    
    setTimeout(() => {
        const pdf = new jsPDF();
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.src = e.target.result;
            
            img.onload = function() {
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (img.height * imgWidth) / img.width;
                
                pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
                
                // Generate filename
                const fileName = selectedFile.name.split('.')[0] + '.pdf';
                
                // Save PDF
                pdf.save(fileName);
                
                // Reset button state
                convertBtn.classList.remove('loading');
                
                // Show success message
                showToast('✅ PDF created successfully!', 'success');
                
                // Celebrate!
                triggerConfetti();
            }
        }
        
        reader.readAsDataURL(selectedFile);
    }, 800); // Small delay for better UX
}

function clearFile() {
    fileInput.value = '';
    selectedFile = null;
    fileNameElement.textContent = 'No file selected';
    fileSizeElement.textContent = '-';
    filePreview.classList.remove('show');
    showToast('🗑️ File removed', 'info');
}

function showToast(message, type = 'info') {
    // Set icon based on type
    let icon;
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    // Update toast content
    document.querySelector('.toast-icon').innerHTML = icon;
    document.querySelector('.toast-message').textContent = message;
    
    // Set color based on type
    const colors = {
        success: '#4cc9f0',
        error: '#ef233c',
        warning: '#f8961e',
        info: '#4361ee'
    };
    
    document.querySelector('.toast-icon').style.color = colors[type];
    document.querySelector('.toast-progress').style.background = `linear-gradient(90deg, ${colors[type]}, ${type === 'success' ? '#3a0ca3' : '#f72585'})`;
    
    // Show toast
    toastNotification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4361ee', '#3a0ca3', '#f72585', '#4cc9f0']
    });
}