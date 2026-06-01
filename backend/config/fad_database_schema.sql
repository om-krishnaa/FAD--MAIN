-- ===================================================
-- FAD PLATFORM DATABASE SETUP
-- Copy and paste this entire script into MySQL Workbench
-- Then click the Execute button (lightning bolt ⚡)
-- ===================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS fad_platform 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE fad_platform;

-- ===================================================
-- 1. USERS TABLE (End Users)
-- ===================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user','moderator', 'admin','super_admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_expires_at TIMESTAMP NULL,
    reset_token VARCHAR(100),
    reset_token_expires_at TIMESTAMP NULL,
    status ENUM('active', 'suspended', 'pending', 'blocked') DEFAULT 'active',
    current_balance DECIMAL(10, 2) DEFAULT 0.00,
    total_earned DECIMAL(10, 2) DEFAULT 0.00,
    referals_earned DECIMAL(10, 2) DEFAULT 0.00,
    ads_watched_count INT DEFAULT 0,
    last_active_at TIMESTAMP NULL,
    ip_address VARCHAR(45),
    device_fingerprint VARCHAR(255),
    profile_picture VARCHAR(500),
    bio TEXT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_ip_address (ip_address),
    INDEX idx_verification_code (verification_code),
    INDEX idx_last_active (last_active_at)
);

-- ===================================================
-- 4. AD CAMPAIGNS TABLE
-- ===================================================
CREATE TABLE ad_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    facility_name VARCHAR(200) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ad_type ENUM('image', 'video') NOT NULL,
    content_url VARCHAR(1000) NOT NULL,
    file_size BIGINT,
    duration INT,
    dimensions VARCHAR(20),
    budget DECIMAL(10, 2) NOT NULL,
    spent_amount DECIMAL(10, 2) DEFAULT 0.00,
    cost_per_view DECIMAL(5, 2) DEFAULT 1.00,
    target_views INT,
    actual_views INT DEFAULT 0,
    click_through_rate DECIMAL(5, 2) DEFAULT 0.00,
    completion_rate DECIMAL(5, 2) DEFAULT 0.00,
    status ENUM('active', 'paused', 'completed', 'draft') DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    created_by INT,
    
    -- transaction-related columns merged here
    payment_method VARCHAR(20) CHECK (payment_method IN ('esewa', 'khalti','admin_approved')),
    transaction_amount DECIMAL(10, 2),
    transaction_status VARCHAR(20) DEFAULT 'pending' CHECK (transaction_status IN ('pending', 'requested', 'approved', 'rejected')),
    transaction_code VARCHAR(100) UNIQUE DEFAULT NULL,
    approved_by INT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_ad_type (ad_type),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date)
);


-- ===================================================
-- 5. USER AD VIEWS TABLE
-- ===================================================
CREATE TABLE user_ad_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    campaign_id INT NOT NULL,
    view_duration INT NOT NULL,
    full_duration INT NOT NULL,
    completion_percentage DECIMAL(5, 2) DEFAULT 0.00,
    device_type VARCHAR(50),
    ip_address VARCHAR(45),
    is_completed BOOLEAN DEFAULT FALSE,
    earnings DECIMAL(8, 2) DEFAULT 0.00,
    is_paid BOOLEAN DEFAULT FALSE,
    view_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_ad_date (user_id, campaign_id, view_date),
    INDEX idx_user_id (user_id),
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_view_date (view_date),
    INDEX idx_is_completed (is_completed),
    INDEX idx_is_paid (is_paid)
);

-- ===================================================
-- 6. PAYMENTS/TRANSACTIONS TABLE
-- ===================================================
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NULL,
    user_id INT,
    type ENUM('payout', 'revenue', 'refund', 'bonus') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NPR',
    payment_method ENUM('esewa', 'khalti','admin_approved', 'bank_transfer', 'digital_wallet') NOT NULL,
    payment_reference VARCHAR(200),
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    description TEXT,
    processed_by INT,
    processed_at TIMESTAMP NULL,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_payment_method (payment_method),
    INDEX idx_created_at (created_at)
);

