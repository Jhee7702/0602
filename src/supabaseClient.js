// supabaseClient.js
// Supabase 클라이언트 초기화 파일입니다.
// 아래의 YOUR_SUPABASE_URL과 YOUR_SUPABASE_ANON_KEY를 본인의 Supabase 프로젝트 정보로 교체하세요.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdrgplkigjysznbpitbn.supabase.co'; // 예: https://xxxx.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcmdwbGtpZ2p5c3puYnBpdGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MjQ1NzUsImV4cCI6MjA2NDQwMDU3NX0.47IyJ2okJ9AY4xqN_IJqv3LxFa53SpBH3acC7an_hRs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 