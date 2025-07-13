<?php
/**
 * Custom PrivateBin Template
 * Based on bootstrap5 template with enterprise additions
 */

// Get user information from headers (set by auth proxy)
$user_email = $_SERVER['REMOTE_EMAIL'] ?? '';
$user_name = $_SERVER['REMOTE_USER'] ?? '';
$user_groups = $_SERVER['REMOTE_GROUPS'] ?? '';

// Include the base template and extend it
$base_template = file_get_contents('/srv/tpl/bootstrap5-dark.php');

// Inject custom elements
$custom_head = '
    <!-- Custom Theme -->
    <link rel="stylesheet" href="/custom-theme/css/custom.css">
    <link rel="icon" type="image/x-icon" href="/custom-theme/img/favicon.ico">
    <meta name="user-email" content="' . htmlspecialchars($user_email) . '">
    <meta name="user-name" content="' . htmlspecialchars($user_name) . '">
    
    <!-- Analytics (optional) -->
    <!--
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("js", new Date());
        gtag("config", "GA_MEASUREMENT_ID");
    </script>
    -->
';

$custom_navbar = '
    <img src="/custom-theme/img/logo.png" alt="Company Logo">
';

$custom_footer = '
    <script src="/custom-theme/js/custom.js"></script>
    <footer>
        <p>&copy; ' . date('Y') . ' Your Company Name. All rights reserved.</p>
        <p><small>For support, contact: <a href="mailto:it-support@company.com">it-support@company.com</a></small></p>
    </footer>
';

// Replace placeholders in base template
$base_template = str_replace('</head>', $custom_head . '</head>', $base_template);
$base_template = str_replace('<span class="navbar-brand">', '<span class="navbar-brand">' . $custom_navbar, $base_template);
$base_template = str_replace('</body>', $custom_footer . '</body>', $base_template);

// Output the modified template
echo $base_template;