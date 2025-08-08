/*
  # Add Sample Upcoming Matches

  1. New Data
    - Sample upcoming matches for all countries
    - Matches scheduled for the next few weeks
    - Various leagues and venues

  2. Purpose
    - Provide test data for the application
    - Enable search and filtering functionality
    - Demonstrate match prediction features
*/

-- Add sample upcoming matches
DO $$
DECLARE
    dk_id uuid;
    se_id uuid;
    no_id uuid;
    fi_id uuid;
    nl_id uuid;
    
    -- Team IDs
    fc_copenhagen_id uuid;
    brondby_id uuid;
    fc_midtjylland_id uuid;
    aik_id uuid;
    ifk_goteborg_id uuid;
    malmo_id uuid;
    rosenborg_id uuid;
    molde_id uuid;
    hjk_id uuid;
    kups_id uuid;
    ajax_id uuid;
    psv_id uuid;
BEGIN
    -- Get country IDs
    SELECT id INTO dk_id FROM countries WHERE code = 'DK';
    SELECT id INTO se_id FROM countries WHERE code = 'SE';
    SELECT id INTO no_id FROM countries WHERE code = 'NO';
    SELECT id INTO fi_id FROM countries WHERE code = 'FI';
    SELECT id INTO nl_id FROM countries WHERE code = 'NL';

    -- Get team IDs
    SELECT id INTO fc_copenhagen_id FROM teams WHERE name = 'FC Copenhagen';
    SELECT id INTO brondby_id FROM teams WHERE name = 'Brøndby IF';
    SELECT id INTO fc_midtjylland_id FROM teams WHERE name = 'FC Midtjylland';
    SELECT id INTO aik_id FROM teams WHERE name = 'AIK Stockholm';
    SELECT id INTO ifk_goteborg_id FROM teams WHERE name = 'IFK Göteborg';
    SELECT id INTO malmo_id FROM teams WHERE name = 'Malmö FF';
    SELECT id INTO rosenborg_id FROM teams WHERE name = 'Rosenborg BK';
    SELECT id INTO molde_id FROM teams WHERE name = 'Molde FK';
    SELECT id INTO hjk_id FROM teams WHERE name = 'HJK Helsinki';
    SELECT id INTO kups_id FROM teams WHERE name = 'KuPS Kuopio';
    SELECT id INTO ajax_id FROM teams WHERE name = 'Ajax Amsterdam';
    SELECT id INTO psv_id FROM teams WHERE name = 'PSV Eindhoven';

    -- Insert upcoming matches
    INSERT INTO matches (home_team_id, away_team_id, country_id, match_date, league, venue, status) VALUES
    -- Denmark - Superliga
    (fc_copenhagen_id, brondby_id, dk_id, now() + interval '2 days', 'Superliga', 'Parken Stadium', 'scheduled'),
    (fc_midtjylland_id, fc_copenhagen_id, dk_id, now() + interval '5 days', 'Superliga', 'MCH Arena', 'scheduled'),
    (brondby_id, fc_midtjylland_id, dk_id, now() + interval '8 days', 'Superliga', 'Brøndby Stadium', 'scheduled'),
    
    -- Sweden - Allsvenskan
    (aik_id, ifk_goteborg_id, se_id, now() + interval '3 days', 'Allsvenskan', 'Friends Arena', 'scheduled'),
    (malmo_id, aik_id, se_id, now() + interval '6 days', 'Allsvenskan', 'Eleda Stadion', 'scheduled'),
    (ifk_goteborg_id, malmo_id, se_id, now() + interval '9 days', 'Allsvenskan', 'Ullevi', 'scheduled'),
    
    -- Norway - Eliteserien
    (rosenborg_id, molde_id, no_id, now() + interval '4 days', 'Eliteserien', 'Lerkendal Stadion', 'scheduled'),
    (molde_id, rosenborg_id, no_id, now() + interval '7 days', 'Eliteserien', 'Aker Stadion', 'scheduled'),
    
    -- Finland - Veikkausliiga
    (hjk_id, kups_id, fi_id, now() + interval '1 day', 'Veikkausliiga', 'Bolt Arena', 'scheduled'),
    (kups_id, hjk_id, fi_id, now() + interval '10 days', 'Veikkausliiga', 'Savon Sanomat Areena', 'scheduled'),
    
    -- Netherlands - Eredivisie
    (ajax_id, psv_id, nl_id, now() + interval '3 days', 'Eredivisie', 'Johan Cruyff Arena', 'scheduled'),
    (psv_id, ajax_id, nl_id, now() + interval '11 days', 'Eredivisie', 'Philips Stadion', 'scheduled');

END $$;