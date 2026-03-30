-- Insert Challenge if not exists
INSERT INTO public.challenges (slug, title, start_date, end_date)
VALUES ('seca-tudo-21d', 'Seca Tudo 21D', NOW(), NOW() + INTERVAL '21 days')
ON CONFLICT (slug) DO NOTHING;

-- RPC to update points
CREATE OR REPLACE FUNCTION public.update_participant_points(p_participant_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.challenge_participants
    SET total_points = (
        SELECT COALESCE(SUM(points_earned), 0)
        FROM public.challenge_activities
        WHERE participant_id = p_participant_id
    )
    WHERE id = p_participant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
