// Main JavaScript for OMEGAMON z/OS Deployment Guide

// Global variables
let currentStep = 1;
let totalSteps = 14;
let completedSteps = [];
let searchIndex = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeDeploymentTracker();
    initializeTroubleshooting();
    initializeInteractiveElements();
    buildSearchIndex();
    console.log('OMEGAMON z/OS Deployment Guide initialized');
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 120;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                updateActiveNavLink(this);
                
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    window.addEventListener('scroll', updateNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const activeLink = document.querySelector('a[href="#' + sectionId + '"]');
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
}

function buildSearchIndex() {
    const sections = document.querySelectorAll('section');
    searchIndex = [];
    
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const sectionTitle = section.querySelector('h2, h3');
        const titleText = sectionTitle ? sectionTitle.textContent : '';
        const sectionContent = section.textContent || '';
        
        if (sectionId && titleText) {
            searchIndex.push({
                id: sectionId,
                title: titleText,
                content: sectionContent.toLowerCase(),
                url: '#' + sectionId
            });
        }
    });
}

function performSearch(query) {
    if (!query || query.length < 2) {
        hideSearchResults();
        return;
    }
    
    const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.includes(query.toLowerCase())
    ).slice(0, 5);
    
    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    let resultsContainer = document.getElementById('search-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        resultsContainer.className = 'search-results';
        document.getElementById('search-input').parentNode.appendChild(resultsContainer);
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        resultsContainer.innerHTML = results.map(result => 
            '<div class="search-result-item" onclick="navigateToSection(\'' + result.id + '\')">' +
            '<div class="font-semibold">' + highlightText(result.title, query) + '</div>' +
            '</div>'
        ).join('');
    }
    
    resultsContainer.style.display = 'block';
}

function hideSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

function highlightText(text, query) {
    const regex = new RegExp('(' + query + ')', 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function navigateToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 120;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        hideSearchResults();
    }
}

// Deployment progress tracking
function initializeDeploymentTracker() {
    updateProgressDisplay();
    
    const deploymentSteps = document.querySelectorAll('.deployment-step');
    deploymentSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            toggleStepCompletion(index + 1);
        });
    });
}

function updateProgressDisplay() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar && progressText) {
        const completionPercentage = (completedSteps.length / totalSteps) * 100;
        progressBar.style.width = completionPercentage + '%';
        progressText.textContent = 'Step ' + currentStep + ' of ' + totalSteps + ' (' + completedSteps.length + ' completed)';
    }
}

function markStepComplete(stepNumber) {
    if (!completedSteps.includes(stepNumber)) {
        completedSteps.push(stepNumber);
        
        const stepElement = document.querySelector('[data-step="' + stepNumber + '"]');
        if (stepElement) {
            stepElement.classList.add('completed');
            const stepNumberElement = stepElement.querySelector('.w-8.h-8');
            if (stepNumberElement) {
                stepNumberElement.classList.remove('bg-gray-300', 'text-gray-600');
                stepNumberElement.classList.add('bg-green-500', 'text-white');
            }
        }
        
        if (stepNumber === currentStep && currentStep < totalSteps) {
            currentStep++;
            activateStep(currentStep);
        }
        
        updateProgressDisplay();
        showNotification('Step ' + stepNumber + ' completed!', 'success');
    }
}

function toggleStepCompletion(stepNumber) {
    if (completedSteps.includes(stepNumber)) {
        completedSteps = completedSteps.filter(step => step !== stepNumber);
        const stepElement = document.querySelector('[data-step="' + stepNumber + '"]');
        if (stepElement) {
            stepElement.classList.remove('completed');
            const stepNumberElement = stepElement.querySelector('.w-8.h-8');
            if (stepNumberElement) {
                stepNumberElement.classList.remove('bg-green-500');
                stepNumberElement.classList.add('bg-gray-300', 'text-gray-600');
            }
        }
    } else {
        markStepComplete(stepNumber);
    }
    updateProgressDisplay();
}

function toggleStepDetails(stepNumber) {
    const detailsElement = document.getElementById('step-details-' + stepNumber);
    if (detailsElement) {
        detailsElement.classList.toggle('hidden');
    }
}

function showAllSteps() {
    const allSteps = document.querySelectorAll('.deployment-step');
    allSteps.forEach((step, index) => {
        step.style.display = 'block';
        step.classList.add('fade-in');
    });
}

// Troubleshooting decision tree
function initializeTroubleshooting() {
    const troubleshootingOptions = document.querySelectorAll('.troubleshooting-option');
    troubleshootingOptions.forEach(option => {
        option.addEventListener('click', function() {
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/'([^']+)'/);
                if (match) {
                    showTroubleshootingPath(match[1]);
                }
            }
        });
    });
}

