import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id, title, content, category, reminderDate, isCompleted } = req.body;
        const { error } = await supabase.from('notes').update({ title, content, category, reminderDate, isCompleted }).eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: 'Note updated!' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}