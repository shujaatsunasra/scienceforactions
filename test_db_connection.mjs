import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Testing Supabase Connection...');
console.log('URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('Key:', supabaseKey ? 'SET' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    console.log('\n📊 Testing basic connection...');
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, interests, preferred_causes, contribution_stats')
      .limit(3);
    
    if (error) {
      console.error('❌ Database Error:', error);
      return;
    }
    
    console.log('✅ Database connected successfully');
    console.log('📋 Sample user profiles:', data?.length || 0, 'records');
    
    if (data && data.length > 0) {
      console.log('\n🔍 Sample record structure:');
      console.log(JSON.stringify(data[0], null, 2));
    }
    
    // Test action_items table
    console.log('\n📊 Testing action_items table...');
    const { data: actions, error: actionsError } = await supabase
      .from('action_items')
      .select('id, title, category, difficulty, impact_level')
      .limit(3);
    
    if (actionsError) {
      console.error('❌ Action Items Error:', actionsError);
    } else {
      console.log('✅ Action items table accessible');
      console.log('📋 Sample actions:', actions?.length || 0, 'records');
      
      if (actions && actions.length > 0) {
        console.log('\n🔍 Sample action structure:');
        console.log(JSON.stringify(actions[0], null, 2));
      }
    }
    
  } catch (err) {
    console.error('💥 Connection failed:', err);
  }
}

testDatabase();