function showTroubleshootingPath(issueType) {
    const pathContainer = document.getElementById('troubleshooting-path');
    if (!pathContainer) return;
    
    let pathContent = '';
    
    switch(issueType) {
        case 'deployment':
            pathContent = '<div class="bg-white border border-gray-200 rounded-lg p-4">' +
                '<h4 class="font-semibold text-lg mb-3">Deployment Issue Resolution</h4>' +
                '<div class="space-y-3">' +
                '<div class="border-l-4 border-red-500 pl-4">' +
                '<h5 class="font-medium">Check APF Authorization</h5>' +
                '<p class="text-sm text-gray-600">Ensure TKANMOD library is APF authorized: SETPROG APF,ADD,DSN=&HLQ..TKANMOD,SMS</p>' +
                '</div>' +
                '<div class="border-l-4 border-yellow-500 pl-4">' +
                '<h5 class="font-medium">Verify Dataset Allocation</h5>' +
                '<p class="text-sm text-gray-600">Check if all required datasets are properly allocated and accessible</p>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
        case 'performance':
            pathContent = '<div class="bg-white border border-gray-200 rounded-lg p-4">' +
                '<h4 class="font-semibold text-lg mb-3">Performance Issue Resolution</h4>' +
                '<div class="space-y-3">' +
                '<div class="border-l-4 border-red-500 pl-4">' +
                '<h5 class="font-medium">Check System Resources</h5>' +
                '<p class="text-sm text-gray-600">Monitor CPU, memory, and I/O utilization patterns</p>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
        case 'connectivity':
            pathContent = '<div class="bg-white border border-gray-200 rounded-lg p-4">' +
                '<h4 class="font-semibold text-lg mb-3">Connectivity Issue Resolution</h4>' +
                '<div class="space-y-3">' +
                '<div class="border-l-4 border-red-500 pl-4">' +
                '<h5 class="font-medium">Verify VTAM Configuration</h5>' +
                '<p class="text-sm text-gray-600">Check CXEGNODE MAJORNODE activation: V NET,ACT,ID=CXEGNODE,SCOPE=ALL</p>' +
                '</div>' +
                '</div>' +
                '</div>';
            break;
    }
    
    pathContainer.innerHTML = pathContent;
    pathContainer.classList.remove('hidden');
    pathContainer.classList.add('fade-in');
}

function initializeInteractiveElements() {
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content && content.classList.contains('collapsible-content')) {
                content.classList.toggle('active');
            }
        });
    });
}

function showNotification(message, type) {
    type = type || 'info';
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 alert alert-' + type;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.classList.add('fade-in');
    }, 100);
    
    setTimeout(function() {
        notification.remove();
    }, 3000);
}

function downloadDeploymentChecklist() {
    const checklist = 'OMEGAMON z/OS Deployment Checklist\n\n' +
        '□ Step 1: Create DFDSS dump datasets on MNT1 LPAR\n' +
        '□ Step 2: FTP transfer datasets to target LPAR\n' +
        '□ Step 3: Create catalog aliases on target LPAR\n' +
        '□ Step 4: DFDSS restore essential libraries\n' +
        '□ Step 5: APF authorize TKANMOD library\n' +
        '□ Step 6: Restore OMEGAMON datasets\n' +
        '□ Step 7: Copy started tasks to PROCLIB\n' +
        '□ Step 8: APF authorize required libraries\n' +
        '□ Step 9: Define OMEGAMON subsystem\n' +
        '□ Step 10: Activate VTAM MAJORNODE\n' +
        '□ Step 11: Configure TSO authorization\n' +
        '□ Step 12: Start OMEGAMON components\n' +
        '□ Step 13: Verify product functionality\n' +
        '□ Step 14: Configure ISPF interface\n\n' +
        'System Requirements:\n' +
        '- z/OS 1 Release 8+ (Recommended: 6.2.3 Fix Pack 1+)\n' +
        '- Tivoli Management Services 6.3.0 Fix Pack 6+\n' +
        '- Storage: 1,640-2,231 cylinders depending on configuration\n\n' +
        'Generated from IBM WSC OMEGAMON Deployment Guide';

    const blob = new Blob([checklist], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omegamon-deployment-checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Deployment checklist downloaded!', 'success');
}

function downloadConfigurationTemplate() {
    const template = 'OMEGAMON z/OS Configuration Template\n\n' +
        '// Configuration Manager JCL Template\n' +
        '//S1 EXEC PGM=KCIOMEGA,REGION=0M,DYNAMNBR=256\n' +
        '//STEPLIB DD DISP=SHR,DSN=**.TKANMOD\n' +
        '//KCIFLOW DD DISP=SHR,DSN=**.TKANCUS(KFJOMEGA)\n' +
        '//KCIVARS DD *\n' +
        'ACTION              GENERATE\n' +
        'RTE_NAME            [YOUR_SYSNAME]\n' +
        'RTE_PLIB_HILEV      [YOUR_RUNTIME_HLQ]\n\n' +
        'Generated from IBM WSC OMEGAMON Deployment Guide';

    const blob = new Blob([template], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omegamon-configuration-template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Configuration template downloaded!', 'success');
}

// Make functions globally available
window.markStepComplete = markStepComplete;
window.toggleStepDetails = toggleStepDetails;
window.showAllSteps = showAllSteps;
window.showTroubleshootingPath = showTroubleshootingPath;
window.downloadDeploymentChecklist = downloadDeploymentChecklist;
window.downloadConfigurationTemplate = downloadConfigurationTemplate;
