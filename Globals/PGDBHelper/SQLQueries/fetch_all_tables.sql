SELECT TABLE_NAME
FROM information_schema.tables
WHERE table_schema='postgres'
  AND table_type='BASE TABLE';

