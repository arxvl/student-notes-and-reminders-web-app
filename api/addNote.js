import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { note } = req.body;
        if (!note) return res.status(400).json({ error: 'Note is required' });

        const { data, error } = await supabase.from('notes').insert([{ note }]);
        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ message: 'Note added!', note: data[0] });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
