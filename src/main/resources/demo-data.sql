DELETE FROM vessels;

INSERT INTO vessels
(vessel_name, cargo_type, delay_reason, risk_level, eta,
arrival_date, departure_date, delay_hours, port_stay_hours, priority_level)

VALUES

('MSC Aurora', 'HAZARDOUS', 'WEATHER', 'CRITICAL',
'2026-06-26 08:00:00', '2026-06-26 20:00:00',
'2026-06-28 10:00:00', 12, 38, 'Urgent'),

('Ever Green', 'GENERAL', 'PORT_CONGESTION', 'LOW',
'2026-06-26 10:00:00', '2026-06-26 12:00:00',
'2026-06-26 20:00:00', 4, 8, 'Low'),

('Ocean Titan', 'FRAGILE', 'MECHANICAL_FAILURE', 'HIGH',
'2026-06-25 18:00:00', '2026-06-27 18:00:00',
'2026-06-29 18:00:00', 48, 48, 'Medium'),

('Sea Voyager', 'REEFER', 'CUSTOMS_DELAY', 'CRITICAL',
'2026-06-26 10:00:00', '2026-06-27 10:00:00',
'2026-06-28 18:00:00', 24, 32, 'High'),

('Blue Horizon', 'GENERAL', 'CREW_ISSUES', 'MEDIUM',
'2026-06-26 09:00:00', '2026-06-27 15:00:00',
'2026-06-28 20:00:00', 6, 10, 'Low'),

('Atlantic Star', 'HAZARDOUS', 'MECHANICAL_FAILURE', 'CRITICAL',
'2026-06-26 11:00:00', '2026-06-28 11:00:00',
'2026-06-30 11:00:00', 48, 40, 'Urgent'),

('Pacific Queen', 'FRAGILE', 'WEATHER', 'HIGH',
'2026-06-26 14:00:00', '2026-06-27 14:00:00',
'2026-06-28 02:00:00', 12, 18, 'Medium'),

('Ocean Pearl', 'GENERAL', 'PORT_CONGESTION', 'LOW',
'2026-06-26 16:00:00', '2026-06-26 20:00:00',
'2026-06-27 06:00:00', 2, 6, 'Low'),

('Marine Spirit', 'REEFER', 'CUSTOMS_DELAY', 'MEDIUM',
'2026-06-26 07:00:00', '2026-06-27 07:00:00',
'2026-06-28 07:00:00', 8, 12, 'Medium'),

('Titan Voyager', 'HAZARDOUS', 'WEATHER', 'CRITICAL',
'2026-06-26 06:00:00', '2026-06-28 06:00:00',
'2026-06-30 06:00:00', 36, 42, 'Urgent'),

('Eastern Glory', 'GENERAL', 'CREW_ISSUES', 'MEDIUM',
'2026-06-26 12:00:00', '2026-06-27 12:00:00',
'2026-06-28 00:00:00', 8, 10, 'Medium'),

('Silver Wave', 'FRAGILE', 'PORT_CONGESTION', 'HIGH',
'2026-06-26 13:00:00', '2026-06-28 13:00:00',
'2026-06-29 13:00:00', 24, 28, 'High'),

('Golden Anchor', 'REEFER', 'WEATHER', 'LOW',
'2026-06-26 17:00:00', '2026-06-26 22:00:00',
'2026-06-27 08:00:00', 3, 7, 'Low'),

('Northern Light', 'GENERAL', 'CUSTOMS_DELAY', 'MEDIUM',
'2026-06-26 18:00:00', '2026-06-27 18:00:00',
'2026-06-28 06:00:00', 10, 14, 'Medium'),

('Southern Cross', 'HAZARDOUS', 'MECHANICAL_FAILURE', 'CRITICAL',
'2026-06-26 19:00:00', '2026-06-29 19:00:00',
'2026-07-01 19:00:00', 72, 50, 'Urgent');