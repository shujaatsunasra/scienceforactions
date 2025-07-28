-- Autonomous Evolution System Database Schema Updates
-- This file creates tables to support the autonomous evolution, SEO, and monitoring systems

-- Evolution metrics table for tracking system health and performance
CREATE TABLE IF NOT EXISTS evolution_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value JSONB NOT NULL,
    system_component VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard snapshots for storing evolution dashboard state
CREATE TABLE IF NOT EXISTS dashboard_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    system_status JSONB NOT NULL,
    metrics_data JSONB NOT NULL,
    user_behavior_data JSONB DEFAULT '{}',
    performance_data JSONB DEFAULT '{}',
    error_count INTEGER DEFAULT 0,
    active_fixes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sitemap data for SEO engine
CREATE TABLE IF NOT EXISTS sitemap_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url VARCHAR(500) NOT NULL UNIQUE,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    change_frequency VARCHAR(20) DEFAULT 'weekly',
    priority DECIMAL(2,1) DEFAULT 0.5,
    content_type VARCHAR(50) DEFAULT 'page',
    meta_title TEXT,
    meta_description TEXT,
    tags JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User behavior tracking for emotion-aware UI
CREATE TABLE IF NOT EXISTS user_behavior_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_info JSONB DEFAULT '{}',
    engagement_score DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System health monitoring
CREATE TABLE IF NOT EXISTS system_health_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    component VARCHAR(50) NOT NULL,
    health_status VARCHAR(20) NOT NULL,
    response_time INTEGER, -- in milliseconds
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    details JSONB DEFAULT '{}',
    auto_fixed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-generated fixes log
CREATE TABLE IF NOT EXISTS autonomous_fixes_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    issue_type VARCHAR(100) NOT NULL,
    issue_description TEXT NOT NULL,
    fix_applied TEXT NOT NULL,
    component_affected VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    success BOOLEAN DEFAULT TRUE,
    execution_time INTEGER, -- in milliseconds
    before_state JSONB DEFAULT '{}',
    after_state JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_evolution_metrics_timestamp ON evolution_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_evolution_metrics_component ON evolution_metrics(system_component);
CREATE INDEX IF NOT EXISTS idx_dashboard_snapshots_date ON dashboard_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_sitemap_data_url ON sitemap_data(url);
CREATE INDEX IF NOT EXISTS idx_sitemap_data_status ON sitemap_data(status);
CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON user_behavior_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_session ON user_behavior_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_timestamp ON user_behavior_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_health_component ON system_health_log(component);
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_autonomous_fixes_timestamp ON autonomous_fixes_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_autonomous_fixes_component ON autonomous_fixes_log(component_affected);

-- Add RLS (Row Level Security) policies
ALTER TABLE evolution_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE sitemap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_fixes_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read evolution metrics and system status
CREATE POLICY IF NOT EXISTS "Allow authenticated users to read evolution metrics" ON evolution_metrics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to read dashboard snapshots" ON dashboard_snapshots
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow public read access to sitemap data" ON sitemap_data
    FOR SELECT USING (TRUE);

-- Allow users to read their own behavior tracking data
CREATE POLICY IF NOT EXISTS "Users can read their own behavior data" ON user_behavior_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- Allow system components to insert data
CREATE POLICY IF NOT EXISTS "System can insert evolution metrics" ON evolution_metrics
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "System can insert dashboard snapshots" ON dashboard_snapshots
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "System can insert sitemap data" ON sitemap_data
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "System can insert user behavior data" ON user_behavior_tracking
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "System can insert health logs" ON system_health_log
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "System can insert fixes logs" ON autonomous_fixes_log
    FOR INSERT WITH CHECK (TRUE);

-- Allow system updates
CREATE POLICY IF NOT EXISTS "System can update evolution metrics" ON evolution_metrics
    FOR UPDATE USING (TRUE);

CREATE POLICY IF NOT EXISTS "System can update sitemap data" ON sitemap_data
    FOR UPDATE USING (TRUE);

-- Create views for easy data access
CREATE OR REPLACE VIEW system_health_overview AS
SELECT 
    component,
    health_status,
    AVG(response_time) as avg_response_time,
    COUNT(*) as total_checks,
    SUM(error_count) as total_errors,
    MAX(timestamp) as last_check
FROM system_health_log 
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY component, health_status
ORDER BY component, health_status;

CREATE OR REPLACE VIEW recent_autonomous_fixes AS
SELECT 
    timestamp,
    issue_type,
    component_affected,
    severity,
    success,
    execution_time
FROM autonomous_fixes_log 
WHERE timestamp > NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC
LIMIT 100;

-- Functions for autonomous system operations
CREATE OR REPLACE FUNCTION log_system_health(
    p_component VARCHAR(50),
    p_status VARCHAR(20),
    p_response_time INTEGER DEFAULT NULL,
    p_error_count INTEGER DEFAULT 0,
    p_details JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    health_id UUID;
BEGIN
    INSERT INTO system_health_log (
        component, health_status, response_time, error_count, details
    ) VALUES (
        p_component, p_status, p_response_time, p_error_count, p_details
    ) RETURNING id INTO health_id;
    
    RETURN health_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_autonomous_fix(
    p_issue_type VARCHAR(100),
    p_issue_description TEXT,
    p_fix_applied TEXT,
    p_component_affected VARCHAR(100),
    p_severity VARCHAR(20) DEFAULT 'medium',
    p_success BOOLEAN DEFAULT TRUE,
    p_execution_time INTEGER DEFAULT NULL,
    p_before_state JSONB DEFAULT '{}',
    p_after_state JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    fix_id UUID;
BEGIN
    INSERT INTO autonomous_fixes_log (
        issue_type, issue_description, fix_applied, component_affected,
        severity, success, execution_time, before_state, after_state
    ) VALUES (
        p_issue_type, p_issue_description, p_fix_applied, p_component_affected,
        p_severity, p_success, p_execution_time, p_before_state, p_after_state
    ) RETURNING id INTO fix_id;
    
    RETURN fix_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_evolution_metrics_updated_at 
    BEFORE UPDATE ON evolution_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sitemap_data_updated_at 
    BEFORE UPDATE ON sitemap_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initial data for sitemap
INSERT INTO sitemap_data (url, change_frequency, priority, content_type, meta_title, meta_description) VALUES
('/action', 'daily', 0.9, 'tool', 'AI Action Tool | Science for Action', 'Use our AI-powered action tool to find science-driven causes and take meaningful action in your community.'),
('/explore', 'daily', 0.8, 'discovery', 'Explore Science Causes | Science for Action', 'Discover and explore science-driven causes, campaigns, and movements worldwide.'),
('/profile', 'weekly', 0.6, 'user', 'Your Profile | Science for Action', 'Manage your profile, track your impact, and connect with the science community.'),
('/admin', 'weekly', 0.3, 'admin', 'Admin Dashboard | Science for Action', 'Administrative dashboard for platform management and analytics.'),
('/main', 'daily', 0.7, 'main', 'Science for Action | Community Hub', 'Join the Science for Action community hub and make a difference through science-driven action.')
ON CONFLICT (url) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Final optimization
ANALYZE evolution_metrics;
ANALYZE dashboard_snapshots;
ANALYZE sitemap_data;
ANALYZE user_behavior_tracking;
ANALYZE system_health_log;
ANALYZE autonomous_fixes_log;
