/*
  # Sample Data for NordMatchAI

  1. Sample teams, trusted sources, matches, and predictions
  2. Mock articles and events for demonstration
*/

-- Get country IDs for reference
DO $$
DECLARE
    dk_id uuid;
    se_id uuid;
    no_id uuid;
    fi_id uuid;
    nl_id uuid;
BEGIN
    SELECT id INTO dk_id FROM countries WHERE code = 'DK';
    SELECT id INTO se_id FROM countries WHERE code = 'SE';
    SELECT id INTO no_id FROM countries WHERE code = 'NO';
    SELECT id INTO fi_id FROM countries WHERE code = 'FI';
    SELECT id INTO nl_id FROM countries WHERE code = 'NL';

    -- Sample teams
    INSERT INTO teams (name, country_id, league, home_stadium) VALUES
    -- Denmark
    ('FC Copenhagen', dk_id, 'Superliga', 'Parken Stadium'),
    ('Brøndby IF', dk_id, 'Superliga', 'Brøndby Stadium'),
    ('FC Midtjylland', dk_id, 'Superliga', 'MCH Arena'),
    -- Sweden
    ('AIK Stockholm', se_id, 'Allsvenskan', 'Friends Arena'),
    ('IFK Göteborg', se_id, 'Allsvenskan', 'Ullevi'),
    ('Malmö FF', se_id, 'Allsvenskan', 'Eleda Stadion'),
    -- Norway
    ('Rosenborg BK', no_id, 'Eliteserien', 'Lerkendal Stadion'),
    ('Molde FK', no_id, 'Eliteserien', 'Aker Stadion'),
    -- Finland
    ('HJK Helsinki', fi_id, 'Veikkausliiga', 'Bolt Arena'),
    ('KuPS Kuopio', fi_id, 'Veikkausliiga', 'Savon Sanomat Areena'),
    -- Netherlands
    ('Ajax Amsterdam', nl_id, 'Eredivisie', 'Johan Cruyff Arena'),
    ('PSV Eindhoven', nl_id, 'Eredivisie', 'Philips Stadion');

    -- Sample trusted sources
    INSERT INTO trusted_sources (name, domain, country_id, credibility_score, language) VALUES
    ('Ekstra Bladet Sport', 'ekstrabladet.dk', dk_id, 0.85, 'da'),
    ('BT Sport', 'bt.dk', dk_id, 0.90, 'da'),
    ('Aftonbladet Sport', 'aftonbladet.se', se_id, 0.88, 'sv'),
    ('VG Sport', 'vg.no', no_id, 0.87, 'no'),
    ('Helsingin Sanomat', 'hs.fi', fi_id, 0.89, 'fi'),
    ('De Telegraaf Sport', 'telegraaf.nl', nl_id, 0.86, 'nl');
END $$;