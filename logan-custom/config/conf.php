<?php
/**
 * Custom PrivateBin configuration with enterprise features
 */

// Main configuration
[main]
; Basic settings
name = "SecurePaste"
basepath = "/"
discussion = true
opendiscussion = false
password = true
fileupload = true
burnafterreadingselected = false
defaultformatter = "syntaxhighlighting"
sizelimit = 10485760
template = "bootstrap5-custom"
info = "Powered by IT Department - Internal Use Only"
notice = "All pastes are subject to company data policies"

; Custom expiration times for business use
[expire]
5min = 300
10min = 600
1hour = 3600
1day = 86400
1week = 604800
1month = 2592000
3months = 7776000
never = 0

[traffic]
; Less restrictive for internal use
limit = 50
header = "X_FORWARDED_FOR"

[purge]
limit = 300
batchsize = 10

[model]
class = "Database"

[model_options]
; PostgreSQL configuration
dsn = "pgsql:host=${STORAGE_HOST};port=5432;dbname=${STORAGE_CONTAINER}"
usr = "${STORAGE_LOGIN}"
pwd = "${STORAGE_PASSWORD}"
opt[12] = true ; PDO::ATTR_PERSISTENT

; Custom table prefix for multi-tenant scenarios
tbl = "${PRIVATEBIN_TABLE_PREFIX:privatebin_}"

; Additional security headers
[security]
; Content Security Policy
cspheader = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'"

; Custom authentication integration
[authentication]
; Enable user tracking (requires auth proxy)
enabled = true
; Log user actions
audit_log = true
; Restrict certain features by group
admin_groups = "privatebin-admins,it-security"