CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE MATERIALIZED VIEW product_search
AS SELECT gtin, ( concat(name, ' ', brand,' ', category)) as search FROM product;

CREATE INDEX product_search_tgrm ON product_search USING GIST (search gist_trgm_ops);

-- The following SQL query is run every day at specific intervals after updates might have been made by Ethanol APIs finding new products
-- REFRESH MATERIALIZED VIEW CONCURRENTLY product_search