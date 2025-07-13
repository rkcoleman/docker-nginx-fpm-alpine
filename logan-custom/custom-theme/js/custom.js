// Custom PrivateBin Extensions

(function () {
    'use strict';

    // Wait for PrivateBin to initialize
    document.addEventListener('DOMContentLoaded', function () {
        // Add user info to navbar if available
        const userEmail = document.querySelector('meta[name="user-email"]')?.content;
        const userName = document.querySelector('meta[name="user-name"]')?.content;

        if (userEmail || userName) {
            const navbar = document.querySelector('.navbar');
            const userInfo = document.createElement('div');
            userInfo.className = 'user-info';
            userInfo.innerHTML = `
                <i class="fas fa-user-circle"></i>
                ${userName || userEmail}
            `;
            navbar.appendChild(userInfo);
        }

        // Add company-specific features
        addCustomFeatures();

        // Track usage (if analytics enabled)
        if (window.gtag) {
            trackUsage();
        }
    });

    function addCustomFeatures() {
        // Add quick templates dropdown
        const templateDropdown = createTemplateDropdown();
        const buttonGroup = document.querySelector('#formatter').parentElement;
        if (buttonGroup && templateDropdown) {
            buttonGroup.appendChild(templateDropdown);
        }

        // Add copy notification enhancement
        enhanceCopyNotifications();

        // Add keyboard shortcuts
        addKeyboardShortcuts();
    }

    function createTemplateDropdown() {
        const templates = [
            { name: 'Meeting Notes', content: '## Meeting Notes\n\n**Date:** \n**Attendees:** \n\n### Agenda\n1. \n\n### Discussion\n\n### Action Items\n- [ ] ' },
            { name: 'Code Review', content: '## Code Review\n\n**File/PR:** \n**Reviewer:** \n\n### Issues Found\n1. \n\n### Suggestions\n- \n\n### Overall Assessment\n' },
            { name: 'Incident Report', content: '## Incident Report\n\n**Date:** \n**Severity:** \n**Reporter:** \n\n### Description\n\n### Impact\n\n### Resolution\n\n### Follow-up Actions\n- [ ] ' }
        ];

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown d-inline-block ms-2';
        dropdown.innerHTML = `
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-file-alt"></i> Templates
            </button>
            <ul class="dropdown-menu">
                ${templates.map(t => `<li><a class="dropdown-item template-item" href="#" data-template="${btoa(t.content)}">${t.name}</a></li>`).join('')}
            </ul>
        `;

        // Add click handlers
        setTimeout(() => {
            dropdown.querySelectorAll('.template-item').forEach(item => {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    const template = atob(this.dataset.template);
                    const messageElement = document.querySelector('#message');
                    if (messageElement) {
                        messageElement.value = template;
                        messageElement.dispatchEvent(new Event('input'));
                    }
                });
            });
        }, 100);

        return dropdown;
    }

    function enhanceCopyNotifications() {
        // Override the copy function to show better notifications
        const originalCopy = window.copyToClipboard;
        if (originalCopy) {
            window.copyToClipboard = function (text) {
                const result = originalCopy.apply(this, arguments);
                if (result) {
                    showNotification('Copied to clipboard!', 'success');
                }
                return result;
            };
        }
    }

    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function (e) {
            // Ctrl/Cmd + Enter to send
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const sendButton = document.querySelector('#sendbutton');
                if (sendButton && !sendButton.disabled) {
                    sendButton.click();
                }
            }

            // Ctrl/Cmd + S to create new
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const newButton = document.querySelector('#newbutton');
                if (newButton) {
                    newButton.click();
                }
            }
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
        notification.style.zIndex = '9999';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function trackUsage() {
        // Track paste creation
        const sendButton = document.querySelector('#sendbutton');
        if (sendButton) {
            sendButton.addEventListener('click', function () {
                gtag('event', 'paste_created', {
                    'event_category': 'engagement'
                });
            });
        }
    }
})();