import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('notes').select('*').order('id', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