-- ===================================================
-- 7. ANALYTICS DATA TABLE
-- ===================================================
CREATE TABLE analytics_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    metric_type ENUM('daily_views', 'daily_users', 'daily_revenue', 'campaign_performance') NOT NULL,
    campaign_id INT,
    user_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0.00,
    avg_completion_rate DECIMAL(5, 2) DEFAULT 0.00,
    avg_ctr DECIMAL(5, 2) DEFAULT 0.00,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (campaign_id) REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_date_metric_campaign (date, metric_type, campaign_id),
    INDEX idx_date (date),
    INDEX idx_metric_type (metric_type),
    INDEX idx_campaign_id (campaign_id)
);

-- ===================================================
-- 8. SECURITY ALERTS TABLE
-- ===================================================
CREATE TABLE security_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_type ENUM('warning', 'error', 'info', 'critical') NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    user_id INT,
    ip_address VARCHAR(45),
    status ENUM('pending', 'resolved', 'dismissed') DEFAULT 'pending',
    resolved_by INT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_alert_type (alert_type),
    INDEX idx_status (status),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- ===================================================
-- 9. BLOCKED USERS TABLE
-- ===================================================
CREATE TABLE blocked_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reason TEXT NOT NULL,
    blocked_by INT NOT NULL,
    is_permanent BOOLEAN DEFAULT FALSE,
    unblock_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_blocked_by (blocked_by),
    INDEX idx_is_permanent (is_permanent)
);

-- ===================================================
-- 10. SYSTEM SETTINGS TABLE
-- ===================================================
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    description TEXT NULL,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO system_settings (setting_key, setting_value, description, category) VALUES
('platform_name', 'FAD', 'Name of the platform', 'general'),
('platform_description', 'Followers Advertisement Platform', 'Short platform description', 'general'),
('default_currency', 'NPR', 'Primary currency symbol or code', 'general'),
('timezone', 'Asia/Kathmandu', 'System operational timezone', 'general'),
('daily_ad_limit', '20', 'Maximum ads a single user can watch daily', 'ads'),
('min_view_duration', '15', 'Minimum seconds required to claim reward', 'ads'),
('cost_per_view', '1.00', 'Default base reward per valid view', 'ads'),
('ip_tracking_enabled', 'TRUE', 'Enable/Disable tracking IP access history', 'security'),
('multiple_account_detection', 'TRUE', 'Check device signatures for multi-accounts', 'security'),
('two_factor_auth', 'FALSE', 'Enforce 2FA checks globally', 'security'),
('login_notification', 'FALSE', 'Send alerts on strange login locations', 'security'),
('anti_fraud_detection', 'TRUE', 'Enable automatic context fraud algorithms', 'security'),
('api_rate_limit', '1000', 'Maximum requests permitted per window frame', 'security'),
('session_timeout', '30', 'Inactivity timeout duration in minutes', 'security'),
('backup_frequency', 'daily', 'Automated backup structural intervals', 'maintenance'),
('maintenance_mode', 'FALSE', 'Take application completely offline for users', 'maintenance');



CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL,          
    file_path VARCHAR(1000),
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'generating',   
    date_range_start DATE,
    date_range_end DATE,
    generated_by INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_report_type (report_type),
    INDEX idx_status (status),
    INDEX idx_generated_by (generated_by),
    INDEX idx_generated_at (generated_at)
);



CREATE TABLE notification_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT TRUE,
    security_alerts BOOLEAN DEFAULT TRUE,
    payment_notifications BOOLEAN DEFAULT TRUE,
    system_updates BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referred_by INT NOT NULL,
    new_user_id INT NOT NULL,
    earned_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_referrals_referred_by FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_referrals_new_user FOREIGN KEY (new_user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_referral (referred_by, new_user_id)
);




INSERT INTO notification_preferences (
    email_notifications,
    security_alerts,
    payment_notifications,
    system_updates
) VALUES (
    TRUE,
    TRUE,
    TRUE,
    FALSE
);




