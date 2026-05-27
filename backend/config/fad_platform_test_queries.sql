-- ===================================================
-- TEST QUERIES FOR YOUR FAD PLATFORM DATABASE
-- Copy and paste these one by one to test your database
-- ===================================================

-- 1. View all your tables
SHOW TABLES;

-- 2. Check your admin user
SELECT id, username, full_name, email, role, created_at 
FROM admin_users;

-- 3. View sample users
SELECT id, name, email, phone, status, current_balance, total_earned, ads_watched_count
FROM users;

-- 4. Check facilities (advertisers)
SELECT id, name, business_type, contact_person, email, status, total_spent
FROM facilities;

-- 5. View ad campaigns
SELECT id, title, ad_type, budget, spent_amount, actual_views, target_views, status
FROM ad_campaigns;

-- 6. Check transactions
SELECT id, transaction_id, type, amount, payment_method, status, description
FROM transactions;

-- 7. View system settings
SELECT setting_key, setting_value, description, category
FROM system_settings
ORDER BY category, setting_key;

-- 8. Test the dashboard summary view
SELECT * FROM user_dashboard_summary;

-- 9. Check campaign performance view
SELECT * FROM campaign_performance;

-- 10. Count records in each table
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'Facilities', COUNT(*) FROM facilities
UNION ALL
SELECT 'Ad Campaigns', COUNT(*) FROM ad_campaigns
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'System Settings', COUNT(*) FROM system_settings;